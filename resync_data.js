const { MongoClient } = require('mongodb');

async function resyncData() {
  console.log('🔄 开始重新同步数据...\n');
  
  const cloudUri = "mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";
  const localUri = "mongodb://localhost:27017/gamepump";
  
  let cloudClient, localClient;
  
  try {
    // 连接本地数据库
    console.log('🏠 连接本地数据库...');
    localClient = new MongoClient(localUri);
    await localClient.connect();
    const localDb = localClient.db('gamepump');
    const localUsers = await localDb.collection('users').find({}).toArray();
    
    console.log(`📊 本地找到 ${localUsers.length} 个用户`);
    
    // 连接云端数据库
    console.log('☁️  连接云端数据库...');
    cloudClient = new MongoClient(cloudUri);
    await cloudClient.connect();
    const cloudDb = cloudClient.db('test');
    
    // 清空云端数据
    console.log('🗑️  清空云端旧数据...');
    await cloudDb.collection('users').deleteMany({});
    
    // 转换并插入数据
    console.log('📤 同步数据到云端...');
    for (const user of localUsers) {
      const cloudUser = {
        walletAddress: user.walletAddress,
        username: user.username,
        votes: user.totalVotes || user.votes || 0,
        checkinDays: user.checkinDays || 0,
        inviteCount: user.inviteCount || 0,
        inviteCode: user.inviteCode,
        invitedBy: user.invitedBy,
        achievements: user.achievements || [],
        gamesWon: user.gamesWon || 0,
        gamesPlayed: user.gamesPlayed || 0,
        createdAt: user.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      await cloudDb.collection('users').insertOne(cloudUser);
      console.log(`✅ ${user.username || 'Player_' + user.walletAddress?.slice(-6)} - 投票:${cloudUser.votes} 签到:${cloudUser.checkinDays} 邀请:${cloudUser.inviteCount}`);
    }
    
    // 验证同步结果
    console.log('\n🔍 验证同步结果...');
    const cloudUsers = await cloudDb.collection('users').find({}).toArray();
    console.log(`☁️  云端现在有 ${cloudUsers.length} 个用户`);
    
    // 按积分排序显示前3名
    const ranked = cloudUsers
      .map(user => ({
        username: user.username || `Player_${user.walletAddress?.slice(-6)}`,
        score: (user.checkinDays || 0) * 3 + (user.votes || 0) * 2 + (user.inviteCount || 0) * 5
      }))
      .sort((a, b) => b.score - a.score);
    
    console.log('\n🏆 排行榜前3名:');
    ranked.slice(0, 3).forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} - ${user.score}分`);
    });
    
    console.log('\n✅ 数据同步完成！');
    
  } catch (error) {
    console.error('❌ 同步失败:', error.message);
  } finally {
    if (cloudClient) await cloudClient.close();
    if (localClient) await localClient.close();
  }
}

resyncData(); 