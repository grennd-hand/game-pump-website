import { useState, useEffect } from 'react';
import useSWR from 'swr';

interface Token {
  _id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  creator: string;
  contractAddress?: string;
  totalSupply: number;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  votes: number;
  voters: string[];
  status: 'pending' | 'active' | 'graduated' | 'failed';
  createdAt: string;
  graduatedAt?: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  tags: string[];
  isVerified: boolean;
}

interface TokensResponse {
  success: boolean;
  tokens: Token[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useTokens(
  sortBy: string = 'votes',
  status: string = 'active',
  page: number = 1,
  limit: number = 20,
  search: string = ''
) {
  const query = new URLSearchParams({
    sortBy,
    status,
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });

  const { data, error, mutate } = useSWR<TokensResponse>(
    `/api/tokens?${query}`,
    fetcher,
    {
      refreshInterval: 30000, // 每30秒刷新一次
      revalidateOnFocus: false
    }
  );

  return {
    tokens: data?.tokens || [],
    pagination: data?.pagination,
    loading: !error && !data,
    error,
    mutate
  };
}

export function useToken(id: string) {
  const { data, error, mutate } = useSWR<{ success: boolean; token: Token }>(
    id ? `/api/tokens/${id}` : null,
    fetcher
  );

  return {
    token: data?.token,
    loading: !error && !data,
    error,
    mutate
  };
}

// 投票功能
export function useVote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vote = async (tokenId: string, walletAddress: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tokens/${tokenId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();
      
      if (!data.success) {
        setError(data.error || '投票失败');
        return false;
      }

      return true;
    } catch (err) {
      setError('网络错误');
      console.error('投票错误:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unvote = async (tokenId: string, walletAddress: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tokens/${tokenId}/vote`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();
      
      if (!data.success) {
        setError(data.error || '取消投票失败');
        return false;
      }

      return true;
    } catch (err) {
      setError('网络错误');
      console.error('取消投票错误:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    vote,
    unvote,
    loading,
    error
  };
}