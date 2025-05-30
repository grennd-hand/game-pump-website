import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Fundraising from '@/models/Fundraising';
import User from '@/models/User';

// 贡献SOL到募集活动
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { walletAddress, amount, txHash } = await request.json();
    
    if (!walletAddress || !amount || amount <= 0) {
      return NextResponse.json(
        { error: '钱包地址和有效金额是必需的' },
        { status: 400 }
      );
    }

    // 查找募集活动
    const fundraising = await Fundraising.findById(params.id);
    if (!fundraising) {
      return NextResponse.json(
        { error: '募集活动不存在' },
        { status: 404 }
      );
    }

    // 检查募集活动状态
    if (fundraising.status !== 'active') {
      return NextResponse.json(
        { error: '募集活动未激活' },
        { status: 400 }
      );
    }

    // 检查募集是否已结束
    if (new Date() > fundraising.endDate) {
      return NextResponse.json(
        { error: '募集已结束' },
        { status: 400 }
      );
    }

    // 检查贡献金额限制
    if (amount < fundraising.minContribution) {
      return NextResponse.json(
        { error: `最小贡献金额为 ${fundraising.minContribution} SOL` },
        { status: 400 }
      );
    }

    if (amount > fundraising.maxContribution) {
      return NextResponse.json(
        { error: `最大贡献金额为 ${fundraising.maxContribution} SOL` },
        { status: 400 }
      );
    }

    // 检查用户总贡献是否超过限制
    const userTotalContribution = fundraising.contributors
      .filter((c: any) => c.wallet === walletAddress)
      .reduce((sum: number, c: any) => sum + c.amount, 0);

    if (userTotalContribution + amount > fundraising.maxContribution) {
      return NextResponse.json(
        { error: `您的总贡献不能超过 ${fundraising.maxContribution} SOL` },
        { status: 400 }
      );
    }

    // 检查是否会超过目标金额
    if (fundraising.raisedSOL + amount > fundraising.targetSOL) {
      return NextResponse.json(
        { error: '贡献金额超过募集目标' },
        { status: 400 }
      );
    }

    // TODO: 验证交易哈希（需要集成Solana RPC）
    // if (txHash) {
    //   const isValidTx = await verifyTransaction(txHash, walletAddress, amount);
    //   if (!isValidTx) {
    //     return NextResponse.json(
    //       { error: '无效的交易哈希' },
    //       { status: 400 }
    //     );
    //   }
    // }

    // 添加贡献
    fundraising.contributors.push({
      wallet: walletAddress,
      amount,
      timestamp: new Date(),
      txHash
    });

    fundraising.raisedSOL += amount;

    // 检查里程碑
    for (const milestone of fundraising.milestones) {
      if (!milestone.reached && fundraising.raisedSOL >= milestone.targetAmount) {
        milestone.reached = true;
        milestone.reachedAt = new Date();
      }
    }

    // 检查是否达到目标
    if (fundraising.raisedSOL >= fundraising.targetSOL) {
      fundraising.status = 'completed';
    }

    await fundraising.save();

    // 更新用户经验
    await User.findOneAndUpdate(
      { walletAddress },
      { 
        $set: { lastActive: new Date() }
      }
    );

    // 计算用户将获得的代币数量
    const tokensToReceive = amount / fundraising.tokenAllocation.pricePerToken;

    return NextResponse.json({
      success: true,
      message: '贡献成功',
      contribution: {
        amount,
        tokensToReceive,
        totalRaised: fundraising.raisedSOL,
        progress: (fundraising.raisedSOL / fundraising.targetSOL) * 100
      },
      milestones: fundraising.milestones.filter((m: any) => m.reached)
    });

  } catch (error) {
    console.error('贡献SOL错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}