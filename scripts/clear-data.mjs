import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function clearData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ MongoDB 连接成功');
    
    const db = client.db('test');
    
    // 清除用户数据
    const userResult = await db.collection('users').deleteMany({});
    console.log(`🗑️  已删除 ${userResult.deletedCount} 个用户记录`);
    
    // 重置投票轮次的投票数据
    const rounds = await db.collection('votingrounds').find({}).toArray();
    
    for (const round of rounds) {
      // 重置所有游戏的投票数据
      const updatedGames = round.games.map(game => ({
        ...game,
        votes: 0,
        voters: []
      }));
      
      await db.collection('votingrounds').updateOne(
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
    await client.close();
    console.log('📤 数据库连接已关闭');
  }
}

clearData(); 