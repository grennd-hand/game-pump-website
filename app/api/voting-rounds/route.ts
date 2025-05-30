import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VotingRound from '@/models/VotingRound'

// 获取投票轮次列表
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    
    const query: any = {}
    if (status !== 'all') {
      query.status = status
    }
    
    const rounds = await VotingRound.find(query).sort({ roundNumber: -1 })
    
    // 计算真实投票数据
    const processedRounds = rounds.map(round => {
      const roundObj = round.toObject();
      const votingStats = calculateRealVotingData(roundObj);
      
      // 更新游戏投票数据
      roundObj.games = roundObj.games.map((game: any) => ({
        ...game,
        votes: game.voters ? game.voters.length : 0
      }));
      
      // 更新轮次统计
      roundObj.totalVotes = votingStats.totalVotes;
      roundObj.totalParticipants = votingStats.totalParticipants;
      
      return roundObj;
    });
    
    return NextResponse.json({
      success: true,
      rounds: processedRounds
    })
    
  } catch (error) {
    console.error('获取投票轮次错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 计算真实投票数据
function calculateRealVotingData(votingRound: any) {
  let totalVotes = 0;
  const uniqueVoters = new Set();
  
  // 遍历所有游戏，统计真实投票
  for (const game of votingRound.games) {
    if (game.voters && Array.isArray(game.voters)) {
      // 统计该游戏的投票数
      const gameVotes = game.voters.length;
      totalVotes += gameVotes;
      
      // 添加投票者到唯一投票者集合
      game.voters.forEach((voter: string) => {
        uniqueVoters.add(voter);
      });
    }
  }
  
  return {
    totalVotes,
    totalParticipants: uniqueVoters.size
  };
}

// 创建新投票轮次
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const roundData = await request.json()
    
    const round = new VotingRound(roundData)
    await round.save()
    
    return NextResponse.json({
      success: true,
      round
    })
    
  } catch (error) {
    console.error('创建投票轮次错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 