#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔒 开始安全配置...\n');

// 生成强密码
function generateStrongPassword(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// 生成JWT密钥
function generateJWTSecret() {
  return crypto.randomBytes(64).toString('base64');
}

// 创建.env文件
function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env文件已存在，备份到.env.backup');
    fs.copyFileSync(envPath, path.join(process.cwd(), '.env.backup'));
  }

  const envContent = `# 数据库配置 - 请替换为你的实际数据库连接
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# 应用配置
NODE_ENV=development
NEXTAUTH_SECRET=${generateStrongPassword()}
NEXTAUTH_URL=http://localhost:3000

# Solana配置
SOLANA_RPC_URL=https://api.devnet.solana.com

# 安全配置 - 已自动生成强密码
API_SECRET_KEY=${generateStrongPassword(16)}
JWT_SECRET=${generateJWTSecret()}

# 可选配置
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 管理员IP白名单（可选，用逗号分隔）
# ADMIN_IP_WHITELIST=127.0.0.1,192.168.1.100

# 安全增强（生产环境推荐）
# ENABLE_RATE_LIMITING=true
# MAX_REQUESTS_PER_MINUTE=100
# ENABLE_CSRF_PROTECTION=true
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ 创建.env文件成功');
}

// 创建安全配置文档
function createSecurityDocs() {
  const docsContent = `# 🔒 安全配置指南

## 已修复的安全问题

### 1. ✅ 硬编码凭据问题
- 移除了所有硬编码的数据库连接字符串
- 使用环境变量管理敏感信息
- 创建了安全的配置模板

### 2. ✅ API身份验证
- 添加了JWT身份验证系统
- 实现了管理员权限检查
- 对敏感API端点添加了访问控制

### 3. ✅ 输入验证和清理
- 实现了全面的输入验证
- 添加了XSS防护
- 防止NoSQL注入攻击

### 4. ✅ 业务逻辑安全
- 修复了投票系统的重复投票漏洞
- 添加了权限检查和限流保护
- 实现了事务一致性

### 5. ✅ IDOR防护
- 添加了资源所有权验证
- 实现了访问权限控制
- 防止未授权的数据访问

## 安全最佳实践

### 环境变量配置
\`\`\`bash
# 请确保设置以下环境变量：
MONGODB_URI=your-actual-database-connection
JWT_SECRET=your-jwt-secret-key
API_SECRET_KEY=your-api-secret
NEXTAUTH_SECRET=your-nextauth-secret
\`\`\`

### 生产环境部署
1. 更改所有默认密码和密钥
2. 设置正确的CORS域名
3. 启用HTTPS
4. 配置防火墙规则
5. 定期备份数据库

### 监控和审计
- 检查应用日志中的安全审计信息
- 监控异常访问模式
- 定期检查用户权限

### 更新和维护
- 定期更新依赖包
- 监控安全漏洞公告
- 备份和恢复测试

## API安全使用

### 认证头格式
\`\`\`
Authorization: Bearer your-jwt-token
X-API-Key: your-api-key
\`\`\`

### 管理员API访问
管理员API需要：
1. 有效的JWT token
2. isAdmin权限标记
3. 可选的IP白名单验证

### 限流规则
- 一般API：每分钟100次请求
- 投票API：每分钟5次请求
- 敏感操作：每分钟10次请求

## 紧急响应

如发现安全问题：
1. 立即禁用受影响的功能
2. 检查日志文件
3. 更改相关密钥
4. 通知用户（如需要）

## 安全检查清单

- [ ] 所有环境变量已正确设置
- [ ] 默认密码已更改
- [ ] 数据库访问权限最小化
- [ ] API访问已限制
- [ ] 日志监控已启用
- [ ] 备份策略已实施
`;

  fs.writeFileSync(path.join(process.cwd(), 'SECURITY.md'), docsContent);
  console.log('✅ 创建安全文档成功');
}

// 检查现有配置
function checkExistingConfig() {
  console.log('🔍 检查现有配置...\n');
  
  const checks = [
    {
      name: '检查package.json中的安全依赖',
      check: () => {
        const packagePath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packagePath)) {
          const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
          const securityDeps = ['jsonwebtoken', 'zod', 'isomorphic-dompurify'];
          const missing = securityDeps.filter(dep => 
            !pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]
          );
          return missing.length === 0 ? '✅' : `❌ 缺少依赖: ${missing.join(', ')}`;
        }
        return '❌ package.json不存在';
      }
    },
    {
      name: '检查MongoDB连接配置',
      check: () => {
        const mongoPath = path.join(process.cwd(), 'lib/mongodb.ts');
        if (fs.existsSync(mongoPath)) {
          const content = fs.readFileSync(mongoPath, 'utf8');
          return content.includes('process.env.MONGODB_URI') && 
                 !content.includes('mongodb+srv://xiaomi:') ? '✅' : '❌ 仍有硬编码凭据';
        }
        return '❌ mongodb.ts不存在';
      }
    },
    {
      name: '检查身份验证系统',
      check: () => {
        const authPath = path.join(process.cwd(), 'lib/auth.ts');
        return fs.existsSync(authPath) ? '✅' : '❌ auth.ts不存在';
      }
    },
    {
      name: '检查输入验证系统',
      check: () => {
        const validationPath = path.join(process.cwd(), 'lib/validation.ts');
        return fs.existsSync(validationPath) ? '✅' : '❌ validation.ts不存在';
      }
    }
  ];

  checks.forEach(check => {
    console.log(`${check.name}: ${check.check()}`);
  });
  
  console.log('');
}

// 主函数
function main() {
  try {
    checkExistingConfig();
    createEnvFile();
    createSecurityDocs();
    
    console.log('🎉 安全配置完成！\n');
    console.log('📋 下一步操作：');
    console.log('1. 编辑.env文件，设置正确的MONGODB_URI');
    console.log('2. 如果是生产环境，请更改NEXTAUTH_URL');
    console.log('3. 运行npm install确保所有依赖已安装');
    console.log('4. 查看SECURITY.md了解详细安全指南');
    console.log('5. 重启应用以应用新配置\n');
    
    console.log('⚠️  重要提醒：');
    console.log('- 请立即更改数据库密码');
    console.log('- 不要将.env文件提交到版本控制');
    console.log('- 定期检查安全配置');
    
  } catch (error) {
    console.error('❌ 配置过程中出现错误:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { main, generateStrongPassword, generateJWTSecret }; 