import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// 获取用户信息或创建新用户
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { walletAddress, username, solBalance } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: '钱包地址是必需的' },
        { status: 400 }
      );
    }

    // 查找现有用户或创建新用户
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      // 生成唯一邀请码
      let inviteCode;
      let isUnique = false;
      while (!isUnique) {
        inviteCode = (User as any).generateInviteCode();
        const existingCode = await User.findOne({ inviteCode });
        if (!existingCode) {
          isUnique = true;
        }
      }

      // 创建新用户
      const newUser = new User({
        walletAddress,
        username: username || `Player_${walletAddress.slice(-6)}`,
        totalVotes: 0,
        totalTokens: 0,
        availableVotes: 0,
        solBalance: solBalance || 0,
        level: 1,
        achievements: [],
        preferences: {
          language: 'zh',
          notifications: true
        },
        inviteCode: inviteCode,
        dailyCheckin: {
          consecutiveDays: 0,
          totalCheckins: 0
        },
        inviteRewards: {
          totalInvites: 0,
          totalRewards: 0
        },
        // 任务系统相关 - 确保新用户有基础积分
        totalPoints: 100,
        completedTasks: 0,
        taskMultiplier: 1.0,
        // 社交媒体账号初始化
        socialAccounts: {
          twitter: {
            username: null,
            verified: false,
            verifiedAt: null
          },
          telegram: {
            username: null,
            userId: null,
            verified: false,
            verifiedAt: null
          }
        }
      });
      await newUser.save();

      user = newUser;
    } else {
      // 更新最后活跃时间
      user.lastActive = new Date();
      
      // 如果现有用户没有邀请码，给他们生成一个
      if (!user.inviteCode) {
        let inviteCode;
        let isUnique = false;
        while (!isUnique) {
          inviteCode = (User as any).generateInviteCode();
          const existingCode = await User.findOne({ inviteCode });
          if (!existingCode) {
            isUnique = true;
          }
        }
        user.inviteCode = inviteCode;
      }
      
      await user.save();
    }

    return NextResponse.json({
      success: true,
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
        inviteRewards: user.inviteRewards,
        // 任务系统相关
        totalPoints: user.totalPoints,
        completedTasks: user.completedTasks,
        taskMultiplier: user.taskMultiplier,
        // 社交媒体账号
        socialAccounts: user.socialAccounts
      }
    });

  } catch (error) {
    console.error('用户API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 获取用户排行榜
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'totalVotes';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    const skip = (page - 1) * limit;
    
    const users = await User.find({})
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(limit)
      .select('walletAddress username avatar totalVotes totalTokens availableVotes solBalance level');

    const total = await User.countDocuments();

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        _id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        avatar: user.avatar,
        totalVotes: user.totalVotes,
        totalTokens: user.totalTokens,
        availableVotes: user.availableVotes,
        solBalance: user.solBalance,
        level: user.level,
        achievements: user.achievements
      })),
      count: users.length
    });

  } catch (error) {
    console.error('获取用户排行榜错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}