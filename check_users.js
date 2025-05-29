const mongoose = require('mongoose');

// 连接数据库 - 使用与API相同的MongoDB Atlas连接
mongoose.connect('mongodb+srv://xiaomi:Csm20050615@cluster0.twbyzws.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0');

// 用户模型 - 使用完整的模型结构
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

async function checkUsers() {
  try {
    const users = await User.find({}).select('walletAddress availableVotes experience dailyCheckin').limit(3);
    console.log('数据库中的用户:');
    users.forEach(user => {
      console.log(`- 钱包: ${user.walletAddress}`);
      console.log(`  可用票数: ${user.availableVotes}`);
      console.log(`  经验值: ${user.experience}`);
      console.log(`  签到信息: ${JSON.stringify(user.dailyCheckin)}`);
      console.log('');
    });
    process.exit(0);
  } catch (error) {
    console.error('错误:', error);
    process.exit(1);
  }
}

checkUsers(); 