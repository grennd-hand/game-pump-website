import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// 获取用户信息或创建新用户
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

    // 查找现有用户或创建新用户
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      user = new User({
        walletAddress,
        username: `User_${walletAddress.slice(-6)}`,
        totalVotes: 0,
        totalTokens: 0,
        availableVotes: 0,
        solBalance: 0,
        level: 1,
        experience: 0,
        achievements: [],
        preferences: {
          language: 'en',
          notifications: true
        }
      });
      await user.save();
    } else {
      // 更新最后活跃时间
      user.lastActive = new Date();
      await user.save();
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        avatar: user.avatar,
        totalVotes: user.totalVotes,
        totalTokens: user.totalTokens,
        availableVotes: user.availableVotes,
        solBalance: user.solBalance,
        level: user.level,
        experience: user.experience,
        achievements: user.achievements,
        preferences: user.preferences,
        joinedAt: user.joinedAt,
        lastActive: user.lastActive
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
      .select('walletAddress username avatar totalVotes totalTokens availableVotes solBalance level experience');

    const total = await User.countDocuments();

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('获取用户排行榜错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}