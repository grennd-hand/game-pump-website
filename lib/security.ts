import { NextRequest, NextResponse } from 'next/server';

// CORS配置
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    'Access-Control-Max-Age': '86400',
  };
}

// 安全头配置
export function securityHeaders() {
  return {
    // 防止XSS攻击
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    
    // HTTPS强制
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // 内容安全策略
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.devnet.solana.com https://api.mainnet-beta.solana.com",
      "font-src 'self'",
    ].join('; '),
    
    // 推荐人策略
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // 权限策略
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

// 创建安全响应
export function createSecureResponse(data: any, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status });
  
  // 添加安全头
  const headers = { ...corsHeaders(), ...securityHeaders() };
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// 处理OPTIONS请求（CORS预检）
export function handleOptions(): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

// 安全配置检查
export function validateSecurityConfig(): string[] {
  const issues: string[] = [];
  
  // 检查必要的环境变量
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET', 
    'API_SECRET_KEY',
    'NEXTAUTH_SECRET'
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      issues.push(`缺少必要的环境变量: ${envVar}`);
    }
  }
  
  // 检查JWT密钥强度
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    issues.push('JWT_SECRET太短，建议至少32个字符');
  }
  
  // 检查API密钥强度
  const apiKey = process.env.API_SECRET_KEY;
  if (apiKey && apiKey.length < 16) {
    issues.push('API_SECRET_KEY太短，建议至少16个字符');
  }
  
  // 检查生产环境配置
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes('localhost')) {
      issues.push('生产环境需要设置正确的NEXTAUTH_URL');
    }
    
    if (jwtSecret === 'default-secret-change-in-production') {
      issues.push('生产环境必须更改默认JWT密钥');
    }
  }
  
  return issues;
}

// IP白名单检查（管理员功能）
const ADMIN_IP_WHITELIST = process.env.ADMIN_IP_WHITELIST?.split(',') || [];

export function isAdminIPAllowed(ip: string): boolean {
  if (ADMIN_IP_WHITELIST.length === 0) {
    return true; // 如果没有设置白名单，允许所有IP
  }
  
  return ADMIN_IP_WHITELIST.includes(ip) || ADMIN_IP_WHITELIST.includes('*');
}

// 敏感数据脱敏
export function sanitizeForLogging(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const sensitiveFields = ['password', 'secret', 'key', 'token', 'private'];
  const result = { ...data };
  
  for (const [key, value] of Object.entries(result)) {
    const keyLower = key.toLowerCase();
    const isSensitive = sensitiveFields.some(field => keyLower.includes(field));
    
    if (isSensitive) {
      result[key] = '***REDACTED***';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeForLogging(value);
    }
  }
  
  return result;
}

// 检查可疑活动
export function detectSuspiciousActivity(request: NextRequest): string[] {
  const warnings: string[] = [];
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  
  // 检查用户代理
  const suspiciousUserAgents = [
    'curl', 'wget', 'python', 'bot', 'crawler', 'spider'
  ];
  
  if (suspiciousUserAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    warnings.push('检测到可疑的User-Agent');
  }
  
  // 检查来源
  if (referer && !referer.includes(process.env.NEXTAUTH_URL || 'localhost')) {
    warnings.push('请求来源异常');
  }
  
  // 检查请求头
  const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip'];
  for (const header of suspiciousHeaders) {
    const value = request.headers.get(header);
    if (value && value.split(',').length > 3) {
      warnings.push('检测到可能的代理链攻击');
    }
  }
  
  return warnings;
}

// 安全审计日志
export function auditLog(action: string, details: any) {
  const timestamp = new Date().toISOString();
  const sanitizedDetails = sanitizeForLogging(details);
  
  console.log(`🔒 [AUDIT] ${timestamp} - ${action}:`, sanitizedDetails);
  
  // 在生产环境中，这里应该写入专门的审计日志系统
  // 例如：发送到监控服务、写入安全日志文件等
}

// 生成安全的随机字符串
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
} 