import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Token from '@/models/Token';
import User from '@/models/User';

// 为代币投票
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { walletAddress } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: '钱包地址是必需的' },
        { status: 400 }
      );
    }

    // 查找代币
    const token = await Token.findById(params.id);
    if (!token) {
      return NextResponse.json(
        { error: '代币不存在' },
        { status: 404 }
      );
    }

    // 检查用户是否已经投票
    if (token.voters.includes(walletAddress)) {
      return NextResponse.json(
        { error: '您已经为此代币投票了' },
        { status: 400 }
      );
    }

    // 添加投票
    token.voters.push(walletAddress);
    token.votes += 1;
    await token.save();

    // 更新用户投票数
    await User.findOneAndUpdate(
      { walletAddress },
      { 
        $inc: { totalVotes: 1 },
        lastActive: new Date()
      }
    );

    return NextResponse.json({
      success: true,
      message: '投票成功',
      votes: token.votes
    });

  } catch (error) {
    console.error('投票错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 取消投票
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { walletAddress } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: '钱包地址是必需的' },
        { status: 400 }
      );
    }

    // 查找代币
    const token = await Token.findById(params.id);
    if (!token) {
      return NextResponse.json(
        { error: '代币不存在' },
        { status: 404 }
      );
    }

    // 检查用户是否已经投票
    if (!token.voters.includes(walletAddress)) {
      return NextResponse.json(
        { error: '您还没有为此代币投票' },
        { status: 400 }
      );
    }

    // 移除投票
    token.voters = token.voters.filter((voter: string) => voter !== walletAddress);
    token.votes = Math.max(0, token.votes - 1);
    await token.save();

    // 更新用户投票数
    await User.findOneAndUpdate(
      { walletAddress },
      { 
        $inc: { totalVotes: -1 },
        lastActive: new Date()
      }
    );

    return NextResponse.json({
      success: true,
      message: '取消投票成功',
      votes: token.votes
    });

  } catch (error) {
    console.error('取消投票错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}