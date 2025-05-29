import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
  try {
    // 重新验证所有页面和API路由的缓存
    revalidatePath('/');
    revalidatePath('/dao');
    revalidatePath('/history');
    revalidatePath('/proposal/[id]');
    
    return NextResponse.json({
      success: true,
      message: '缓存已清除',
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