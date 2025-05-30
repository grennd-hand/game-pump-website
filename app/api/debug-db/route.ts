import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, createAuthError, rateLimit, getClientIP } from '@/lib/auth';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // 限流保护
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 10, 60000)) { // 每分钟最多10次请求
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    // 验证管理员权限
    try {
      const admin = requireAdmin(request);
      console.log(`🔐 管理员 ${admin.walletAddress} 请求调试数据库`);
    } catch (error) {
      return createAuthError('需要管理员权限才能访问调试信息');
    }

    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      return NextResponse.json(
        { error: 'MONGODB_URI 环境变量未设置' }, 
        { status: 500 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db();
    
    // 获取详细统计
    const collections = await db.listCollections().toArray();
    const userCount = await db.collection('users').countDocuments();
    const proposalCount = await db.collection('proposals').countDocuments();
    const votingRoundCount = await db.collection('votingrounds').countDocuments();
    
    // 获取最近的用户
    const recentUsers = await db.collection('users')
      .find({})
      .sort({ joinedAt: -1 })
      .limit(3)
      .project({ walletAddress: 1, joinedAt: 1, username: 1 })
      .toArray();
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      database: {
        uri: uri.substring(0, 30) + '...',
        collections: collections.map(c => c.name),
      },
      counts: {
        users: userCount,
        proposals: proposalCount,
        votingRounds: votingRoundCount
      },
      recentUsers,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message,
        success: false
      }, 
      { status: 500 }
    );
  }
} 