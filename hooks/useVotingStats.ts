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
  const [endTime, setEndTime] = useState<Date | null>(null) // 存储结束时间

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
        
        // 如果有活跃轮次，计算结束时间
        if (data.stats.hasActiveRound && data.stats.timeLeft) {
          const now = new Date()
          const { hours, minutes, seconds } = data.stats.timeLeft
          const totalSecondsLeft = hours * 3600 + minutes * 60 + seconds
          const calculatedEndTime = new Date(now.getTime() + totalSecondsLeft * 1000)
          setEndTime(calculatedEndTime)
        } else {
          setEndTime(null)
        }
        
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

  // 计算当前倒计时
  const updateCountdown = () => {
    if (!endTime || !stats) return

    const now = new Date()
    const timeLeftMs = endTime.getTime() - now.getTime()

    if (timeLeftMs > 0) {
      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000)

      setStats(prevStats => prevStats ? {
        ...prevStats,
        timeLeft: { hours, minutes, seconds }
      } : null)
    } else {
      // 时间结束
      setStats(prevStats => prevStats ? {
        ...prevStats,
        timeLeft: { hours: 0, minutes: 0, seconds: 0 }
      } : null)
      setEndTime(null)
    }
  }

  useEffect(() => {
    fetchStats()
    
    // 每30秒从API刷新一次数据
    const apiInterval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(apiInterval)
  }, [])

  // 每秒更新倒计时
  useEffect(() => {
    if (!endTime) return

    const countdownInterval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(countdownInterval)
  }, [endTime])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
} 