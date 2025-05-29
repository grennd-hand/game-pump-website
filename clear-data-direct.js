// 直接连接MongoDB清除数据
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

async function clearAllData() {
  console.log('🔗 正在连接MongoDB...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ MongoDB连接成功');
    
    const db = client.db('test');
    
    // 1. 清除所有用户
    console.log('🗑️  清除用户数据...');
    const userResult = await db.collection('users').deleteMany({});
    console.log(`   删除了 ${userResult.deletedCount} 个用户`);
    
    // 2. 重置投票轮次
    console.log('🔄 重置投票轮次...');
    const rounds = await db.collection('votingrounds').find({}).toArray();
    
    for (const round of rounds) {
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
    console.log(`   重置了 ${rounds.length} 个投票轮次`);
    
    console.log('\n🎉 数据清除完成！');
    console.log(`📊 统计:
   • 删除用户: ${userResult.deletedCount} 个
   • 重置轮次: ${rounds.length} 个
   • 所有游戏投票数已重置为 0`);
    
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
  } finally {
    await client.close();
    console.log('📤 数据库连接已关闭');
  }
}

// 执行清除
clearAllData(); 