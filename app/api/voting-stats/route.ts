import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VotingRound from '@/models/VotingRound';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // 获取总用户数
    const totalUsers = await User.countDocuments();
    
    // 获取当前活跃的投票轮次
    const currentRound = await VotingRound.findOne({ status: 'active' });
    
    if (!currentRound) {
      return NextResponse.json({
        success: true,
        stats: {
          totalVotes: 0,
          totalParticipants: totalUsers, // 使用总用户数而不是投票参与者数
          timeLeft: null,
          hasActiveRound: false
        }
      });
    }

    // 动态计算真实投票数据
    const votingStats = calculateRealVotingStats(currentRound);
    
    // 计算剩余时间
    const now = new Date();
    const endTime = new Date(currentRound.endDate);
    const timeLeftMs = endTime.getTime() - now.getTime();
    
    let timeLeft = null;
    if (timeLeftMs > 0) {
      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
      timeLeft = { hours, minutes, seconds };
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalVotes: votingStats.totalVotes,
        totalParticipants: totalUsers, // 使用总用户数而不是投票参与者数
        timeLeft,
        hasActiveRound: true,
        roundId: currentRound._id,
        roundTitle: currentRound.title
      }
    });
    
  } catch (error) {
    console.error('获取投票统计错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 计算真实投票统计数据
function calculateRealVotingStats(votingRound: any) {
  let totalVotes = 0;
  const uniqueVoters = new Set();
  
  // 遍历所有游戏，统计真实投票
  for (const game of votingRound.games) {
    if (game.voters && Array.isArray(game.voters)) {
      // 统计该游戏的投票数（去重复投票）
      const gameVotes = game.voters.length;
      totalVotes += gameVotes;
      
      // 添加投票者到唯一投票者集合
      game.voters.forEach((voter: string) => {
        uniqueVoters.add(voter);
      });
    }
  }
  
  return {
    totalVotes,
    totalParticipants: uniqueVoters.size
  };
} 