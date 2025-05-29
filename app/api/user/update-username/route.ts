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
    if (trimmedUsername.length < 1 || trimmedUsername.length > 20) {
      return NextResponse.json(
        { success: false, error: '用户名长度必须在1-20个字符之间' },
        { status: 400 }
      );
    }

    // 检查用户名是否已被其他用户使用
    const existingUser = await User.findOne({ 
      username: trimmedUsername,
      walletAddress: { $ne: walletAddress }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '该用户名已被使用' },
        { status: 400 }
      );
    }

    // 更新当前用户的用户名
    const updatedUser = await User.findOneAndUpdate(
      { walletAddress },
      { username: trimmedUsername },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: '用户名更新成功',
      user: {
        walletAddress: updatedUser.walletAddress,
        username: updatedUser.username,
        level: updatedUser.level
      }
    });

  } catch (error) {
    console.error('更新用户名失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 