import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST() {
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
    
    // 只清空应用相关的集合，保留系统集合
    const collectionsToClean = ['users', 'proposals', 'votingrounds', 'tokens', 'fundraisings'];
    
    const results = [];
    
    // 清空指定集合
    for (const collectionName of collectionsToClean) {
      try {
        const deleteResult = await db.collection(collectionName).deleteMany({});
        results.push({
          collection: collectionName,
          deletedCount: deleteResult.deletedCount,
          success: true
        });
      } catch (error: any) {
        results.push({
          collection: collectionName,
          error: error.message,
          success: false
        });
      }
    }
    
    // 验证清空结果
    const finalCounts: Record<string, number> = {};
    for (const collectionName of collectionsToClean) {
      const count = await db.collection(collectionName).countDocuments();
      finalCounts[collectionName] = count;
    }
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: '数据已清空',
      database: db.databaseName,
      deletionResults: results,
      finalCounts,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      success: false
    }, { status: 500 });
  }
} 