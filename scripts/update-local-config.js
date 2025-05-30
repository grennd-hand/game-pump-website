#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('⚙️  更新配置为本地MongoDB...\n');

function updateEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    // 读取现有.env文件
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('📄 找到现有.env文件');
    
    // 备份原文件
    fs.copyFileSync(envPath, path.join(process.cwd(), '.env.cloud.backup'));
    console.log('💾 已备份到.env.cloud.backup');
    
    // 替换MongoDB URI
    envContent = envContent.replace(
      /MONGODB_URI=.*/,
      'MONGODB_URI=mongodb://localhost:27017/game-pump-local'
    );
    
  } else {
    // 创建新的.env文件
    console.log('📄 创建新的.env文件');
    envContent = `# 数据库配置 - 本地MongoDB
MONGODB_URI=mongodb://localhost:27017/game-pump-local

# 应用配置
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000

# Solana配置
SOLANA_RPC_URL=https://api.devnet.solana.com

# 可选配置
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`;
  }
  
  // 写入更新后的内容
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env文件已更新');
}

function updateMongodbConfig() {
  const mongoPath = path.join(process.cwd(), 'lib/mongodb.ts');
  
  if (fs.existsSync(mongoPath)) {
    let content = fs.readFileSync(mongoPath, 'utf8');
    
    // 备份原文件
    fs.copyFileSync(mongoPath, path.join(process.cwd(), 'lib/mongodb.ts.backup'));
    console.log('💾 已备份mongodb.ts');
    
    // 确保使用环境变量并提供本地默认值
    const newContent = content.replace(
      /const MONGODB_URI = process\.env\.MONGODB_URI;/,
      `const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/game-pump-local';`
    );
    
    fs.writeFileSync(mongoPath, newContent);
    console.log('✅ mongodb.ts配置已更新');
  }
}

function testLocalConnection() {
  const { MongoClient } = require('mongodb');
  
  return new Promise(async (resolve) => {
    try {
      console.log('🧪 测试本地数据库连接...');
      const client = new MongoClient('mongodb://localhost:27017/game-pump-local');
      await client.connect();
      
      const db = client.db();
      const collections = await db.listCollections().toArray();
      
      console.log('✅ 本地数据库连接成功');
      console.log(`📊 发现 ${collections.length} 个集合:`);
      collections.forEach(col => console.log(`  - ${col.name}`));
      
      // 检查数据
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`📈 ${col.name}: ${count} 条记录`);
      }
      
      await client.close();
      resolve(true);
    } catch (error) {
      console.error('❌ 本地数据库连接失败:', error.message);
      resolve(false);
    }
  });
}

async function main() {
  try {
    console.log('🏠 配置应用使用本地MongoDB数据库\n');
    
    // 更新环境变量
    updateEnvFile();
    
    // 更新MongoDB配置
    updateMongodbConfig();
    
    console.log('');
    
    // 测试连接
    const connected = await testLocalConnection();
    
    if (connected) {
      console.log('\n🎉 配置更新完成！\n');
      console.log('📋 下一步操作：');
      console.log('1. 重启开发服务器: npm run dev');
      console.log('2. 检查应用是否正常运行');
      console.log('3. 测试数据读写功能');
      console.log('');
      console.log('💡 数据库信息：');
      console.log('  - 本地地址: localhost:27017');
      console.log('  - 数据库名: game-pump-local');
      console.log('  - 云端备份: .env.cloud.backup');
      
    } else {
      console.log('\n⚠️  配置已更新，但无法连接到本地数据库');
      console.log('请确保MongoDB服务正在运行：');
      console.log('  - Windows: net start MongoDB');
      console.log('  - 或启动MongoDB Compass');
    }
    
  } catch (error) {
    console.error('❌ 配置更新失败:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateEnvFile, updateMongodbConfig, testLocalConnection }; 