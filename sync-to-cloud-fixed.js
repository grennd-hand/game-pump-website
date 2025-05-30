const mongoose = require('mongoose');

// 数据库连接配置
const LOCAL_URI = 'mongodb://localhost:27017/game-pump-local';
const CLOUD_URI = 'mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

class DatabaseSync {
  constructor() {
    this.localDb = null;
    this.cloudDb = null;
    this.syncResults = {
      success: [],
      errors: [],
      totalRecords: 0,
      startTime: new Date()
    };
  }

  async connect() {
    try {
      console.log('🔌 连接本地数据库...');
      const localConnection = await mongoose.createConnection(LOCAL_URI);
      await new Promise((resolve, reject) => {
        localConnection.once('open', resolve);
        localConnection.once('error', reject);
      });
      this.localDb = localConnection.db;
      console.log('✅ 本地数据库连接成功');

      console.log('🌐 连接云端数据库...');
      const cloudConnection = await mongoose.createConnection(CLOUD_URI);
      await new Promise((resolve, reject) => {
        cloudConnection.once('open', resolve);
        cloudConnection.once('error', reject);
      });
      this.cloudDb = cloudConnection.db;
      console.log('✅ 云端数据库连接成功');

    } catch (error) {
      console.error('❌ 数据库连接失败:', error.message);
      throw error;
    }
  }

  async getCollections() {
    try {
      const collections = await this.localDb.listCollections().toArray();
      return collections.map(c => c.name).filter(name => 
        !name.startsWith('system.') && 
        !name.includes('index') &&
        name !== '_test_connection'
      );
    } catch (error) {
      console.error('❌ 获取集合列表失败:', error.message);
      return [];
    }
  }

  async syncCollection(collectionName) {
    try {
      console.log(`\n📋 开始同步集合: ${collectionName}`);
      
      // 获取本地集合数据
      const localCollection = this.localDb.collection(collectionName);
      const localData = await localCollection.find({}).toArray();
      
      console.log(`📊 本地记录数: ${localData.length}`);
      
      if (localData.length === 0) {
        console.log(`⚠️  集合 ${collectionName} 无数据，跳过同步`);
        this.syncResults.success.push({
          collection: collectionName,
          records: 0,
          status: 'empty'
        });
        return;
      }

      // 获取云端集合
      const cloudCollection = this.cloudDb.collection(collectionName);
      
      // 先清空云端集合
      console.log(`🗑️  清空云端集合 ${collectionName}...`);
      await cloudCollection.deleteMany({});
      
      // 批量插入到云端
      console.log(`⬆️  上传 ${localData.length} 条记录到云端...`);
      
      if (localData.length > 0) {
        await cloudCollection.insertMany(localData, { ordered: false });
      }
      
      // 验证同步结果
      const cloudCount = await cloudCollection.countDocuments();
      console.log(`✅ 云端记录数: ${cloudCount}`);
      
      this.syncResults.success.push({
        collection: collectionName,
        records: localData.length,
        status: 'synced'
      });
      
      this.syncResults.totalRecords += localData.length;
      
    } catch (error) {
      console.error(`❌ 集合 ${collectionName} 同步失败:`, error.message);
      this.syncResults.errors.push({
        collection: collectionName,
        error: error.message
      });
    }
  }

  async syncAll() {
    try {
      await this.connect();
      
      console.log('\n🚀 开始数据库同步...');
      console.log('📍 方向: 本地 → 云端');
      
      // 获取所有集合
      const collections = await this.getCollections();
      console.log(`📝 发现集合: ${collections.join(', ')}\n`);
      
      // 逐个同步集合
      for (const collection of collections) {
        await this.syncCollection(collection);
      }
      
      // 生成同步报告
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ 同步过程发生错误:', error.message);
      throw error;
    }
  }

  async generateReport() {
    const endTime = new Date();
    const duration = (endTime - this.syncResults.startTime) / 1000;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 同步完成报告');
    console.log('='.repeat(60));
    console.log(`⏱️  同步时间: ${this.syncResults.startTime.toLocaleString()}`);
    console.log(`⏱️  完成时间: ${endTime.toLocaleString()}`);
    console.log(`⏱️  耗时: ${duration.toFixed(2)} 秒`);
    console.log(`📈 总记录数: ${this.syncResults.totalRecords}`);
    console.log(`✅ 成功集合: ${this.syncResults.success.length}`);
    console.log(`❌ 失败集合: ${this.syncResults.errors.length}`);
    
    console.log('\n📋 详细结果:');
    this.syncResults.success.forEach(result => {
      console.log(`✅ ${result.collection}: ${result.records} 条记录 (${result.status})`);
    });
    
    if (this.syncResults.errors.length > 0) {
      console.log('\n❌ 错误信息:');
      this.syncResults.errors.forEach(error => {
        console.log(`❌ ${error.collection}: ${error.error}`);
      });
    }
    
    // 保存报告到文件
    const report = {
      syncDirection: 'local-to-cloud',
      startTime: this.syncResults.startTime,
      endTime: endTime,
      duration: duration,
      totalRecords: this.syncResults.totalRecords,
      success: this.syncResults.success,
      errors: this.syncResults.errors,
      localUri: LOCAL_URI,
      cloudUri: CLOUD_URI.replace(/:[^:]*@/, ':***@') // 隐藏密码
    };
    
    const fs = require('fs');
    const reportFile = `sync-to-cloud-report-${Date.now()}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`\n📄 详细报告已保存: ${reportFile}`);
    
    console.log('='.repeat(60));
    
    if (this.syncResults.errors.length === 0) {
      console.log('🎉 数据库同步完成！所有数据已成功上传到云端。');
    } else {
      console.log('⚠️  数据库同步完成，但有部分错误，请查看上方错误信息。');
    }
  }
}

// 执行同步
async function main() {
  const sync = new DatabaseSync();
  
  try {
    await sync.syncAll();
    console.log('\n✅ 同步程序执行完成');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 同步程序执行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  console.log('🔄 准备开始数据库同步 (本地 → 云端)');
  console.log('⚠️  注意: 此操作将覆盖云端数据库中的现有数据');
  console.log('📋 按 Ctrl+C 可以随时取消\n');
  
  // 延迟3秒开始，给用户机会取消
  setTimeout(() => {
    main();
  }, 3000);
}

module.exports = DatabaseSync; 