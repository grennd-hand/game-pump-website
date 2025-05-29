import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    
    console.log('User模型collection名称:', User.collection.name);
    console.log('数据库名称:', mongoose.connection.name);
    
    // 使用User模型查询
    const userCount = await User.countDocuments();
    console.log('User.countDocuments()结果:', userCount);
    
    const users = await User.find({});
    console.log('User.find({})结果:', users.length, '个用户');
    
    // 也尝试原生查询对比
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('数据库连接失败');
    }
    
    const usersCollection = db.collection('users');
    const directCount = await usersCollection.countDocuments();
    const directUsers = await usersCollection.find({}).toArray();
    
    console.log('直接查询users collection:', directCount, '个用户');
    
    return NextResponse.json({
      success: true,
      userModel: {
        collectionName: User.collection.name,
        count: userCount,
        users: users.map(u => ({
          _id: u._id,
          walletAddress: u.walletAddress,
          username: u.username,
          joinedAt: u.joinedAt
        }))
      },
      directQuery: {
        collectionName: 'users',
        count: directCount,
        users: directUsers.map(u => ({
          _id: u._id,
          walletAddress: u.walletAddress,
          username: u.username,
          joinedAt: u.joinedAt || u.createdAt
        }))
      },
      database: mongoose.connection.name
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });

  } catch (error) {
    console.error('User模型测试错误:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : '无堆栈信息'
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  }
} 