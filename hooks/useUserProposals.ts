import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface UserProposal {
  id: string;
  title: string;
  description: string;
  author: string;
  status: 'active' | 'passed' | 'failed' | 'pending';
  votesFor: number;
  votesAgainst: number;
  timeLeft: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  type: 'game' | 'governance' | 'technical' | 'funding';
  totalVotes: number;
  supportRate: number;
}

interface UserProposalStats {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  failedProposals: number;
  totalVotes: number;
  averageSupport: number;
}

interface UserProposalsResponse {
  success: boolean;
  proposals: UserProposal[];
  stats: UserProposalStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useUserProposals() {
  const { publicKey } = useWallet();
  const [data, setData] = useState<UserProposalsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProposals = useCallback(async () => {
    if (!publicKey) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/proposals/user?walletAddress=${publicKey.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '获取用户提案历史失败');
      }

      setData(result);
    } catch (err) {
      console.error('获取用户提案历史失败:', err);
      setError(err instanceof Error ? err.message : '获取用户提案历史失败');
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    fetchUserProposals();
  }, [fetchUserProposals]);

  return {
    data,
    loading,
    error,
    refresh: fetchUserProposals,
    hasWallet: !!publicKey
  };
} 