import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const API_SECRET_KEY = process.env.API_SECRET_KEY || 'default-api-key-change-in-production';

// 身份验证接口
export interface AuthUser {
  walletAddress: string;
  isAdmin?: boolean;
  timestamp: number;
}

// 生成JWT Token
export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
}

// 验证JWT Token
export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}

// 从请求中提取用户信息
export function getUserFromRequest(request: NextRequest): AuthUser | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.slice(7);
  return verifyToken(token);
}

// 钱包签名验证
export function verifyWalletSignature(message: string, signature: string, publicKey: string): boolean {
  try {
    // 这里应该实现Solana签名验证
    // 暂时返回基本验证
    return signature.length > 0 && publicKey.length > 0;
  } catch (error) {
    return false;
  }
}

// 管理员验证中间件
export function requireAdmin(request: NextRequest): AuthUser {
  const user = getUserFromRequest(request);
  if (!user?.isAdmin) {
    throw new Error('需要管理员权限');
  }
  return user;
}

// 用户验证中间件  
export function requireAuth(request: NextRequest): AuthUser {
  const user = getUserFromRequest(request);
  if (!user) {
    throw new Error('需要身份验证');
  }
  return user;
}

// API密钥验证
export function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === API_SECRET_KEY;
}

// 创建安全的API响应
export function createAuthError(message: string = '身份验证失败'): NextResponse {
  return NextResponse.json(
    { error: message, code: 'UNAUTHORIZED' },
    { 
      status: 401,
      headers: {
        'WWW-Authenticate': 'Bearer realm="API"'
      }
    }
  );
}

// 创建权限错误响应
export function createForbiddenError(message: string = '权限不足'): NextResponse {
  return NextResponse.json(
    { error: message, code: 'FORBIDDEN' },
    { status: 403 }
  );
}

// 限流工具
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(ip);
  
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (clientData.count >= maxRequests) {
    return false;
  }
  
  clientData.count++;
  return true;
}

// 获取客户端IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = forwarded?.split(',')[0] || realIP || 'unknown';
  return clientIP;
} 