const mongoose = require('mongoose');

// 连接数据库 - 使用与API相同的MongoDB Atlas连接
mongoose.connect('mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0');

// 用户模型
const UserSchema = new mongoose.Schema({
  walletAddress: String,
  availableVotes: Number,
  experience: Number,
  dailyCheckin: {
    lastCheckinDate: Date,
    consecutiveDays: Number,
    totalCheckins: Number
  }
}, { collection: 'users' });

const User = mongoose.model('User', UserSchema);

async function resetCheckin() {
  const walletAddress = '3auWMFnc1ZbvDZe5d72QoUmZZe9DmbQUBXUTJKoJN4jZ';
  
  try {
    console.log('重置用户签到状态...');
    
    // 重置签到状态 - 将lastCheckinDate设为昨天
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const result = await User.updateOne(
      { walletAddress },
      {
        $set: {
          'dailyCheckin.lastCheckinDate': yesterday,
          'dailyCheckin.consecutiveDays': 0,
          'dailyCheckin.totalCheckins': 0,
          availableVotes: 0,
          experience: 0
        }
      }
    );
    
    console.log('重置结果:', result);
    
    // 查看重置后的用户数据
    const user = await User.findOne({ walletAddress });
    console.log('重置后的用户数据:');
    console.log(`- 钱包: ${user.walletAddress}`);
    console.log(`- 可用票数: ${user.availableVotes}`);
    console.log(`- 经验值: ${user.experience}`);
    console.log(`- 签到信息: ${JSON.stringify(user.dailyCheckin)}`);
    
    process.exit(0);
  } catch (error) {
    console.error('重置失败:', error);
    process.exit(1);
  }
}

resetCheckin(); 