import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export interface Proposal {
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
  type: 'game' | 'governance' | 'technical' | 'funding';
  totalVotes?: number;
  passingRate?: number;
  voters?: number;
  requiredVotes?: number;
  passingThreshold?: number;
}

export interface ProposalsResponse {
  success: boolean;
  proposals: Proposal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateProposalData {
  title: string;
  description: string;
  type: 'game' | 'governance' | 'technical' | 'funding';
  durationDays?: number;
}

// 获取提案列表
export function useProposals(status?: string, type?: string) {
  const [data, setData] = useState<ProposalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (type && type !== 'all') params.append('type', type);

      const response = await fetch(`/api/proposals?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '获取提案列表失败');
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取提案列表失败');
    } finally {
      setLoading(false);
    }
  }, [status, type]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  return {
    data,
    loading,
    error,
    refresh: fetchProposals
  };
}

// 创建提案
export function useCreateProposal() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProposal = useCallback(async (proposalData: CreateProposalData) => {
    if (!publicKey) {
      setError('请先连接钱包');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...proposalData,
          walletAddress: publicKey.toString()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '创建提案失败');
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建提案失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  return {
    createProposal,
    loading,
    error
  };
}

// 提案投票
export function useProposalVote() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vote = useCallback(async (proposalId: string, voteType: 'for' | 'against') => {
    if (!publicKey) {
      setError('请先连接钱包');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          vote: voteType
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '投票失败');
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : '投票失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  return {
    vote,
    loading,
    error
  };
}

// 获取单个提案详情
export function useProposal(proposalId: string) {
  const [data, setData] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposal = useCallback(async () => {
    if (!proposalId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/proposals/${proposalId}/vote`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '获取提案详情失败');
      }

      setData(result.proposal);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取提案详情失败');
    } finally {
      setLoading(false);
    }
  }, [proposalId]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  return {
    data,
    loading,
    error,
    refresh: fetchProposal
  };
} 