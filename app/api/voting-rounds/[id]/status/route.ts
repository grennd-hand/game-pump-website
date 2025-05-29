import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VotingRound from '@/models/VotingRound';

// 检查用户投票状态
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: '钱包地址是必需的' },
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

    // 获取用户投票的游戏
    const votedGames = round.games
      .filter((game: any) => game.voters.includes(walletAddress))
      .map((game: any) => game.id);

    // 检查用户是否已达到最大投票限制
    const hasReachedLimit = votedGames.length >= round.votingRules.maxVotesPerWallet;

    return NextResponse.json({
      success: true,
      hasVoted: hasReachedLimit, // 只有达到最大限制才算"已投票完成"
      votedGames,
      votedCount: votedGames.length,
      maxVotes: round.votingRules.maxVotesPerWallet,
      canVoteMore: !hasReachedLimit,
      round: {
        id: round._id,
        title: round.title,
        status: round.status,
        endDate: round.endDate,
        totalVotes: round.totalVotes,
        totalParticipants: round.totalParticipants
      }
    });

  } catch (error) {
    console.error('检查投票状态错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 