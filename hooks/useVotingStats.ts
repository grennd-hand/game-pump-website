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
      setLoading(true)
      const response = await fetch('/api/voting-stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
        setError(null)
      } else {
        setError('获取投票统计失败')
      }
    } catch (err) {
      console.error('获取投票统计错误:', err)
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