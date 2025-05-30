// 修复用户数据同步问题
const dbConnect = require('./lib/mongodb');
const User = require('./models/User');

async function fixUserSync() {
  console.log('🔧 开始修复用户数据同步问题...');
  
  try {
    await dbConnect();
    console.log('✅ 数据库连接成功');
    
    // 查找所有用户
    const users = await User.find({});
    console.log(`📊 找到 ${users.length} 个用户`);
    
    for (const user of users) {
      console.log(`\n🔍 检查用户: ${user.walletAddress}`);
      console.log(`   用户名: ${user.username}`);
      console.log(`   可用票数: ${user.availableVotes}`);
      console.log(`   SOL余额: ${user.solBalance}`);
      console.log(`   总投票数: ${user.totalVotes}`);
      
      // 确保用户有必要的字段
      let needsUpdate = false;
      
      if (!user.dailyCheckin) {
        user.dailyCheckin = {
          consecutiveDays: 0,
          totalCheckins: 0
        };
        needsUpdate = true;
        console.log('   ✅ 添加dailyCheckin字段');
      }
      
      if (!user.inviteRewards) {
        user.inviteRewards = {
          totalInvites: 0,
          totalRewards: 0
        };
        needsUpdate = true;
        console.log('   ✅ 添加inviteRewards字段');
      }
      
      if (!user.inviteCode) {
        user.inviteCode = `USER${Date.now().toString().slice(-6)}`;
        needsUpdate = true;
        console.log('   ✅ 添加inviteCode字段');
      }
      
      if (!user.invitedUsers) {
        user.invitedUsers = [];
        needsUpdate = true;
        console.log('   ✅ 添加invitedUsers字段');
      }
      
      if (needsUpdate) {
        await user.save();
        console.log('   💾 用户数据已更新');
      } else {
        console.log('   ✅ 用户数据完整');
      }
    }
    
    console.log('\n🎉 用户数据同步修复完成！');
    
  } catch (error) {
    console.error('❌ 修复过程中出错:', error);
  } finally {
    process.exit(0);
  }
}

// 运行修复
fixUserSync(); 