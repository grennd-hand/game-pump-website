const mongoose = require('mongoose');

// 任务模型
const TaskSchema = new mongoose.Schema({
  // 基本信息
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
  
  // 任务配置
  config: {
    twitterUsername: String,      // Twitter用户名
    tweetUrl: String,            // 推文URL
    telegramGroup: String,       // Telegram群组链接
    websiteUrl: String,          // 网站链接
    customInstructions: String,  // 自定义说明
    verificationMethod: {
      type: String,
      enum: ['manual', 'api', 'automatic'],
      default: 'manual'
    }
  },
  
  // 奖励设置
  rewards: {
    points: { type: Number, default: 0 },
    tokens: { type: Number, default: 0 },
    votes: { type: Number, default: 0 }
  },
  
  // 状态
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed', 'expired'],
    default: 'active'
  },
  isRequired: { type: Boolean, default: false },
  
  // 时间限制
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  
  // 完成情况
  totalCompletions: { type: Number, default: 0 },
  maxCompletions: { type: Number }, // 最大完成次数限制
  
  // 多语言支持
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

// 用户任务完成记录模型
const UserTaskCompletionSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true },
  taskId: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'verified', 'rejected'],
    default: 'pending'
  },
  
  // 验证数据
  verificationData: {
    twitterUsername: String,
    tweetUrl: String,
    telegramUsername: String,
    screenshot: String,
    notes: String
  },
  
  // 奖励记录
  rewardsEarned: {
    points: { type: Number, default: 0 },
    multiplierApplied: { type: Number, default: 1 },
    tokens: { type: Number, default: 0 },
    votes: { type: Number, default: 0 }
  },
  
  completedAt: { type: Date },
  verifiedAt: { type: Date },
  verifiedBy: String // 管理员ID
}, { timestamps: true });

// 索引
TaskSchema.index({ status: 1, category: 1 });
TaskSchema.index({ startDate: 1, endDate: 1 });
UserTaskCompletionSchema.index({ walletAddress: 1, taskId: 1 }, { unique: true });
UserTaskCompletionSchema.index({ status: 1 });

// 防止重复定义模型
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
const UserTaskCompletion = mongoose.models.UserTaskCompletion || mongoose.model('UserTaskCompletion', UserTaskCompletionSchema);

module.exports = {
  Task,
  UserTaskCompletion
}; 