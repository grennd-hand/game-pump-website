'use client'

import useSWR from 'swr';

interface Stats {
  totalTokens: number;
  totalUsers: number;
  activeUsers: number;
  totalVotes: number;
  activeTokens: number;
  graduatedTokens: number;
  newTokens24h: number;
  newUsers24h: number;
  totalMarketCap: number;
  recentTokens: Array<{
    _id: string;
    name: string;
    symbol: string;
    image: string;
    votes: number;
    createdAt: string;
  }>;
  topTokens: Array<{
    _id: string;
    name: string;
    symbol: string;
    image: string;
    votes: number;
    marketCap: number;
  }>;
  activeProposals?: number;
  governanceParticipation?: number;
  stakedTokens?: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useStats() {
  const { data, error, mutate } = useSWR<{ success: boolean; stats: Stats }>(
    '/api/stats',
    fetcher,
    {
      refreshInterval: 60000, // 每分钟刷新一次
      revalidateOnFocus: false
    }
  );

  return {
    stats: data?.stats,
    loading: !error && !data,
    error,
    mutate
  };
}

export default useStats;