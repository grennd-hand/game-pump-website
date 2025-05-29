'use client'

import { useState, useEffect } from 'react'

interface VotingStats {
  totalVotes: number
  totalParticipants: number
  timeLeft: {
    hours: number
    minutes: number 
    seconds: number
  } | null
  hasActiveRound: boolean
  roundId?: string
  roundTitle?: string
}

export function useVotingStats() {
  const [stats, setStats] = useState<VotingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      console.log('🔄 useVotingStats: 开始获取投票统计数据...');
      setLoading(true)
      const response = await fetch('/api/voting-stats')
      const data = await response.json()
      
      console.log('✅ useVotingStats: API响应数据:', data);
      
      if (data.success) {
        setStats(data.stats)
        setError(null)
        console.log('✅ useVotingStats: 数据设置成功:', data.stats);
      } else {
        setError('获取投票统计失败')
        console.error('❌ useVotingStats: API返回失败:', data);
      }
    } catch (err) {
      console.error('❌ useVotingStats: 获取投票统计错误:', err)
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    
    // 每30秒刷新一次数据
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
} 