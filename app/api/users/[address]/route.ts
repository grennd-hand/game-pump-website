import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// 获取特定用户信息
export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    await dbConnect();
    
    const user = await User.findOne({ walletAddress: params.address });
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
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
        level: user.level,
        experience: user.experience,
        achievements: user.achievements,
        preferences: user.preferences,
        joinedAt: user.joinedAt,
        lastActive: user.lastActive
      }
    });

  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 更新用户信息
export async function PUT(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    await dbConnect();
    
    const updateData = await request.json();
    
    const user = await User.findOneAndUpdate(
      { walletAddress: params.address },
      { 
        ...updateData,
        lastActive: new Date()
      },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
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
        level: user.level,
        experience: user.experience,
        achievements: user.achievements,
        preferences: user.preferences,
        joinedAt: user.joinedAt,
        lastActive: user.lastActive
      }
    });

  } catch (error) {
    console.error('更新用户信息错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}