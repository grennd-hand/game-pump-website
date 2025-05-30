import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// 绑定社交媒体账号
export async function POST(request) {
  try {
    await dbConnect();
    
    const { walletAddress, platform, username, userId } = await request.json();
    
    // 验证输入
    if (!walletAddress || !platform || !username) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 验证平台类型
    if (!['twitter', 'telegram'].includes(platform)) {
      return NextResponse.json(
        { success: false, error: '不支持的平台类型' },
        { status: 400 }
      );
    }

    // 获取用户信息
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    // 检查账号是否已被其他用户绑定
    const existingBinding = await User.findOne({
      walletAddress: { $ne: walletAddress },
      [`socialAccounts.${platform}.username`]: username
    });

    if (existingBinding) {
      return NextResponse.json(
        { success: false, error: '该账号已被其他用户绑定' },
        { status: 409 }
      );
    }

    // 更新用户的社交账号信息
    const updateData = {
      [`socialAccounts.${platform}.username`]: username,
      [`socialAccounts.${platform}.verified`]: false, // 需要验证
      [`socialAccounts.${platform}.verifiedAt`]: null
    };

    if (platform === 'telegram' && userId) {
      updateData[`socialAccounts.${platform}.userId`] = userId;
    }

    await User.findOneAndUpdate(
      { walletAddress },
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: '社交账号绑定成功，请完成验证任务'
    });

  } catch (error) {
    console.error('❌ 绑定社交账号失败:', error);
    return NextResponse.json(
      { success: false, error: '绑定失败' },
      { status: 500 }
    );
  }
}

// 验证社交媒体账号
export async function PUT(request) {
  try {
    await dbConnect();
    
    const { walletAddress, platform } = await request.json();
    
    // 验证输入
    if (!walletAddress || !platform) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取用户信息
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    // 检查是否已绑定账号
    const socialAccount = user.socialAccounts?.[platform];
    if (!socialAccount?.username) {
      return NextResponse.json(
        { success: false, error: '尚未绑定该平台账号' },
        { status: 400 }
      );
    }

    // 这里应该调用第三方API验证账号
    // 暂时直接标记为已验证
    await User.findOneAndUpdate(
      { walletAddress },
      {
        $set: {
          [`socialAccounts.${platform}.verified`]: true,
          [`socialAccounts.${platform}.verifiedAt`]: new Date()
        }
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: '账号验证成功'
    });

  } catch (error) {
    console.error('❌ 验证社交账号失败:', error);
    return NextResponse.json(
      { success: false, error: '验证失败' },
      { status: 500 }
    );
  }
} 