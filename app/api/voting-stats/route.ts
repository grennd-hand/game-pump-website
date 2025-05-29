import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VotingRound from '@/models/VotingRound';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // 获取当前活跃的投票轮次
    const currentRound = await VotingRound.findOne({ status: 'active' });
    
    if (!currentRound) {
      return NextResponse.json({
        success: true,
        stats: {
          totalVotes: 0,
          totalParticipants: 0,
          timeLeft: null,
          hasActiveRound: false
        }
      });
    }
    
    // 获取参与投票的用户数（7天内有投票记录的用户）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeParticipants = await User.countDocuments({
      lastActive: { $gte: sevenDaysAgo },
      totalVotes: { $gt: 0 }
    });
    
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
        totalVotes: currentRound.totalVotes || 0,
        totalParticipants: activeParticipants,
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