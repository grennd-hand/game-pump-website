const { MongoClient } = require('mongodb');

async function clearAllData() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ 连接到MongoDB成功');
    
    const db = client.db('game-pump-local');
    
    // 检查现有集合
    const collections = await db.listCollections().toArray();
    console.log('📁 找到集合:', collections.map(c => c.name));
    
    // 清除所有集合
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`🗑️ 清除集合: ${collectionName}`);
      
      const result = await db.collection(collectionName).deleteMany({});
      console.log(`   删除了 ${result.deletedCount} 条记录`);
    }
    
    console.log('\n🎉 所有数据已清除！');
    
    // 验证清除结果
    console.log('\n=== 验证清除结果 ===');
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`${collection.name}: ${count} 条记录`);
    }
    
  } catch (error) {
    console.error('❌ 清除数据失败:', error);
  } finally {
    await client.close();
    console.log('✅ 数据库连接已关闭');
  }
}

console.log('🚨 即将清除game-pump-local数据库中的所有数据...');
console.log('⏳ 3秒后开始清除...');

setTimeout(() => {
  clearAllData();
}, 3000); 