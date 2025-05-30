import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Proposal from '@/models/Proposal';

// 检查并更新提案状态
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const now = new Date();
    
    // 查找所有已过期但状态仍为active的提案
    const expiredProposals = await Proposal.find({
      status: 'active',
      deadline: { $lt: now }
    });

    let updatedCount = 0;
    let passedCount = 0;
    let failedCount = 0;

    for (const proposal of expiredProposals) {
      const totalVotes = proposal.votesFor + proposal.votesAgainst;
      const supportRate = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
      
      let newStatus: 'passed' | 'failed';
      
      // 检查通过条件：支持率≥60% 且 总票数≥50
      if (supportRate >= 60 && totalVotes >= 50) {
        newStatus = 'passed';
        passedCount++;
      } else {
        newStatus = 'failed';
        failedCount++;
      }
      
      proposal.status = newStatus;
      await proposal.save();
      updatedCount++;
      
      console.log(`提案 ${proposal._id} 状态更新为 ${newStatus}`, {
        supportRate: supportRate.toFixed(1),
        totalVotes,
        votesFor: proposal.votesFor,
        votesAgainst: proposal.votesAgainst
      });
    }

    return NextResponse.json({
      success: true,
      message: `状态检查完成，更新了 ${updatedCount} 个提案`,
      statistics: {
        checked: expiredProposals.length,
        updated: updatedCount,
        passed: passedCount,
        failed: failedCount
      }
    });

  } catch (error) {
    console.error('检查提案状态错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 获取提案状态统计
export async function GET() {
  try {
    await dbConnect();

    const statistics = await Proposal.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      active: 0,
      passed: 0,
      failed: 0,
      pending: 0,
      total: 0
    };

    statistics.forEach(stat => {
      stats[stat._id as keyof typeof stats] = stat.count;
      stats.total += stat.count;
    });

    // 检查需要自动更新状态的提案数量
    const now = new Date();
    const needsUpdate = await Proposal.countDocuments({
      status: 'active',
      deadline: { $lt: now }
    });

    return NextResponse.json({
      success: true,
      statistics: stats,
      needsStatusUpdate: needsUpdate
    });

  } catch (error) {
    console.error('获取提案统计错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 