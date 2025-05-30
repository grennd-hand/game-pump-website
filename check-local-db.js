const mongoose = require('mongoose');

async function checkLocalDB() {
  try {
    console.log('🔌 连接本地数据库...');
    await mongoose.connect('mongodb://localhost:27017/game-pump-local');
    console.log('✅ 连接成功');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 本地数据库集合:');
    
    let totalRecords = 0;
    
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`📊 ${col.name}: ${count} 条记录`);
      totalRecords += count;
    }
    
    console.log(`\n📈 总记录数: ${totalRecords}`);
    
    // 显示用户数据样本
    if (collections.find(c => c.name === 'users')) {
      const users = await mongoose.connection.db.collection('users').find({}).limit(3).toArray();
      console.log('\n👥 用户数据样本:');
      users.forEach((user, i) => {
        console.log(`${i + 1}. 钱包: ${user.walletAddress ? user.walletAddress.slice(0, 10) + '...' : 'N/A'}`);
        console.log(`   积分: ${user.totalPoints || 0}`);
        console.log(`   投票: ${user.availableVotes || 0}`);
      });
    }
    
    // 显示任务数据样本
    if (collections.find(c => c.name === 'tasks')) {
      const tasks = await mongoose.connection.db.collection('tasks').find({}).limit(3).toArray();
      console.log('\n📋 任务数据样本:');
      tasks.forEach((task, i) => {
        console.log(`${i + 1}. 任务: ${task.title || task.type}`);
        console.log(`   类型: ${task.category || task.type}`);
        console.log(`   状态: ${task.active ? '激活' : '非激活'}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('\n🔌 数据库连接已关闭');
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

checkLocalDB(); 