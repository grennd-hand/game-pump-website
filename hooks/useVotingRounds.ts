import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
  votes: number;
  voters: string[];
  platform?: string;
  developer?: string;
  released: string;
}

interface VotingRound {
  _id: string;
  title: string;
  description: string;
  games: Game[];
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed';
  totalVotes: number;
  totalParticipants: number;
  votingRules: {
    maxVotesPerWallet: number;
    minSOLBalance: number;
  };
}

interface VoteResponse {
  success: boolean;
  message: string;
  votedGames: string[];
  totalVotes: number;
}

export const useVotingRounds = () => {
  const [votingRounds, setVotingRounds] = useState<VotingRound[]>([]);
  const [currentRound, setCurrentRound] = useState<VotingRound | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取所有投票轮次
  const fetchVotingRounds = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/voting-rounds');
      
      if (!response.ok) {
        let errorMessage = '获取投票轮次失败';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }

      const data = await response.json();

      setVotingRounds(data.rounds);
      
      // 设置当前活跃的投票轮次
      const activeRound = data.rounds.find((round: VotingRound) => round.status === 'active');
      if (activeRound) {
        setCurrentRound(activeRound);
      }

      return data.rounds;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取投票轮次失败';
      setError(errorMessage);
      console.error('获取投票轮次错误:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取特定投票轮次
  const fetchVotingRound = useCallback(async (roundId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/voting-rounds/${roundId}`);
      
      if (!response.ok) {
        let errorMessage = '获取投票轮次失败';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      return data.round;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取投票轮次失败';
      setError(errorMessage);
      console.error('获取投票轮次错误:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化时获取投票轮次
  useEffect(() => {
    fetchVotingRounds();
  }, [fetchVotingRounds]);

  return {
    votingRounds,
    currentRound,
    loading,
    error,
    fetchVotingRounds,
    fetchVotingRound,
    refetch: fetchVotingRounds,
  };
};

export const useVote = () => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitVote = useCallback(async (roundId: string, votes: {[gameId: string]: number}) => {
    if (!publicKey) {
      setError('请先连接钱包');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/voting-rounds/${roundId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          votes,
        }),
      });

      if (!response.ok) {
        let errorMessage = '投票失败';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data: VoteResponse = await response.json();

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '投票失败';
      setError(errorMessage);
      console.error('投票错误:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  const checkVoteStatus = useCallback(async (roundId: string) => {
    if (!publicKey) return null;

    try {
      const response = await fetch(`/api/voting-rounds/${roundId}/status?wallet=${publicKey.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '检查投票状态失败');
      }

      return data;
    } catch (err) {
      console.error('检查投票状态错误:', err);
      return null;
    }
  }, [publicKey]);

  return {
    submitVote,
    checkVoteStatus,
    loading,
    error,
  };
};