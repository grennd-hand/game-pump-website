import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    console.log('开始数据库连接诊断...');
    
    // 1. 检查连接状态
    const connectionState = mongoose.connection.readyState;
    console.log('连接状态:', connectionState);
    
    // 2. 强制连接
    await dbConnect();
    
    // 3. 获取数据库信息
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('数据库连接失败');
    }
    
    // 4. 列出所有集合
    const collections = await db.listCollections().toArray();
    console.log('数据库集合:', collections.map(c => c.name));
    
    // 5. 检查Mongoose模型使用的collection名称
    const userModelCollectionName = User.collection.name;
    console.log('User模型使用的collection名称:', userModelCollectionName);
    
    // 6. 通过Mongoose模型查询
    const mongooseUserCount = await User.countDocuments();
    console.log('Mongoose User.countDocuments():', mongooseUserCount);
    
    // 7. 直接查询各种可能的collection名称
    const directQueries: Record<string, any> = {};
    const possibleCollectionNames = ['users', 'user', 'Users', 'User'];
    
    for (const collName of possibleCollectionNames) {
      try {
        const collection = db.collection(collName);
        const count = await collection.countDocuments();
        const docs = await collection.find({}).limit(2).toArray();
        directQueries[collName] = {
          exists: true,
          count,
          sampleDocs: docs.map(d => ({ 
            _id: d._id, 
            walletAddress: d.walletAddress,
            username: d.username 
          }))
        };
      } catch (error) {
        directQueries[collName] = {
          exists: false,
          error: error instanceof Error ? error.message : '查询失败'
        };
      }
    }
    
    // 8. 获取其他集合计数
    const tokensCollection = db.collection('tokens');
    const tokenCount = await tokensCollection.countDocuments();
    
    const proposalsCollection = db.collection('proposals');
    const proposalCount = await proposalsCollection.countDocuments();
    
    const votingroundsCollection = db.collection('votingrounds');
    const votingRoundCount = await votingroundsCollection.countDocuments();
    
    return NextResponse.json({
      success: true,
      connection: {
        state: connectionState,
        dbName: db.databaseName
      },
      collections: collections.map(c => ({ name: c.name, type: c.type })),
      modelInfo: {
        userModelCollection: userModelCollectionName,
        mongooseUserCount: mongooseUserCount
      },
      directQueries,
      otherCounts: {
        tokens: tokenCount,
        proposals: proposalCount,
        votingrounds: votingRoundCount
      }
    });

  } catch (error) {
    console.error('数据库诊断错误:', error);
    return NextResponse.json(
      { 
        error: '数据库诊断失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
} 