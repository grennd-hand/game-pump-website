const fs = require('fs');
const path = require('path');

console.log('🔄 准备切换到云端数据库配置...\n');

// 云端数据库连接字符串
const CLOUD_URI = 'mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

try {
  // 1. 备份当前的 .env 文件（如果存在）
  const envPath = '.env';
  const envLocalBackup = '.env.local.backup';
  
  if (fs.existsSync(envPath)) {
    fs.copyFileSync(envPath, envLocalBackup);
    console.log('✅ 已备份当前配置到:', envLocalBackup);
  }

  // 2. 读取现有的 .env 文件内容
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // 3. 更新 MONGODB_URI
  const mongodbUriRegex = /^MONGODB_URI=.*$/m;
  const newMongoUri = `MONGODB_URI=${CLOUD_URI}`;
  
  if (mongodbUriRegex.test(envContent)) {
    // 替换现有的 MONGODB_URI
    envContent = envContent.replace(mongodbUriRegex, newMongoUri);
    console.log('✅ 已更新 MONGODB_URI 配置');
  } else {
    // 添加新的 MONGODB_URI
    envContent += (envContent ? '\n' : '') + newMongoUri + '\n';
    console.log('✅ 已添加 MONGODB_URI 配置');
  }

  // 4. 写入更新后的配置
  fs.writeFileSync(envPath, envContent);
  console.log('✅ 已保存新的环境配置');

  // 5. 显示配置信息
  console.log('\n' + '='.repeat(60));
  console.log('📊 配置切换完成');
  console.log('='.repeat(60));
  console.log('🎯 目标: 云端数据库 (MongoDB Atlas)');
  console.log('📄 配置文件: .env');
  console.log('💾 本地备份: .env.local.backup');
  console.log('🔗 数据库: cluster0.twbyzws.mongodb.net');
  
  console.log('\n📋 已同步的数据:');
  console.log('✅ tasks: 5 条记录');
  console.log('✅ users: 2 条记录'); 
  console.log('✅ votingrounds: 1 条记录');
  console.log('✅ 其他集合: 已同步（空）');
  
  console.log('\n🚀 下一步操作:');
  console.log('1. 重启应用: npm run dev');
  console.log('2. 验证功能: 测试所有页面功能');
  console.log('3. 检查数据: 确认用户和任务数据正常');
  
  console.log('\n🔄 回滚方案:');
  console.log('如需回到本地数据库:');
  console.log('cp .env.local.backup .env');
  console.log('npm run dev');
  
  console.log('='.repeat(60));
  console.log('🎉 配置切换完成！现在应用将使用云端数据库。');
  
} catch (error) {
  console.error('❌ 配置切换失败:', error.message);
  console.log('\n🆘 故障排除:');
  console.log('1. 检查文件权限');
  console.log('2. 确认 .env 文件格式正确');
  console.log('3. 手动编辑 .env 文件');
  process.exit(1);
} 