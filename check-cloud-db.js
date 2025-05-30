const mongoose = require('mongoose');

// 云端数据库连接配置
const CLOUD_URI = 'mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function checkCloudDB() {
  try {
    console.log('🌐 连接云端数据库...');
    console.log('🔗 连接地址: cluster0.twbyzws.mongodb.net');
    
    await mongoose.connect(CLOUD_URI);
    console.log('✅ 云端数据库连接成功\n');
    
    // 获取所有集合
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 云端数据库集合列表:');
    
    let totalRecords = 0;
    const collectionData = [];
    
    // 检查每个集合
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`📊 ${col.name}: ${count} 条记录`);
      totalRecords += count;
      collectionData.push({ name: col.name, count });
    }
    
    console.log(`\n📈 云端总记录数: ${totalRecords}\n`);
    
    // 详细检查用户数据
    if (collections.find(c => c.name === 'users')) {
      console.log('👥 用户数据详情:');
      const users = await mongoose.connection.db.collection('users').find({}).toArray();
      users.forEach((user, i) => {
        console.log(`${i + 1}. 钱包: ${user.walletAddress ? user.walletAddress.slice(0, 10) + '...' : 'N/A'}`);
        console.log(`   积分: ${user.totalPoints || 0}`);
        console.log(`   投票: ${user.availableVotes || 0}`);
        console.log(`   任务: ${user.completedTasks || 0}`);
        if (user.socialAccounts) {
          console.log(`   社交: Twitter(${user.socialAccounts.twitter ? '✓' : '✗'}) Telegram(${user.socialAccounts.telegram ? '✓' : '✗'})`);
        }
        console.log('');
      });
    }
    
    // 详细检查任务数据
    if (collections.find(c => c.name === 'tasks')) {
      console.log('📋 任务数据详情:');
      const tasks = await mongoose.connection.db.collection('tasks').find({}).toArray();
      tasks.forEach((task, i) => {
        console.log(`${i + 1}. 任务: ${task.title || task.type}`);
        console.log(`   类型: ${task.category || task.type}`);
        console.log(`   积分: ${task.rewards?.points || 0}`);
        console.log(`   投票: ${task.rewards?.votes || 0}`);
        console.log(`   状态: ${task.active ? '✅ 激活' : '❌ 未激活'}`);
        console.log('');
      });
    }
    
    // 检查投票轮次数据
    if (collections.find(c => c.name === 'votingrounds')) {
      console.log('🗳️ 投票轮次数据:');
      const votingRounds = await mongoose.connection.db.collection('votingrounds').find({}).toArray();
      votingRounds.forEach((round, i) => {
        console.log(`${i + 1}. 轮次: ${round.round || 'N/A'}`);
        console.log(`   状态: ${round.status || 'N/A'}`);
        console.log(`   开始: ${round.startTime ? new Date(round.startTime).toLocaleString() : 'N/A'}`);
        console.log(`   结束: ${round.endTime ? new Date(round.endTime).toLocaleString() : 'N/A'}`);
        console.log('');
      });
    }
    
    // 检查任务完成记录
    if (collections.find(c => c.name === 'usertaskcompletions') || collections.find(c => c.name === 'taskcompletions')) {
      const completionCollection = collections.find(c => c.name === 'usertaskcompletions') ? 'usertaskcompletions' : 'taskcompletions';
      console.log('✅ 任务完成记录:');
      const completions = await mongoose.connection.db.collection(completionCollection).find({}).toArray();
      if (completions.length === 0) {
        console.log('   📝 暂无任务完成记录\n');
      } else {
        completions.forEach((completion, i) => {
          console.log(`${i + 1}. 用户: ${completion.userId || completion.walletAddress}`);
          console.log(`   任务: ${completion.taskId}`);
          console.log(`   状态: ${completion.status}`);
          console.log(`   时间: ${completion.completedAt ? new Date(completion.completedAt).toLocaleString() : 'N/A'}`);
        });
        console.log('');
      }
    }
    
    // 生成验证报告
    console.log('='.repeat(60));
    console.log('📊 云端数据库验证报告');
    console.log('='.repeat(60));
    console.log(`🌐 数据库: MongoDB Atlas`);
    console.log(`🔗 集群: cluster0.twbyzws.mongodb.net`);
    console.log(`📅 检查时间: ${new Date().toLocaleString()}`);
    console.log(`📋 集合数量: ${collections.length}`);
    console.log(`📈 总记录数: ${totalRecords}`);
    
    console.log('\n📊 各集合状态:');
    collectionData.forEach(col => {
      const status = col.count > 0 ? '✅ 有数据' : '⚪ 空集合';
      console.log(`  ${col.name}: ${col.count} 条记录 ${status}`);
    });
    
    // 数据完整性检查
    console.log('\n🔍 数据完整性检查:');
    const hasUsers = collectionData.find(c => c.name === 'users')?.count > 0;
    const hasTasks = collectionData.find(c => c.name === 'tasks')?.count > 0;
    const hasVotingRounds = collectionData.find(c => c.name === 'votingrounds')?.count > 0;
    
    console.log(`  👥 用户数据: ${hasUsers ? '✅ 正常' : '❌ 缺失'}`);
    console.log(`  📋 任务数据: ${hasTasks ? '✅ 正常' : '❌ 缺失'}`);
    console.log(`  🗳️ 投票轮次: ${hasVotingRounds ? '✅ 正常' : '❌ 缺失'}`);
    
    const dataIntegrity = hasUsers && hasTasks && hasVotingRounds;
    console.log(`  🎯 整体状态: ${dataIntegrity ? '✅ 数据完整' : '⚠️ 部分数据缺失'}`);
    
    console.log('='.repeat(60));
    
    if (totalRecords > 0 && dataIntegrity) {
      console.log('🎉 云端数据库验证通过！所有关键数据已成功同步。');
    } else if (totalRecords > 0) {
      console.log('⚠️ 云端数据库有数据，但可能不完整，请检查关键集合。');
    } else {
      console.log('❌ 云端数据库为空，可能同步失败，请重新运行同步脚本。');
    }
    
    await mongoose.disconnect();
    console.log('\n🔌 数据库连接已关闭');
    
  } catch (error) {
    console.error('❌ 云端数据库检查失败:', error.message);
    
    // 连接失败诊断
    if (error.message.includes('authentication')) {
      console.log('\n🔧 诊断建议:');
      console.log('1. 检查数据库用户名和密码');
      console.log('2. 确认数据库用户权限');
      console.log('3. 检查IP白名单设置');
    } else if (error.message.includes('network')) {
      console.log('\n🔧 诊断建议:');
      console.log('1. 检查网络连接');
      console.log('2. 确认防火墙设置');
      console.log('3. 尝试重新连接');
    }
    
    process.exit(1);
  }
}

console.log('🌐 开始检查云端数据库状态...\n');
checkCloudDB(); 