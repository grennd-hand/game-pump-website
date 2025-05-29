const mongoose = require('mongoose');

// MongoDB连接URI - 请替换为你的实际连接字符串
const MONGODB_URI = 'mongodb+srv://username:password@cluster.mongodb.net/gamepump?retryWrites=true&w=majority';

// 用户模型
const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String, default: '' },
  avatar: { type: String, default: '' },
  totalVotes: { type: Number, default: 0 },
  tokensCreated: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  achievements: [{ type: String }],
  preferences: {
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

// 代币模型
const TokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  creator: { type: String, required: true },
  contractAddress: { type: String, default: null },
  totalSupply: { type: Number, required: true },
  currentPrice: { type: Number, default: 0 },
  marketCap: { type: Number, default: 0 },
  volume24h: { type: Number, default: 0 },
  priceChange24h: { type: Number, default: 0 },
  votes: { type: Number, default: 0 },
  voters: [{ type: String }],
  status: { type: String, enum: ['pending', 'active', 'graduated', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  socialLinks: {
    website: String,
    twitter: String,
    telegram: String,
    discord: String
  },
  tags: [{ type: String }],
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Token = mongoose.model('Token', TokenSchema);

// 测试数据
const testUsers = [
  {
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    username: 'GameMaster',
    totalVotes: 25,
    tokensCreated: 3,
    level: 5,
    experience: 1250
  },
  {
    walletAddress: 'DQyrAcCrDXQ7NeoqGgDCZwBvkDDQMnGjX1pzYwNLCnN',
    username: 'RetroGamer',
    totalVotes: 18,
    tokensCreated: 2,
    level: 4,
    experience: 900
  },
  {
    walletAddress: 'EhpbDdNF8B2ipkjhrfqJzxrNqSueiVMzQLdoQBBdkuKX',
    username: 'PixelHunter',
    totalVotes: 12,
    tokensCreated: 1,
    level: 3,
    experience: 600
  }
];

const testTokens = [
  {
    name: 'Super Mario Token',
    symbol: 'MARIO',
    description: '经典超级马里奥游戏的纪念代币，重温童年回忆！',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    creator: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    totalSupply: 1000000,
    currentPrice: 0.05,
    marketCap: 50000,
    volume24h: 2500,
    votes: 156,
    voters: ['7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', 'DQyrAcCrDXQ7NeoqGgDCZwBvkDDQMnGjX1pzYwNLCnN'],
    status: 'active',
    tags: ['gaming', 'retro', 'platformer'],
    socialLinks: {
      website: 'https://mario.nintendo.com',
      twitter: 'https://twitter.com/nintendo'
    }
  },
  {
    name: 'Tetris Block Token',
    symbol: 'TETRIS',
    description: '俄罗斯方块游戏代币，每个方块都是一个NFT！',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    creator: 'DQyrAcCrDXQ7NeoqGgDCZwBvkDDQMnGjX1pzYwNLCnN',
    totalSupply: 500000,
    currentPrice: 0.08,
    marketCap: 40000,
    volume24h: 1800,
    votes: 134,
    voters: ['DQyrAcCrDXQ7NeoqGgDCZwBvkDDQMnGjX1pzYwNLCnN'],
    status: 'active',
    tags: ['puzzle', 'classic', 'blocks']
  },
  {
    name: 'Pac-Man Coin',
    symbol: 'PAC',
    description: '吃豆人游戏代币，收集所有豆子获得奖励！',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
    creator: 'EhpbDdNF8B2ipkjhrfqJzxrNqSueiVMzQLdoQBBdkuKX',
    totalSupply: 800000,
    currentPrice: 0.03,
    marketCap: 24000,
    volume24h: 1200,
    votes: 89,
    voters: [],
    status: 'pending',
    tags: ['arcade', 'classic', 'maze']
  },
  {
    name: 'Space Invaders Token',
    symbol: 'INVADER',
    description: '太空侵略者游戏代币，保卫地球获得代币奖励！',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400',
    creator: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    totalSupply: 1200000,
    currentPrice: 0.04,
    marketCap: 48000,
    volume24h: 2100,
    votes: 112,
    voters: ['7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', 'EhpbDdNF8B2ipkjhrfqJzxrNqSueiVMzQLdoQBBdkuKX'],
    status: 'active',
    tags: ['shooter', 'space', 'retro']
  },
  {
    name: 'Zelda Adventure Token',
    symbol: 'ZELDA',
    description: '塞尔达传说冒险代币，探索海拉尔大陆！',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
    creator: 'DQyrAcCrDXQ7NeoqGgDCZwBvkDDQMnGjX1pzYwNLCnN',
    totalSupply: 750000,
    currentPrice: 0.12,
    marketCap: 90000,
    volume24h: 4500,
    votes: 203,
    voters: ['7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', 'DQyrAcCrDXQ7NeoqGgDCZwBvkDDQMnGjX1pzYwNLCnN', 'EhpbDdNF8B2ipkjhrfqJzxrNqSueiVMzQLdoQBBdkuKX'],
    status: 'active',
    tags: ['adventure', 'rpg', 'nintendo'],
    socialLinks: {
      website: 'https://zelda.nintendo.com',
      twitter: 'https://twitter.com/nintendo'
    }
  }
];

async function initDatabase() {
  try {
    console.log('连接到MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB连接成功');

    // 清空现有数据（可选）
    console.log('清理现有数据...');
    await User.deleteMany({});
    await Token.deleteMany({});

    // 插入测试用户
    console.log('插入测试用户...');
    await User.insertMany(testUsers);
    console.log(`✅ 插入了 ${testUsers.length} 个测试用户`);

    // 插入测试代币
    console.log('插入测试代币...');
    await Token.insertMany(testTokens);
    console.log(`✅ 插入了 ${testTokens.length} 个测试代币`);

    // 显示统计信息
    const userCount = await User.countDocuments();
    const tokenCount = await Token.countDocuments();
    const totalVotes = await Token.aggregate([
      { $group: { _id: null, total: { $sum: '$votes' } } }
    ]);
    const totalMarketCap = await Token.aggregate([
      { $group: { _id: null, total: { $sum: '$marketCap' } } }
    ]);

    console.log('\n📊 数据库统计:');
    console.log(`用户数量: ${userCount}`);
    console.log(`代币数量: ${tokenCount}`);
    console.log(`总投票数: ${totalVotes[0]?.total || 0}`);
    console.log(`总市值: ${totalMarketCap[0]?.total || 0} SOL`);

    console.log('\n🎉 数据库初始化完成！');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
  } finally {
    await mongoose.disconnect();
    console.log('断开MongoDB连接');
  }
}

// 运行初始化
initDatabase();