const mongoose = require('mongoose');

// 数据库连接配置
const LOCAL_URI = 'mongodb://localhost:27017/game-pump-local';
const CLOUD_URI = 'mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

class UserResync {
  constructor() {
    this.localDb = null;
    this.cloudDb = null;
  }

  async connect() {
    try {
      console.log('🔌 连接本地数据库...');
      const localConnection = await mongoose.createConnection(LOCAL_URI);
      await new Promise((resolve, reject) => {
        localConnection.once('open', resolve);
        localConnection.once('error', reject);
      });
      this.localDb = localConnection.db;
      console.log('✅ 本地数据库连接成功');

      console.log('🌐 连接云端数据库...');
      const cloudConnection = await mongoose.createConnection(CLOUD_URI);
      await new Promise((resolve, reject) => {
        cloudConnection.once('open', resolve);
        cloudConnection.once('error', reject);
      });
      this.cloudDb = cloudConnection.db;
      console.log('✅ 云端数据库连接成功');

    } catch (error) {
      console.error('❌ 数据库连接失败:', error.message);
      throw error;
    }
  }

  async resyncUsers() {
    try {
      await this.connect();
      
      console.log('\n🔄 开始重新同步用户数据...');
      
      // 获取本地用户数据
      const localUsers = await this.localDb.collection('users').find({}).toArray();
      console.log(`📊 本地用户数据: ${localUsers.length} 条记录`);
      
      if (localUsers.length === 0) {
        console.log('⚠️ 本地无用户数据，无需同步');
        return;
      }
      
      // 显示本地用户详情
      console.log('\n👥 本地用户详情:');
      localUsers.forEach((user, i) => {
        console.log(`${i + 1}. 钱包: ${user.walletAddress ? user.walletAddress.slice(0, 15) + '...' : 'N/A'}`);
        console.log(`   积分: ${user.totalPoints || 0}`);
        console.log(`   投票: ${user.availableVotes || 0}`);
        console.log(`   任务: ${user.completedTasks || 0}`);
        console.log(`   创建时间: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}`);
      });
      
      // 检查云端现有用户数据
      const cloudUsers = await this.cloudDb.collection('users').find({}).toArray();
      console.log(`\n📊 云端现有用户数据: ${cloudUsers.length} 条记录`);
      
      // 清空云端用户集合
      console.log('🗑️ 清空云端用户集合...');
      await this.cloudDb.collection('users').deleteMany({});
      
      // 重新插入用户数据
      console.log(`⬆️ 插入 ${localUsers.length} 条用户记录到云端...`);
      await this.cloudDb.collection('users').insertMany(localUsers, { ordered: false });
      
      // 验证同步结果
      const cloudCount = await this.cloudDb.collection('users').countDocuments();
      console.log(`✅ 云端用户记录数: ${cloudCount}`);
      
      // 验证数据一致性
      const cloudUsersAfter = await this.cloudDb.collection('users').find({}).toArray();
      console.log('\n🔍 验证云端用户数据:');
      cloudUsersAfter.forEach((user, i) => {
        console.log(`${i + 1}. 钱包: ${user.walletAddress ? user.walletAddress.slice(0, 15) + '...' : 'N/A'}`);
        console.log(`   积分: ${user.totalPoints || 0}`);
        console.log(`   投票: ${user.availableVotes || 0}`);
        console.log(`   任务: ${user.completedTasks || 0}`);
      });
      
      console.log('\n='.repeat(50));
      console.log('📊 用户数据重新同步完成');
      console.log('='.repeat(50));
      console.log(`📈 本地用户: ${localUsers.length} 条`);
      console.log(`📈 云端用户: ${cloudCount} 条`);
      console.log(`🎯 同步状态: ${localUsers.length === cloudCount ? '✅ 成功' : '❌ 失败'}`);
      
      if (localUsers.length === cloudCount) {
        console.log('🎉 用户数据同步成功！');
      } else {
        console.log('❌ 用户数据同步失败，请检查错误日志。');
      }
      
    } catch (error) {
      console.error('❌ 用户数据同步失败:', error.message);
      throw error;
    }
  }
}

async function main() {
  const resync = new UserResync();
  
  try {
    await resync.resyncUsers();
    console.log('\n✅ 重新同步程序执行完成');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 重新同步程序执行失败:', error.message);
    process.exit(1);
  }
}

console.log('🔄 准备重新同步用户数据...\n');
main(); 