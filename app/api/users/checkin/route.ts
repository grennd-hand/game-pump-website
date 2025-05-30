import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// 每日签到
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { walletAddress } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: '钱包地址是必需的' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 检查是否可以签到
    if (!(user as any).canCheckinToday()) {
      return NextResponse.json(
        { error: '今天已经签到过了' },
        { status: 400 }
      );
    }

    // 获取签到奖励
    const checkinResult = user.performCheckin();
    const { rewardVotes } = checkinResult;
    
    // 保存用户数据
    await user.save();

    return NextResponse.json({
      success: true,
      message: `签到成功！获得 ${rewardVotes} 票奖励`,
      rewardVotes,
      consecutiveDays: checkinResult.consecutiveDays,
      totalCheckins: checkinResult.totalCheckins,
      user: {
        _id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        avatar: user.avatar,
        totalVotes: user.totalVotes,
        totalTokens: user.totalTokens,
        availableVotes: user.availableVotes,
        solBalance: user.solBalance,
        level: user.level,
        achievements: user.achievements,
        joinedAt: user.joinedAt,
        lastActive: user.lastActive,
        dailyCheckin: user.dailyCheckin,
        inviteRewards: user.inviteRewards
      }
    });

  } catch (error) {
    console.error('签到错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 获取签到状态
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: '钱包地址是必需的' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    const canCheckin = (user as any).canCheckinToday();
    
    // 计算下次签到奖励
    const nextConsecutiveDays = canCheckin ? user.dailyCheckin.consecutiveDays + 1 : user.dailyCheckin.consecutiveDays;
    let nextRewardVotes: number;
    let daysUntilBonus: number;
    
    if (nextConsecutiveDays >= 7) {
      nextRewardVotes = 3; // 连续7天及以上：固定3票
      daysUntilBonus = 0;
    } else if (nextConsecutiveDays >= 3) {
      nextRewardVotes = 2; // 连续3-6天：固定2票
      daysUntilBonus = nextConsecutiveDays < 7 ? 7 - nextConsecutiveDays : 0;
    } else {
      // 前3天：随机1-3票，用-1表示随机
      nextRewardVotes = -1; // 特殊值表示随机1-3票
      daysUntilBonus = 3 - nextConsecutiveDays;
    }
    
    return NextResponse.json({
      success: true,
      canCheckin,
      dailyCheckin: user.dailyCheckin,
      nextReward: {
        votes: nextRewardVotes,
        daysUntilBonus: Math.max(0, daysUntilBonus)
      }
    });

  } catch (error) {
    console.error('获取签到状态错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 