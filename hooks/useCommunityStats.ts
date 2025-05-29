import { useState, useEffect } from 'react';

interface CommunityStats {
  totalMembers: number;
  activeProposals: number;
  participationRate: number;
  governanceParticipationRate: number;
  totalVoters: number;
  stakedTokens: string;
  stakedTokensRaw: number;
  growth: {
    members: string;
    proposals: string;
    participation: string;
    staked: string;
  };
}

export function useCommunityStats() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/community/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.error || '获取统计数据失败');
      }
    } catch (err) {
      console.error('获取社区统计数据失败:', err);
      setError(err instanceof Error ? err.message : '获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  };
} 