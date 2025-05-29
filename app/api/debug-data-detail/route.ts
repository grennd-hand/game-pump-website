import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      return NextResponse.json({
        error: 'MONGODB_URI 环境变量未设置'
      }, { status: 500 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    
    // 获取具体数据
    const users = await db.collection('users').find({}).toArray();
    const proposals = await db.collection('proposals').find({}).toArray();
    const votingRounds = await db.collection('votingrounds').find({}).toArray();
    const tokens = await db.collection('tokens').find({}).toArray();
    const fundraisings = await db.collection('fundraisings').find({}).toArray();
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      database: {
        name: db.databaseName,
        uri: uri.substring(0, 50) + '...'
      },
      data: {
        users: {
          count: users.length,
          items: users.map(u => ({
            id: u._id?.toString(),
            username: u.username,
            walletAddress: u.walletAddress,
            joinedAt: u.joinedAt
          }))
        },
        proposals: {
          count: proposals.length,
          items: proposals.map(p => ({
            id: p._id?.toString(),
            title: p.title,
            status: p.status,
            createdAt: p.createdAt
          }))
        },
        votingRounds: {
          count: votingRounds.length,
          items: votingRounds.map(v => ({
            id: v._id?.toString(),
            roundNumber: v.roundNumber,
            status: v.status,
            createdAt: v.createdAt
          }))
        },
        tokens: {
          count: tokens.length,
          items: tokens.slice(0, 3)
        },
        fundraisings: {
          count: fundraisings.length,
          items: fundraisings.slice(0, 3)
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      success: false
    }, { status: 500 });
  }
} 