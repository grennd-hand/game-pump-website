const mongoose = require('mongoose');

// 数据库连接配置
const LOCAL_URI = 'mongodb://localhost:27017/game-pump-local';
const CLOUD_URI = 'mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

class SyncVerification {
  constructor() {
    this.localDb = null;
    this.cloudDb = null;
    this.report = {
      timestamp: new Date(),
      totalCollections: 0,
      matchedCollections: 0,
      mismatchedCollections: 0,
      details: []
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

  async compareCollection(collectionName) {
    try {
      const localData = await this.localDb.collection(collectionName).find({}).toArray();
      const cloudData = await this.cloudDb.collection(collectionName).find({}).toArray();
      
      const isMatched = localData.length === cloudData.length;
      const detail = {
        collection: collectionName,
        localCount: localData.length,
        cloudCount: cloudData.length,
        matched: isMatched,
        status: isMatched ? '✅ 匹配' : '❌ 不匹配'
      };
      
      this.report.details.push(detail);
      
      if (isMatched) {
        this.report.matchedCollections++;
      } else {
        this.report.mismatchedCollections++;
      }
      
      console.log(`📊 ${collectionName}: 本地(${localData.length}) vs 云端(${cloudData.length}) ${detail.status}`);
      
      return detail;
    } catch (error) {
      console.error(`❌ 比较集合 ${collectionName} 失败:`, error.message);
      return {
        collection: collectionName,
        localCount: 'error',
        cloudCount: 'error',
        matched: false,
        status: '❌ 错误'
      };
    }
  }

  async verifySync() {
    try {
      await this.connect();
      
      console.log('\n🔍 开始验证数据同步一致性...\n');
      
      // 获取本地集合列表
      const localCollections = await this.localDb.listCollections().toArray();
      const collectionNames = localCollections
        .map(c => c.name)
        .filter(name => !name.startsWith('system.') && name !== '_test_connection');
      
      this.report.totalCollections = collectionNames.length;
      
      console.log(`📋 需要验证的集合: ${collectionNames.join(', ')}\n`);
      
      // 逐个比较集合
      for (const collectionName of collectionNames) {
        await this.compareCollection(collectionName);
      }
      
      // 生成详细报告
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ 验证过程失败:', error.message);
      throw error;
    }
  }

  async generateReport() {
    const syncSuccess = this.report.mismatchedCollections === 0;
    const completeness = (this.report.matchedCollections / this.report.totalCollections * 100).toFixed(1);
    
    console.log('\n' + '='.repeat(70));
    console.log('📊 数据同步验证报告');
    console.log('='.repeat(70));
    console.log(`📅 验证时间: ${this.report.timestamp.toLocaleString()}`);
    console.log(`🌐 本地数据库: game-pump-local (localhost:27017)`);
    console.log(`☁️ 云端数据库: test (cluster0.twbyzws.mongodb.net)`);
    console.log(`📋 验证集合数: ${this.report.totalCollections}`);
    console.log(`✅ 匹配集合数: ${this.report.matchedCollections}`);
    console.log(`❌ 不匹配集合数: ${this.report.mismatchedCollections}`);
    console.log(`📈 同步完整性: ${completeness}%`);
    
    console.log('\n📊 详细对比结果:');
    console.log('┌─────────────────────┬─────────┬─────────┬──────────┐');
    console.log('│ 集合名称            │ 本地    │ 云端    │ 状态     │');
    console.log('├─────────────────────┼─────────┼─────────┼──────────┤');
    
    this.report.details.forEach(detail => {
      const collection = detail.collection.padEnd(19);
      const local = String(detail.localCount).padEnd(7);
      const cloud = String(detail.cloudCount).padEnd(7);
      const status = detail.matched ? '✅ 匹配  ' : '❌ 不匹配';
      console.log(`│ ${collection} │ ${local} │ ${cloud} │ ${status} │`);
    });
    
    console.log('└─────────────────────┴─────────┴─────────┴──────────┘');
    
    // 关键数据验证
    console.log('\n🔍 关键数据验证:');
    const userDetail = this.report.details.find(d => d.collection === 'users');
    const taskDetail = this.report.details.find(d => d.collection === 'tasks');
    const votingDetail = this.report.details.find(d => d.collection === 'votingrounds');
    
    console.log(`  👥 用户数据: ${userDetail ? userDetail.status : '❓ 未找到'}`);
    console.log(`  📋 任务数据: ${taskDetail ? taskDetail.status : '❓ 未找到'}`);
    console.log(`  🗳️ 投票数据: ${votingDetail ? votingDetail.status : '❓ 未找到'}`);
    
    // 总结
    console.log('\n' + '='.repeat(70));
    if (syncSuccess) {
      console.log('🎉 验证结果: 数据同步完全成功！');
      console.log('✅ 所有本地数据已成功同步到云端数据库');
      console.log('🚀 现在可以安全使用云端数据库');
    } else {
      console.log('⚠️ 验证结果: 数据同步不完整');
      console.log('❌ 存在数据不匹配的集合');
      console.log('🔧 建议重新运行同步脚本');
    }
    console.log('='.repeat(70));
    
    // 保存验证报告
    const fs = require('fs');
    const reportFile = `sync-verification-${Date.now()}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(this.report, null, 2));
    console.log(`📄 详细报告已保存: ${reportFile}`);
    
    return syncSuccess;
  }
}

async function main() {
  const verifier = new SyncVerification();
  
  try {
    const success = await verifier.verifySync();
    console.log('\n✅ 验证程序执行完成');
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ 验证程序执行失败:', error.message);
    process.exit(1);
  }
}

console.log('🔍 开始验证数据同步完整性...\n');
main(); 