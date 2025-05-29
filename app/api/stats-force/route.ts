import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Token from '@/models/Token';
import User from '@/models/User';

// 强制获取最新统计数据（绕过所有缓存）
export async function GET(request: NextRequest) {
  // 添加随机参数防止缓存
  const timestamp = new Date().getTime();
  
  try {
    await dbConnect();
    
    // 强制重新连接数据库
    console.log(`[${timestamp}] 强制获取统计数据`);
    
    // 计算活跃玩家（7天内有活动的用户）
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // 强制重新查询数据库
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ lastActive: { $gte: sevenDaysAgo } });
    const totalTokens = await Token.countDocuments();
    const activeTokens = await Token.countDocuments({ status: 'active' });
    
    // 获取投票总数
    const totalVotesResult = await Token.aggregate([
      { $group: { _id: null, total: { $sum: '$votes' } } }
    ]);
    const totalVotes = totalVotesResult[0]?.total || 0;
    
    console.log(`[${timestamp}] 查询结果: 用户=${totalUsers}, 活跃=${activeUsers}, 代币=${totalTokens}`);

    // 返回数据，添加防缓存头
    return NextResponse.json({
      success: true,
      stats: {
        totalTokens,
        totalUsers,
        activeUsers,
        totalVotes,
        activeTokens,
        graduatedTokens: await Token.countDocuments({ status: 'graduated' }),
        newTokens24h: 0, // 简化计算
        newUsers24h: 0,  // 简化计算
        totalMarketCap: 0, // 简化计算
        recentTokens: [],
        topTokens: []
      },
      timestamp,
      cache: false
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error(`[${timestamp}] 获取统计数据错误:`, error);
    return NextResponse.json(
      { 
        error: '服务器内部错误',
        timestamp,
        details: error instanceof Error ? error.message : '未知错误'
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
  }
} 