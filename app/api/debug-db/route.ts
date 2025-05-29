import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
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