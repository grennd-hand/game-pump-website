#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// 连接配置
const CLOUD_URI = "mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority";
const LOCAL_URI = "mongodb://localhost:27017/game-pump-local";

console.log('🔄 开始数据迁移...\n');

async function migrateData() {
  let cloudClient, localClient;
  
  try {
    // 连接到云端数据库
    console.log('📡 连接到云端MongoDB...');
    cloudClient = new MongoClient(CLOUD_URI);
    await cloudClient.connect();
    console.log('✅ 云端连接成功');

    // 连接到本地数据库
    console.log('💻 连接到本地MongoDB...');
    localClient = new MongoClient(LOCAL_URI);
    await localClient.connect();
    console.log('✅ 本地连接成功');

    const cloudDb = cloudClient.db();
    const localDb = localClient.db();

    // 获取所有集合
    const collections = await cloudDb.listCollections().toArray();
    console.log(`\n📊 发现 ${collections.length} 个集合:`);
    collections.forEach(col => console.log(`  - ${col.name}`));

    const migrationResults = [];

    // 迁移每个集合
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      
      try {
        console.log(`\n🔄 迁移集合: ${collectionName}`);
        
        // 从云端读取数据
        const cloudCollection = cloudDb.collection(collectionName);
        const documents = await cloudCollection.find({}).toArray();
        
        console.log(`  📥 从云端读取 ${documents.length} 条记录`);

        if (documents.length > 0) {
          // 清空本地集合（如果存在）
          const localCollection = localDb.collection(collectionName);
          await localCollection.deleteMany({});
          
          // 插入到本地
          const result = await localCollection.insertMany(documents);
          console.log(`  📤 成功导入 ${result.insertedCount} 条记录`);
          
          migrationResults.push({
            collection: collectionName,
            sourceCount: documents.length,
            migrated: result.insertedCount,
            success: true
          });
        } else {
          console.log(`  ⚠️  集合为空，跳过`);
          migrationResults.push({
            collection: collectionName,
            sourceCount: 0,
            migrated: 0,
            success: true
          });
        }

      } catch (error) {
        console.error(`  ❌ 迁移失败: ${error.message}`);
        migrationResults.push({
          collection: collectionName,
          error: error.message,
          success: false
        });
      }
    }

    // 验证迁移结果
    console.log('\n🔍 验证迁移结果...');
    for (const result of migrationResults) {
      if (result.success) {
        const localCollection = localDb.collection(result.collection);
        const localCount = await localCollection.countDocuments();
        console.log(`  ✅ ${result.collection}: ${localCount} 条记录`);
      } else {
        console.log(`  ❌ ${result.collection}: 迁移失败`);
      }
    }

    // 保存迁移报告
    const report = {
      timestamp: new Date().toISOString(),
      sourceUri: 'mongodb+srv://cluster0.twbyzws.mongodb.net',
      targetUri: LOCAL_URI,
      results: migrationResults,
      summary: {
        totalCollections: collections.length,
        successfulMigrations: migrationResults.filter(r => r.success).length,
        failedMigrations: migrationResults.filter(r => !r.success).length,
        totalRecordsMigrated: migrationResults
          .filter(r => r.success)
          .reduce((sum, r) => sum + (r.migrated || 0), 0)
      }
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'migration-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n🎉 数据迁移完成！');
    console.log(`📊 迁移报告已保存到: migration-report.json`);
    console.log(`📈 总计迁移: ${report.summary.totalRecordsMigrated} 条记录`);

  } catch (error) {
    console.error('❌ 迁移过程中出现错误:', error);
  } finally {
    // 关闭连接
    if (cloudClient) await cloudClient.close();
    if (localClient) await localClient.close();
  }
}

// 测试本地连接
async function testLocalConnection() {
  try {
    console.log('🧪 测试本地MongoDB连接...');
    const client = new MongoClient(LOCAL_URI);
    await client.connect();
    
    const db = client.db();
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    
    if (result.ok === 1) {
      console.log('✅ 本地MongoDB连接正常');
    }
    
    await client.close();
    return true;
  } catch (error) {
    console.error('❌ 本地MongoDB连接失败:', error.message);
    console.log('请确保MongoDB服务正在运行：');
    console.log('  - Windows: net start MongoDB');
    console.log('  - 或启动MongoDB Compass');
    return false;
  }
}

// 主函数
async function main() {
  console.log('🗄️  MongoDB数据迁移工具\n');
  console.log('从云端迁移到本地: localhost:27017\n');

  // 先测试本地连接
  const localOk = await testLocalConnection();
  if (!localOk) {
    process.exit(1);
  }

  console.log('');
  
  // 确认迁移
  console.log('⚠️  注意: 这将清空本地数据库中的现有数据');
  console.log('📍 源数据库: MongoDB Atlas (cluster0.twbyzws.mongodb.net)');
  console.log('📍 目标数据库: localhost:27017/game-pump-local');
  console.log('');

  // 在实际环境中，这里可以添加用户确认
  // 为了自动化，我们直接开始迁移
  await migrateData();
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { migrateData, testLocalConnection }; 