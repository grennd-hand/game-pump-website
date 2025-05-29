import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Proposal from '@/models/Proposal';
import User from '@/models/User';

// 获取用户的历史提案
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!walletAddress) {
      return NextResponse.json(
        { error: '钱包地址是必需的' },
        { status: 400 }
      );
    }

    // 查询用户的提案
    const proposals = await Proposal.find({ author: walletAddress })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // 获取总数
    const total = await Proposal.countDocuments({ author: walletAddress });

    // 获取用户信息
    const user = await User.findOne({ walletAddress });

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

    // 格式化提案数据
    const formattedProposals = proposals.map((proposal: any) => ({
      id: proposal._id,
      title: proposal.title,
      description: proposal.description,
      author: user?.username || `${proposal.author.slice(0, 6)}...${proposal.author.slice(-4)}`,
      status: proposal.status,
      votesFor: proposal.votesFor,
      votesAgainst: proposal.votesAgainst,
      timeLeft: formatTimeLeft(new Date(proposal.deadline)),
      category: proposal.metadata.category,
      createdAt: proposal.createdAt,
      updatedAt: proposal.updatedAt,
      type: proposal.type,
      // 计算投票率和通过率
      totalVotes: proposal.votesFor + proposal.votesAgainst,
      supportRate: proposal.votesFor + proposal.votesAgainst > 0 
        ? Math.round((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100) 
        : 0
    }));

    // 计算统计数据
    const stats = {
      totalProposals: total,
      activeProposals: proposals.filter((p: any) => p.status === 'active').length,
      passedProposals: proposals.filter((p: any) => p.status === 'passed').length,
      failedProposals: proposals.filter((p: any) => p.status === 'failed').length,
      totalVotes: proposals.reduce((sum: number, p: any) => sum + p.votesFor + p.votesAgainst, 0),
      averageSupport: proposals.length > 0 
        ? Math.round(proposals.reduce((sum: number, p: any) => {
            const total = p.votesFor + p.votesAgainst;
            return sum + (total > 0 ? (p.votesFor / total) * 100 : 0);
          }, 0) / proposals.length) 
        : 0
    };

    return NextResponse.json({
      success: true,
      proposals: formattedProposals,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('获取用户提案历史错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 