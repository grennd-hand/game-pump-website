const mongoose = require('mongoose');

// 连接数据库 - 使用与API相同的MongoDB Atlas连接
mongoose.connect('mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0');

async function findAllUsers() {
  try {
    console.log('查找所有数据库和集合...');
    
    // 等待数据库连接
    await mongoose.connection.asPromise();
    
    // 获取所有数据库
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('所有数据库:', dbs.databases.map(db => db.name));
    
    // 获取当前数据库的所有集合
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('当前数据库的集合:', collections.map(col => col.name));
    
    // 检查所有集合中的数据
    for (const collection of collections) {
      console.log(`\n检查集合: ${collection.name}`);
      const Model = mongoose.model(collection.name, new mongoose.Schema({}, { strict: false }), collection.name);
      const docs = await Model.find({});
      console.log(`${collection.name}集合中有 ${docs.length} 个文档`);
      
      if (docs.length > 0 && docs.length <= 3) {
        docs.forEach((doc, index) => {
          console.log(`${index + 1}. ${JSON.stringify(doc, null, 2)}`);
        });
      } else if (docs.length > 3) {
        console.log('文档太多，只显示前3个:');
        docs.slice(0, 3).forEach((doc, index) => {
          console.log(`${index + 1}. ${JSON.stringify(doc, null, 2)}`);
        });
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('查找失败:', error);
    process.exit(1);
  }
}

findAllUsers(); 