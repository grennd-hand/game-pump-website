const mongoose = require('mongoose');

// 连接本地MongoDB数据库
const MONGODB_URI = 'mongodb://localhost:27017/game-pump-local';

// 任务模型定义
const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['twitter', 'telegram', 'general'],
    required: true
  },
  type: {
    type: String,
    enum: ['follow_twitter', 'retweet', 'like_tweet', 'comment_tweet', 'join_telegram'],
    required: true
  },
  config: {
    twitterUsername: String,
    tweetUrl: String,
    telegramGroup: String,
    websiteUrl: String,
    customInstructions: String,
    verificationMethod: {
      type: String,
      enum: ['manual', 'api', 'automatic'],
      default: 'manual'
    }
  },
  rewards: {
    points: { type: Number, default: 0 },
    tokens: { type: Number, default: 0 },
    votes: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed', 'expired'],
    default: 'active'
  },
  isRequired: { type: Boolean, default: false },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  totalCompletions: { type: Number, default: 0 },
  maxCompletions: { type: Number },
  translations: {
    en: {
      title: String,
      description: String,
      instructions: String
    },
    zh: {
      title: String,
      description: String,
      instructions: String
    },
    ja: {
      title: String,
      description: String,
      instructions: String
    },
    ko: {
      title: String,
      description: String,
      instructions: String
    }
  }
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

// 初始任务数据
const initialTasks = [
  {
    id: 'twitter_follow_gamepump',
    title: 'Follow @GamePump on Twitter',
    description: 'Follow our official Twitter account to get the latest updates.',
    category: 'twitter',
    type: 'follow_twitter',
    config: {
      twitterUsername: 'GamePumpSol',
      verificationMethod: 'api',
      customInstructions: '关注我们的Twitter账号 @GamePumpSol'
    },
    rewards: {
      points: 0, // 基础积分通过倍数计算
      votes: 1
    },
    translations: {
      en: {
        title: 'Follow @GamePump on Twitter',
        description: 'Follow our official Twitter account to get the latest updates.',
        instructions: 'Follow @GamePumpSol on Twitter'
      },
      zh: {
        title: '关注推特 @GamePump',
        description: '关注我们的官方推特账号，获取最新动态。',
        instructions: '关注 @GamePumpSol 推特账号'
      },
      ja: {
        title: 'Twitter @GamePumpをフォロー',
        description: '最新の情報を取得するために公式Twitterアカウントをフォローしてください。',
        instructions: '@GamePumpSol をフォローしてください'
      },
      ko: {
        title: 'Twitter @GamePump 팔로우',
        description: '최신 업데이트를 받기 위해 공식 Twitter 계정을 팔로우하세요.',
        instructions: '@GamePumpSol 을 팔로우하세요'
      }
    }
  },
  {
    id: 'twitter_retweet_pinned',
    title: 'Retweet Our Pinned Tweet',
    description: 'Retweet our pinned tweet to help spread the word.',
    category: 'twitter',
    type: 'retweet',
    config: {
      tweetUrl: 'https://twitter.com/GamePumpSol/status/pinned',
      verificationMethod: 'api',
      customInstructions: '转发我们的置顶推文'
    },
    rewards: {
      points: 0,
      votes: 2
    },
    translations: {
      en: {
        title: 'Retweet Our Pinned Tweet',
        description: 'Retweet our pinned tweet to help spread the word.',
        instructions: 'Retweet our pinned tweet'
      },
      zh: {
        title: '转发置顶推文',
        description: '转发我们的置顶推文，帮助传播。',
        instructions: '转发我们的置顶推文'
      },
      ja: {
        title: '固定ツイートをリツイート',
        description: '私たちの固定ツイートをリツイートして拡散を助けてください。',
        instructions: '固定ツイートをリツイートしてください'
      },
      ko: {
        title: '고정 트윗 리트윗',
        description: '우리의 고정 트윗을 리트윗하여 확산을 도와주세요.',
        instructions: '고정 트윗을 리트윗하세요'
      }
    }
  },
  {
    id: 'twitter_like_pinned',
    title: 'Like Our Pinned Tweet',
    description: 'Like our pinned tweet to show your support.',
    category: 'twitter',
    type: 'like_tweet',
    config: {
      tweetUrl: 'https://twitter.com/GamePumpSol/status/pinned',
      verificationMethod: 'api',
      customInstructions: '点赞我们的置顶推文'
    },
    rewards: {
      points: 0,
      votes: 1
    },
    translations: {
      en: {
        title: 'Like Our Pinned Tweet',
        description: 'Like our pinned tweet to show your support.',
        instructions: 'Like our pinned tweet'
      },
      zh: {
        title: '点赞置顶推文',
        description: '点赞我们的置顶推文，表示支持。',
        instructions: '点赞我们的置顶推文'
      },
      ja: {
        title: '固定ツイートにいいね',
        description: 'サポートを示すために固定ツイートにいいねしてください。',
        instructions: '固定ツイートにいいねしてください'
      },
      ko: {
        title: '고정 트윗 좋아요',
        description: '지지를 보여주기 위해 고정 트윗에 좋아요를 누르세요.',
        instructions: '고정 트윗에 좋아요를 누르세요'
      }
    }
  },
  {
    id: 'twitter_comment_pinned',
    title: 'Comment on Our Pinned Tweet',
    description: 'Leave a comment on our pinned tweet.',
    category: 'twitter',
    type: 'comment_tweet',
    config: {
      tweetUrl: 'https://twitter.com/GamePumpSol/status/pinned',
      verificationMethod: 'api',
      customInstructions: '在我们的置顶推文下评论'
    },
    rewards: {
      points: 0,
      votes: 2
    },
    translations: {
      en: {
        title: 'Comment on Our Pinned Tweet',
        description: 'Leave a comment on our pinned tweet.',
        instructions: 'Comment on our pinned tweet'
      },
      zh: {
        title: '评论置顶推文',
        description: '在我们的置顶推文下留下评论。',
        instructions: '在置顶推文下评论'
      },
      ja: {
        title: '固定ツイートにコメント',
        description: '固定ツイートにコメントを残してください。',
        instructions: '固定ツイートにコメントしてください'
      },
      ko: {
        title: '고정 트윗에 댓글',
        description: '고정 트윗에 댓글을 남겨주세요.',
        instructions: '고정 트윗에 댓글을 남기세요'
      }
    }
  },
  {
    id: 'telegram_join_group',
    title: 'Join Our Telegram Group',
    description: 'Join our Telegram group for community updates.',
    category: 'telegram',
    type: 'join_telegram',
    config: {
      telegramGroup: 'https://t.me/GamePumpCommunity',
      verificationMethod: 'api',
      customInstructions: '加入我们的Telegram群组'
    },
    rewards: {
      points: 0,
      votes: 1
    },
    translations: {
      en: {
        title: 'Join Our Telegram Group',
        description: 'Join our Telegram group for community updates.',
        instructions: 'Join our Telegram group'
      },
      zh: {
        title: '加入Telegram群组',
        description: '加入我们的Telegram群组，获取社区动态。',
        instructions: '加入我们的Telegram群组'
      },
      ja: {
        title: 'Telegramグループに参加',
        description: 'コミュニティアップデートのためにTelegramグループに参加してください。',
        instructions: 'Telegramグループに参加してください'
      },
      ko: {
        title: 'Telegram 그룹 가입',
        description: '커뮤니티 업데이트를 위해 Telegram 그룹에 가입하세요.',
        instructions: 'Telegram 그룹에 가입하세요'
      }
    }
  }
];

async function initializeTasks() {
  try {
    // 连接数据库
    console.log('🔌 连接到MongoDB数据库...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 数据库连接成功');

    // 清除现有任务（可选）
    console.log('🗑️ 清除现有任务...');
    await Task.deleteMany({});

    // 插入初始任务
    console.log('📝 创建初始任务...');
    for (const taskData of initialTasks) {
      const task = new Task(taskData);
      await task.save();
      console.log(`✅ 创建任务: ${task.translations.zh.title}`);
    }

    console.log('\n🎉 任务初始化完成！');
    console.log(`📊 总共创建了 ${initialTasks.length} 个任务`);
    
    // 显示任务摘要
    console.log('\n📋 任务摘要:');
    for (const task of initialTasks) {
      console.log(`• ${task.translations.zh.title} (${task.category}) - ${task.rewards.points}积分, ${task.rewards.votes}票`);
    }

  } catch (error) {
    console.error('❌ 任务初始化失败:', error);
  } finally {
    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('🔌 数据库连接已关闭');
  }
}

// 运行初始化
initializeTasks(); 