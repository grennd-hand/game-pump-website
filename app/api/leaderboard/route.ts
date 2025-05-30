import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import mongoose from 'mongoose'

// 定义用户数据接口
interface LeaderboardUser {
  walletAddress: string
  username?: string
  totalScore: number
  votes: number
  checkinDays: number
  inviteCount: number
  level: string
  weeklyGain: number
  joinedAt: Date
  createdAt?: Date
  achievements: number
  gamesWon: number
  gamesPlayed: number
  winRate: number
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 排行榜API调用')
    
    await dbConnect()
    const db = mongoose.connection.db
    const usersCollection = db?.collection('users')
    
    if (!usersCollection) {
      throw new Error('数据库连接失败')
    }
    
    console.log('📊 获取用户数据...')
    
    // 直接获取所有用户，然后在代码中排序
    const users = await usersCollection.find({}).toArray()
    console.log(`找到 ${users.length} 个用户`)
    
    // 使用积分计算方案：签到天数*3 + 投票数*2 + 邀请数*5
    const leaderboard = users
      .map((user: any) => {
        const votes = user.totalVotes || user.votes || 0
        const checkinDays = user.dailyCheckin?.totalCheckins || user.checkinDays || 0  
        const inviteCount = user.inviteRewards?.totalInvites || user.inviteCount || 0
        // 使用积分计算方案
        const score = checkinDays * 3 + votes * 2 + inviteCount * 5
        
        let level = 'player'
        if (score >= 1000) level = 'legendary'
        else if (score >= 500) level = 'professional'
        else if (score >= 100) level = 'gamer'
        
        return {
          id: 0, // 稍后设置
          rank: 0, // 稍后设置
          username: user.username || `Player_${user.walletAddress?.slice(-6)}`,
          walletAddress: user.walletAddress,
          score,
          votes,
          checkinDays,
          inviteCount,
          level,
          weeklyGain: 0,
          joinedAt: user.createdAt || new Date(),
          achievements: user.achievements?.length || 0,
          winRate: user.gamesWon && user.gamesPlayed ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0,
          avatar: getAvatarForUser(user.walletAddress)
        }
      })
      .sort((a, b) => b.score - a.score) // 按积分降序排序
      .slice(0, 50) // 取前50名
      .map((user, index) => ({
        ...user,
        id: index + 1,
        rank: index + 1
      }))
    
    console.log(`📈 生成排行榜: ${leaderboard.length} 个用户`)
    console.log('前3名:', leaderboard.slice(0, 3).map(u => `${u.username}(${u.score}分)`))
    
    return NextResponse.json({
      success: true,
      data: {
        leaderboard,
        stats: {
          totalUsers: users.length,
          totalActiveUsers: users.length,
          timeRange: 'alltime',
          updatedAt: new Date().toISOString()
        }
      }
    })
    
  } catch (error: any) {
    console.error('❌ 排行榜API错误:', error.message)
    return NextResponse.json(
      { success: false, error: '获取排行榜失败', details: error.message },
      { status: 500 }
    )
  }
}

// 根据钱包地址生成固定的头像
function getAvatarForUser(walletAddress: string): string {
  const avatars = ['🎮', '👾', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎯', '🎮']
  const hash = walletAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return avatars[hash % avatars.length]
} 