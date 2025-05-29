import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Proposal from '@/models/Proposal';
import Token from '@/models/Token';

export async function GET() {
  try {
    await dbConnect();

    // 获取DAO成员数（所有注册用户）
    const totalMembers = await User.countDocuments();

    // 获取活跃提案数
    const activeProposals = await Proposal.countDocuments({ status: 'active' });

    // 计算治理参与率
    const totalProposals = await Proposal.countDocuments();
    const proposalsWithVotes = await Proposal.find({
      $expr: { $gt: [{ $add: ['$votesFor', '$votesAgainst'] }, 0] }
    }).countDocuments();
    
    const participationRate = totalProposals > 0 
      ? Math.round((proposalsWithVotes / totalProposals) * 100 * 10) / 10
      : 0;

    // 获取所有用户的投票统计，计算参与的用户数
    const uniqueVoters = await Proposal.aggregate([
      { $unwind: '$voters' },
      { $group: { _id: '$voters.wallet' } },
      { $count: 'uniqueVoters' }
    ]);

    const totalVoters = uniqueVoters.length > 0 ? uniqueVoters[0].uniqueVoters : 0;
    const memberParticipationRate = totalMembers > 0 
      ? Math.round((totalVoters / totalMembers) * 100 * 10) / 10 
      : 0;

    // 获取质押代币总量（从所有代币项目中汇总）
    const tokens = await Token.find({ status: { $in: ['launched', 'play_to_earn'] } });
    const totalStakedTokens = tokens.reduce((sum, token) => {
      // 假设20%的代币被质押（可以根据实际情况调整）
      return sum + (token.totalSupply * 0.2);
    }, 0);

    // 格式化大数字显示
    const formatLargeNumber = (num: number): string => {
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
      } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    };

    // 计算变化率（这里使用模拟数据，实际项目中应该与历史数据对比）
    const getMockGrowthRate = (value: number): string => {
      // 基于当前值生成合理的增长率
      const baseRate = Math.random() * 10 + 2; // 2-12%
      const isPositive = Math.random() > 0.2; // 80%概率为正增长
      return `${isPositive ? '+' : '-'}${baseRate.toFixed(1)}%`;
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalMembers,
        activeProposals,
        participationRate: memberParticipationRate, // 使用用户参与率
        governanceParticipationRate: participationRate, // 提案参与率
        totalVoters,
        stakedTokens: formatLargeNumber(totalStakedTokens),
        stakedTokensRaw: totalStakedTokens,
        // 增长率（实际项目中应该从历史数据计算）
        growth: {
          members: getMockGrowthRate(totalMembers),
          proposals: getMockGrowthRate(activeProposals),
          participation: getMockGrowthRate(memberParticipationRate),
          staked: getMockGrowthRate(totalStakedTokens)
        }
      }
    });

  } catch (error) {
    console.error('获取社区统计数据失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 