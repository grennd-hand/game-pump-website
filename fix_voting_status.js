const { MongoClient } = require('mongodb');

async function fixVotingStatus() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('✅ 连接到MongoDB成功');
    
    const db = client.db('test');
    const collection = db.collection('votingrounds');
    
    // 检查当前状态
    const rounds = await collection.find({}).toArray();
    console.log('📊 总投票轮次数量:', rounds.length);
    
    if (rounds.length > 0) {
      console.log('\n📋 当前状态:');
      rounds.forEach((round, index) => {
        console.log(`${index + 1}. ${round.title || '未命名'} - 状态: ${round.status} - 游戏数: ${round.games?.length || 0}`);
      });
      
      // 将第一个轮次设为 active
      const result = await collection.updateOne(
        { _id: rounds[0]._id },
        { 
          $set: { 
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天后
          } 
        }
      );
      
      console.log('\n✅ 更新结果:', result.modifiedCount > 0 ? '成功' : '无变化');
      
      // 验证更新
      const updatedRound = await collection.findOne({ _id: rounds[0]._id });
      console.log('🎮 更新后状态:', updatedRound.status);
      console.log('📈 游戏数量:', updatedRound.games.length);
      
    } else {
      console.log('❌ 没有找到投票轮次，需要重新初始化');
    }
    
  } catch (error) {
    console.error('❌ 操作错误:', error.message);
  } finally {
    await client.close();
    console.log('📚 MongoDB连接已关闭');
  }
}

fixVotingStatus(); 