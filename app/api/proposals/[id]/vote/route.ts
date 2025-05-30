import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Proposal from '@/models/Proposal';
import User from '@/models/User';

// 为提案投票
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { walletAddress, vote } = await request.json();

    // 验证参数
    if (!walletAddress || !vote) {
      return NextResponse.json(
        { error: '钱包地址和投票选择是必需的' },
        { status: 400 }
      );
    }

    if (!['for', 'against'].includes(vote)) {
      return NextResponse.json(
        { error: '投票选择必须是 for 或 against' },
        { status: 400 }
      );
    }

    // 查找提案
    const proposal = await Proposal.findById(params.id);
    if (!proposal) {
      return NextResponse.json(
        { error: '提案不存在' },
        { status: 404 }
      );
    }

    // 检查提案状态
    if (proposal.status !== 'active') {
      return NextResponse.json(
        { error: '提案未激活或已结束' },
        { status: 400 }
      );
    }

    // 检查投票是否已结束
    if (new Date() > proposal.deadline) {
      return NextResponse.json(
        { error: '投票已结束' },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在，请先连接钱包' },
        { status: 400 }
      );
    }

    // 检查用户是否已投票
    const existingVote = proposal.voters.find((voter: any) => voter.wallet === walletAddress);
    if (existingVote) {
      return NextResponse.json(
        { error: '您已经为此提案投票了' },
        { status: 400 }
      );
    }

    // 每个用户每个提案只能投一票，投票权重为1
    const votingPower = 1;

    // 添加投票记录
    proposal.voters.push({
      wallet: walletAddress,
      vote,
      votingPower,
      timestamp: new Date()
    });

    // 更新投票计数 - 每票权重为1
    if (vote === 'for') {
      proposal.votesFor += 1;
    } else {
      proposal.votesAgainst += 1;
    }

    await proposal.save();

    // 投票处理
    await User.findByIdAndUpdate(user._id, {
      $push: { [`proposalVotes.${params.id}`]: { choice: vote, timestamp: new Date() } },
      $set: { lastActive: new Date() }
    });

    // 计算通过率
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const passingRate = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

    return NextResponse.json({
      success: true,
      message: '投票成功',
      choice: vote
    });

  } catch (error) {
    console.error('提案投票错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 获取提案详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const proposal = await Proposal.findById(params.id).lean();
    if (!proposal) {
      return NextResponse.json(
        { error: '提案不存在' },
        { status: 404 }
      );
    }

    // 格式化时间显示
    const formatTimeLeft = (deadline: Date) => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      
      if (diff <= 0) return '已结束';
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) return `${days}天 ${hours}小时`;
      return `${hours}小时`;
    };

    const totalVotes = (proposal as any).votesFor + (proposal as any).votesAgainst;
    const passingRate = totalVotes > 0 ? ((proposal as any).votesFor / totalVotes) * 100 : 0;

    return NextResponse.json({
      success: true,
      proposal: {
        id: (proposal as any)._id,
        title: (proposal as any).title,
        description: (proposal as any).description,
        author: (proposal as any).authorUsername || `${(proposal as any).author.slice(0, 6)}...${(proposal as any).author.slice(-4)}`,
        status: (proposal as any).status,
        votesFor: (proposal as any).votesFor,
        votesAgainst: (proposal as any).votesAgainst,
        totalVotes,
        passingRate: Math.round(passingRate * 10) / 10,
        timeLeft: formatTimeLeft(new Date((proposal as any).deadline)),
        category: (proposal as any).metadata.category,
        createdAt: (proposal as any).createdAt,
        type: (proposal as any).type,
        voters: (proposal as any).voters.length,
        requiredVotes: (proposal as any).metadata.requiredVotes,
        passingThreshold: (proposal as any).metadata.passingThreshold
      }
    });

  } catch (error) {
    console.error('获取提案详情错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 