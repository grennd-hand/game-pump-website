const { MongoClient } = require('mongodb');

async function quickTest() {
  try {
    const client = new MongoClient('mongodb://localhost:27017/game-pump-local');
    await client.connect();
    console.log('✅ 连接成功');
    
    const db = client.db();
    const users = await db.collection('users').find({}).limit(1).toArray();
    console.log('👤 用户数据:', users.length > 0 ? '有数据' : '无数据');
    
    if (users.length > 0) {
      console.log('样本用户:', users[0].walletAddress);
    }
    
    await client.close();
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

quickTest(); 