const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function clearUsers() {
  try {
    // 连接数据库
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB 连接成功');
    
    // 清除用户数据
    const userResult = await mongoose.connection.db.collection('users').deleteMany({});
    console.log(`🗑️  已删除 ${userResult.deletedCount} 个用户记录`);
    
    // 选择性清除投票轮次的投票记录（保留轮次本身）
    const roundsCollection = mongoose.connection.db.collection('votingrounds');
    const rounds = await roundsCollection.find({}).toArray();
    
    for (const round of rounds) {
      // 重置所有游戏的投票数据
      const updatedGames = round.games.map(game => ({
        ...game,
        votes: 0,
        voters: []
      }));
      
      await roundsCollection.updateOne(
        { _id: round._id },
        {
          $set: {
            games: updatedGames,
            totalVotes: 0,
            totalParticipants: 0
          }
        }
      );
    }
    
    console.log(`🔄 已重置 ${rounds.length} 个投票轮次的投票数据`);
    
    console.log('🎉 数据清除完成！');
    
  } catch (error) {
    console.error('❌ 清除数据失败:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 数据库连接已关闭');
  }
}

// 执行清除
clearUsers(); 