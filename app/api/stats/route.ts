import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Token from '@/models/Token';
import User from '@/models/User';

// 获取平台统计数据
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // 计算活跃玩家（7天内有活动的用户）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // 并行获取各种统计数据
    const [
      totalTokens,
      totalUsers,
      activeUsers,
      totalVotes,
      activeTokens,
      graduatedTokens,
      recentTokens,
      topTokens
    ] = await Promise.all([
      Token.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ lastActive: { $gte: sevenDaysAgo } }),
      Token.aggregate([
        { $group: { _id: null, total: { $sum: '$votes' } } }
      ]),
      Token.countDocuments({ status: 'active' }),
      Token.countDocuments({ status: 'graduated' }),
      Token.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name symbol image votes createdAt'),
      Token.find({ status: 'active' })
        .sort({ votes: -1 })
        .limit(5)
        .select('name symbol image votes marketCap')
    ]);

    // 计算24小时内的新增数据
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const [newTokens24h, newUsers24h] = await Promise.all([
      Token.countDocuments({ createdAt: { $gte: yesterday } }),
      User.countDocuments({ joinedAt: { $gte: yesterday } })
    ]);

    // 计算总市值（模拟数据，实际应该从价格API获取）
    const totalMarketCap = await Token.aggregate([
      { $match: { status: { $in: ['active', 'graduated'] } } },
      { $group: { _id: null, total: { $sum: '$marketCap' } } }
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalTokens,
        totalUsers,
        activeUsers, // 活跃玩家数
        totalVotes: totalVotes[0]?.total || 0,
        activeTokens,
        graduatedTokens,
        newTokens24h,
        newUsers24h,
        totalMarketCap: totalMarketCap[0]?.total || 0,
        recentTokens,
        topTokens
      }
    });

  } catch (error) {
    console.error('获取统计数据错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}