import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { walletAddress, username } = await request.json();

    if (!walletAddress || !username) {
      return NextResponse.json(
        { success: false, error: '钱包地址和用户名是必需的' },
        { status: 400 }
      );
    }

    // 验证用户名格式
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 2 || trimmedUsername.length > 20) {
      return NextResponse.json(
        { success: false, error: '用户名长度必须在2-20个字符之间' },
        { status: 400 }
      );
    }

    // 检查用户名是否包含非法字符
    const usernameRegex = /^[a-zA-Z0-9\u4e00-\u9fa5_]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return NextResponse.json(
        { success: false, error: '用户名只能包含字母、数字、中文和下划线' },
        { status: 400 }
      );
    }

    // 检查是否为当前用户
    const currentUser = await User.findOne({ walletAddress });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    // 如果用户名没有变化，直接返回成功
    if (currentUser.username === trimmedUsername) {
      return NextResponse.json({
        success: true,
        message: '用户名未发生变化',
        user: {
          walletAddress: currentUser.walletAddress,
          username: currentUser.username,
          level: currentUser.level
        }
      });
    }

    // 检查用户名是否已被其他用户使用（双重检查）
    const existingUser = await User.findOne({ 
      username: trimmedUsername,
      walletAddress: { $ne: walletAddress }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '该用户名已被其他用户使用，请选择其他用户名' },
        { status: 400 }
      );
    }

    // 更新当前用户的用户名
    try {
    const updatedUser = await User.findOneAndUpdate(
      { walletAddress },
        { 
          username: trimmedUsername,
          lastActive: new Date()
        },
        { new: true }
      );

      if (!updatedUser) {
        return NextResponse.json(
          { success: false, error: '更新失败，用户不存在' },
          { status: 404 }
    );
      }

    return NextResponse.json({
      success: true,
      message: '用户名更新成功',
      user: {
        _id: updatedUser._id,
        walletAddress: updatedUser.walletAddress,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        totalVotes: updatedUser.totalVotes,
        totalTokens: updatedUser.totalTokens,
        availableVotes: updatedUser.availableVotes,
        solBalance: updatedUser.solBalance,
          level: updatedUser.level,
        achievements: updatedUser.achievements,
        joinedAt: updatedUser.joinedAt,
        lastActive: updatedUser.lastActive,
        dailyCheckin: updatedUser.dailyCheckin,
        inviteRewards: updatedUser.inviteRewards
      }
    });

    } catch (updateError: any) {
      // 处理数据库唯一性约束错误
      if (updateError.code === 11000) {
        return NextResponse.json(
          { success: false, error: '该用户名已被使用，请选择其他用户名' },
          { status: 400 }
        );
      }
      throw updateError;
    }

  } catch (error) {
    console.error('更新用户名失败:', error);
    
    // 更详细的错误信息
    let errorMessage = '服务器内部错误';
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        errorMessage = '该用户名已被使用，请选择其他用户名';
      } else if (error.message.includes('validation')) {
        errorMessage = '用户名格式不正确';
      }
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
} 