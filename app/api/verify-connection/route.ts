import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('数据库连接失败');
    }
    
    // 获取连接信息
    const connectionInfo = {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState,
      user: mongoose.connection.user
    };
    
    // 获取数据库状态
    const adminDb = db.admin();
    const serverStatus = await adminDb.serverStatus();
    
    // 获取所有数据库列表
    const databases = await adminDb.listDatabases();
    
    // 获取当前数据库的集合
    const collections = await db.listCollections().toArray();
    
    // 测试写入权限
    let writePermission = false;
    try {
      const testCollection = db.collection('_test_connection');
      await testCollection.insertOne({ test: true, timestamp: new Date() });
      await testCollection.deleteOne({ test: true });
      writePermission = true;
    } catch (e) {
      writePermission = false;
    }
    
    // 详细查询users collection
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    const userSample = await usersCollection.findOne({});
    const allUsers = await usersCollection.find({}).toArray();
    
    return NextResponse.json({
      success: true,
      connection: connectionInfo,
      server: {
        version: serverStatus.version,
        uptime: serverStatus.uptime,
        host: serverStatus.host
      },
      databases: databases.databases.map(db => ({
        name: db.name,
        sizeOnDisk: db.sizeOnDisk
      })),
      currentDatabase: {
        name: db.databaseName,
        collections: collections.map(c => ({
          name: c.name,
          type: c.type
        }))
      },
      permissions: {
        read: true,
        write: writePermission
      },
      usersCollection: {
        count: userCount,
        sample: userSample,
        allUsers: allUsers.map(u => ({
          _id: u._id,
          walletAddress: u.walletAddress,
          username: u.username,
          createdAt: u.createdAt
        }))
      },
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });

  } catch (error) {
    console.error('连接验证错误:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      details: error instanceof Error ? error.stack : '无详细信息'
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  }
} 