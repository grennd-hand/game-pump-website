import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Proposal from '@/models/Proposal';
import User from '@/models/User';

// 获取所有提案
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 构建查询条件
    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (type && type !== 'all') query.type = type;

    // 查询提案
    const proposals = await Proposal.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // 获取总数
    const total = await Proposal.countDocuments(query);

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
      author: proposal.authorUsername || `${proposal.author.slice(0, 6)}...${proposal.author.slice(-4)}`,
      status: proposal.status,
      votesFor: proposal.votesFor,
      votesAgainst: proposal.votesAgainst,
      timeLeft: formatTimeLeft(new Date(proposal.deadline)),
      category: proposal.metadata.category,
      createdAt: proposal.createdAt,
      type: proposal.type
    }));

    return NextResponse.json({
      success: true,
      proposals: formattedProposals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('获取提案列表错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 创建新提案
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { 
      title, 
      description, 
      type, 
      walletAddress,
      durationDays = 7 
    } = await request.json();

    // 验证必填字段
    if (!title || !description || !type || !walletAddress) {
      return NextResponse.json(
        { error: '标题、描述、类型和钱包地址是必需的' },
        { status: 400 }
      );
    }

    // 验证提案类型
    if (!['game', 'governance', 'technical', 'funding'].includes(type)) {
      return NextResponse.json(
        { error: '无效的提案类型' },
        { status: 400 }
      );
    }

    // 检查用户是否存在
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在，请先连接钱包' },
        { status: 400 }
      );
    }

    // 设置截止日期
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + durationDays);

    // 设置类别映射
    const categoryMap = {
      game: '游戏提案',
      governance: '治理提案', 
      technical: '技术提案',
      funding: '资金提案'
    };

    // 创建提案
    const proposal = new Proposal({
      title: title.slice(0, 200),
      description: description.slice(0, 2000),
      author: walletAddress,
      authorUsername: user.username,
      type,
      deadline,
      metadata: {
        requiredVotes: 50, // 最小需要50票
        passingThreshold: 60, // 60%通过
        category: categoryMap[type as keyof typeof categoryMap]
      }
    });

    await proposal.save();

    return NextResponse.json({
      success: true,
      message: '提案创建成功',
      proposalId: proposal._id,
      proposal: {
        id: proposal._id,
        title: proposal.title,
        description: proposal.description,
        author: user.username || `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        status: proposal.status,
        votesFor: proposal.votesFor,
        votesAgainst: proposal.votesAgainst,
        timeLeft: `${durationDays}天 0小时`,
        category: proposal.metadata.category,
        createdAt: proposal.createdAt,
        type: proposal.type
      }
    });

  } catch (error) {
    console.error('创建提案错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 