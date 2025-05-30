import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// 使用邀请码注册
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { walletAddress, inviteCode, solBalance } = await request.json();
    
    if (!walletAddress || !inviteCode) {
      return NextResponse.json(
        { error: '钱包地址和邀请码是必需的' },
        { status: 400 }
      );
    }

    // 查找邀请者
    const inviter = await User.findOne({ inviteCode });
    if (!inviter) {
      return NextResponse.json(
        { error: '无效的邀请码' },
        { status: 400 }
      );
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return NextResponse.json(
        { error: '该钱包地址已注册' },
        { status: 400 }
      );
    }

    // 不能邀请自己
    if (inviter.walletAddress === walletAddress) {
      return NextResponse.json(
        { error: '不能使用自己的邀请码' },
        { status: 400 }
      );
    }

    // 检查SOL余额是否满足要求
    const hasValidBalance = (solBalance || 0) >= 0;
    const inviterRewardVotes = hasValidBalance ? 3 : 0; // 只要余额≥0 SOL就给邀请者奖励
    const newUserVotes = 3; // 被邀请者总是获得3票新手奖励

    // 生成新用户的邀请码
    let newUserInviteCode;
    let isUnique = false;
    while (!isUnique) {
      newUserInviteCode = (User as any).generateInviteCode();
      const existingCode = await User.findOne({ inviteCode: newUserInviteCode });
      if (!existingCode) {
        isUnique = true;
      }
    }

    // 创建新用户
    const newUser = new User({
      walletAddress,
      username: `Player_${walletAddress.slice(-6)}`,
      totalVotes: 0,
      totalTokens: 0,
      availableVotes: newUserVotes, // 被邀请者获得3票
      solBalance: solBalance || 0,
      level: 1,
      achievements: ['invited_user'],
      preferences: {
        language: 'zh',
        notifications: true
      },
      inviteCode: newUserInviteCode,
      invitedBy: inviteCode,
      dailyCheckin: {
        consecutiveDays: 0,
        totalCheckins: 0
      },
      inviteRewards: {
        totalInvites: 0,
        totalRewards: 0
      }
    });

    await newUser.save();

    // 更新邀请者的数据
    inviter.invitedUsers.push(walletAddress);
    inviter.inviteRewards.totalInvites += 1;
    
    if (hasValidBalance) {
      inviter.inviteRewards.totalRewards += inviterRewardVotes;
      inviter.availableVotes += inviterRewardVotes;
    }
    
    inviter.lastActive = new Date();

    // 添加成就
    if (inviter.inviteRewards.totalInvites === 1 && !inviter.achievements.includes('first_invite')) {
      inviter.achievements.push('first_invite');
    }
    if (inviter.inviteRewards.totalInvites >= 5 && !inviter.achievements.includes('invite_master')) {
      inviter.achievements.push('invite_master');
    }

    await inviter.save();

    return NextResponse.json({
      success: true,
      message: hasValidBalance 
        ? '邀请注册成功！邀请者获得3票奖励' 
        : '邀请注册成功！但邀请者未获得奖励（需要被邀请者余额≥0 SOL）',
      newUser: {
        id: newUser._id,
        walletAddress: newUser.walletAddress,
        username: newUser.username,
        availableVotes: newUser.availableVotes,
        inviteCode: newUser.inviteCode
      },
      inviterReward: {
        votes: inviterRewardVotes,
        totalInvites: inviter.inviteRewards.totalInvites,
        hasValidBalance
      }
    });

  } catch (error) {
    console.error('邀请注册错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 获取邀请信息
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

    // 获取被邀请用户的详细信息
    const invitedUsersDetails = await User.find(
      { walletAddress: { $in: user.invitedUsers } },
      { walletAddress: 1, username: 1, joinedAt: 1, level: 1 }
    );

    // 动态获取当前主机信息
    const host = request.headers.get('host') || 'localhost:3001';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    return NextResponse.json({
      success: true,
      inviteCode: user.inviteCode,
      inviteStats: {
        totalInvites: user.inviteRewards.totalInvites,
        totalRewards: user.inviteRewards.totalRewards,
        invitedUsers: invitedUsersDetails.map(invitedUser => ({
          walletAddress: invitedUser.walletAddress,
          username: invitedUser.username,
          joinedAt: invitedUser.joinedAt,
          level: invitedUser.level
        }))
      },
      invitedBy: user.invitedBy,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || baseUrl}?invite=${user.inviteCode}`
    });

  } catch (error) {
    console.error('获取邀请信息错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 