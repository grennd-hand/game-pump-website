import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: '系统运行正常',
      database: process.env.MONGODB_URI ? 'configured' : 'not configured'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: '系统检查失败'
      }, 
      { status: 500 }
    );
  }
} 