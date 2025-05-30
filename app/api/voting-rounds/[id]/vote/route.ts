import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VotingRound from '@/models/VotingRound';
import User from '@/models/User';

// 提交投票
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { walletAddress, votes } = await request.json();
    
    // votes 格式: { gameId: voteCount, ... }
    if (!walletAddress || !votes || typeof votes !== 'object') {
      return NextResponse.json(
        { error: '钱包地址和投票数据是必需的' },
        { status: 400 }
      );
    }

    // 计算总投票数
    const totalVotes = Object.values(votes).reduce((sum: number, count: any) => sum + (count || 0), 0);
    
    if (totalVotes === 0) {
      return NextResponse.json(
        { error: '至少需要投1票' },
        { status: 400 }
      );
    }

    // 查找投票轮次
    const round = await VotingRound.findById(params.id);
    if (!round) {
      return NextResponse.json(
        { error: '投票轮次不存在' },
        { status: 404 }
      );
    }

    // 检查投票轮次状态
    if (round.status !== 'active') {
      return NextResponse.json(
        { error: '投票轮次未激活' },
        { status: 400 }
      );
    }

    // 检查投票是否已结束
    if (new Date() > round.endDate) {
      return NextResponse.json(
        { error: '投票已结束' },
        { status: 400 }
      );
    }

    // 查找用户信息
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在，请先连接钱包' },
        { status: 400 }
      );
    }

    // 检查用户可用投票数
    if ((user.availableVotes || 0) < totalVotes) {
      return NextResponse.json(
        { error: `可用投票数不足，当前可用: ${user.availableVotes || 0}，需要: ${totalVotes}` },
        { status: 400 }
      );
    }

    // 验证游戏ID是否存在
    const gameIds = Object.keys(votes);
    const validGameIds = round.games.map((game: any) => game.id);
    const invalidGameIds = gameIds.filter((id: string) => !validGameIds.includes(id));
    
    if (invalidGameIds.length > 0) {
      return NextResponse.json(
        { error: `无效的游戏ID: ${invalidGameIds.join(', ')}` },
        { status: 400 }
      );
    }

    // 检查是否是新参与者
    const hasVotedBefore = round.games.some((game: any) => 
      game.voters.includes(walletAddress)
    );

    // 更新游戏投票数据
    let totalNewVotes = 0;
    const freshlyCreatedProjects = [];
    for (const [gameId, voteCount] of Object.entries(votes)) {
      const gameIndex = round.games.findIndex((game: any) => game.id === gameId);
      const count = Number(voteCount) || 0;
      if (gameIndex !== -1 && count > 0) {
        round.games[gameIndex].votes += count;
        // 如果用户之前没有投过这个游戏，添加到voters列表
        if (!round.games[gameIndex].voters.includes(walletAddress)) {
          round.games[gameIndex].voters.push(walletAddress);
        }
        totalNewVotes += count;
        if (gameIndex === round.games.length - 1) {
          freshlyCreatedProjects.push(round.games[gameIndex]);
        }
      }
    }

    // 更新投票轮次统计
    round.totalVotes += totalNewVotes;
    
    // 如果是新参与者，增加参与者数量
    if (!hasVotedBefore) {
      round.totalParticipants += 1;
    }

    await round.save();

    // 更新用户信息
    await User.findOneAndUpdate(
      { walletAddress },
      { 
        $inc: { 
          totalVotes: totalNewVotes,
          availableVotes: -totalNewVotes // 减少可用投票数
        },
        lastActive: new Date()
      }
    );

    return NextResponse.json({
      success: true,
      message: `成功投票 ${totalNewVotes} 票`,
      votesUsed: totalNewVotes,
      remainingVotes: user.availableVotes - totalNewVotes,
      userTotalVotes: user.totalVotes + totalNewVotes,
      newProjects: freshlyCreatedProjects.map(p => ({
        name: p.name,
        description: p.description,
        votes: p.votes
      }))
    });

  } catch (error) {
    console.error('投票错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}