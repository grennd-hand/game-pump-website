import { useState, useEffect } from 'react'

export interface LeaderboardUser {
  id: number
  rank: number
  username: string
  walletAddress: string
  avatar: string
  score: number
  votes: number
  checkinDays: number
  inviteCount: number
  level: string
  weeklyGain: number
  joinedAt: Date
  achievements: number
  winRate: number
}

export interface LeaderboardStats {
  totalUsers: number
  totalActiveUsers: number
  timeRange: string
  updatedAt: string
}

export interface LeaderboardData {
  leaderboard: LeaderboardUser[]
  stats: LeaderboardStats
}

export function useLeaderboard(timeRange: string = 'weekly') {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = async (range: string = timeRange) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log(`🔍 正在获取排行榜数据: ${range}`)
      const response = await fetch(`/api/leaderboard?timeRange=${range}&limit=50`)
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('📊 API返回结果:', result)
      
      if (result.success && result.data) {
        console.log('✅ 使用真实排行榜数据:', result.data.leaderboard.length, '个用户')
        setData(result.data)
      } else {
        console.warn('⚠️ API返回失败，使用模拟数据:', result.error)
        setError(result.error || '获取排行榜失败')
        // 只有在真的失败时才使用模拟数据
        setData(getFallbackData(range))
      }
    } catch (err) {
      console.error('❌ 获取排行榜错误:', err)
      setError('网络错误')
      // 只有在网络错误时才使用模拟数据
      setData(getFallbackData(range))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard(timeRange)
  }, [timeRange])

  const refresh = () => {
    console.log('🔄 手动刷新排行榜数据')
    fetchLeaderboard(timeRange)
  }

  return {
    data,
    loading,
    error,
    refresh,
    fetchLeaderboard
  }
}

// 模拟数据作为后备
function getFallbackData(timeRange: string): LeaderboardData {
  const mockUsers: LeaderboardUser[] = [
    {
      id: 1,
      rank: 1,
      username: "游戏大师42",
      walletAddress: "4kHfN...x3Lm9",
      avatar: "🎮",
      score: 15420,
      votes: 2847,
      checkinDays: 45,
      inviteCount: 23,
      level: "legendary",
      weeklyGain: 340,
      joinedAt: new Date('2024-01-15'),
      achievements: 127,
      winRate: 85.3
    },
    {
      id: 2,
      rank: 2,
      username: "区块链战士",
      walletAddress: "7pQz2...k9Bn4",
      avatar: "👾",
      score: 12580,
      votes: 1936,
      checkinDays: 38,
      inviteCount: 18,
      level: "professional",
      weeklyGain: 280,
      joinedAt: new Date('2024-01-20'),
      achievements: 89,
      winRate: 78.9
    },
    {
      id: 3,
      rank: 3,
      username: "NFT收藏家",
      walletAddress: "2mVc8...f7Rp1",
      avatar: "🎯",
      score: 10945,
      votes: 1654,
      checkinDays: 32,
      inviteCount: 15,
      level: "professional",
      weeklyGain: 195,
      joinedAt: new Date('2024-01-25'),
      achievements: 76,
      winRate: 72.4
    },
    {
      id: 4,
      rank: 4,
      username: "DeFi专家",
      walletAddress: "9xYr5...h2Cv6",
      avatar: "🎲",
      score: 8760,
      votes: 1245,
      checkinDays: 28,
      inviteCount: 12,
      level: "gamer",
      weeklyGain: 156,
      joinedAt: new Date('2024-02-01'),
      achievements: 54,
      winRate: 68.7
    },
    {
      id: 5,
      rank: 5,
      username: "元宇宙探索者",
      walletAddress: "3bKl9...p8Wn2",
      avatar: "🎪",
      score: 7234,
      votes: 987,
      checkinDays: 24,
      inviteCount: 9,
      level: "gamer",
      weeklyGain: 128,
      joinedAt: new Date('2024-02-05'),
      achievements: 43,
      winRate: 64.2
    }
  ]

  return {
    leaderboard: mockUsers,
    stats: {
      totalUsers: 1847,
      totalActiveUsers: timeRange === 'weekly' ? 456 : timeRange === 'monthly' ? 892 : 1847,
      timeRange,
      updatedAt: new Date().toISOString()
    }
  }
} 