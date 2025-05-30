import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, createAuthError, createForbiddenError, rateLimit, getClientIP } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    // 限流保护
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 5, 60000)) { // 每分钟最多5次请求
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    // 验证管理员权限
    try {
      const admin = requireAdmin(request);
      console.log(`🔐 管理员 ${admin.walletAddress} 请求清理数据`);
    } catch (error) {
      return createAuthError('需要管理员权限才能执行此操作');
    }

    // 验证请求体
    const { confirmText, collections } = await request.json();
    
    if (confirmText !== 'CONFIRM_DELETE_ALL_DATA') {
      return NextResponse.json(
        { error: '必须提供正确的确认文本' },
        { status: 400 }
      );
    }

    if (!Array.isArray(collections) || collections.length === 0) {
      return NextResponse.json(
        { error: '必须指定要清理的集合' },
        { status: 400 }
      );
    }

    await dbConnect();

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