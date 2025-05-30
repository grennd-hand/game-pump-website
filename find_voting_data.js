const { MongoClient } = require('mongodb');

async function findVotingData() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('✅ 连接到MongoDB成功');
    
    // 检查多个可能的数据库
    const databases = ['test', 'game-pump-db', 'game-pump-local', 'local', 'admin'];
    
    for (const dbName of databases) {
      try {
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        
        console.log(`\n📂 数据库: ${dbName}`);
        console.log('集合:', collections.map(c => c.name).join(', '));
        
        // 查找投票相关集合
        const votingCollections = collections.filter(c => 
          c.name.includes('voting') || c.name.includes('round')
        );
        
        for (const coll of votingCollections) {
          const count = await db.collection(coll.name).countDocuments();
          console.log(`   📊 ${coll.name}: ${count} 个文档`);
          
          if (count > 0) {
            const sample = await db.collection(coll.name).findOne();
            console.log(`   📝 示例文档字段:`, Object.keys(sample));
            if (sample.games) {
              console.log(`   🎮 游戏数量: ${sample.games.length}`);
            }
          }
        }
      } catch (e) {
        console.log(`❌ 无法访问数据库 ${dbName}: ${e.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ 操作错误:', error.message);
  } finally {
    await client.close();
    console.log('\n📚 MongoDB连接已关闭');
  }
}

findVotingData(); 