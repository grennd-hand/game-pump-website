import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  username?: string;
  avatar?: string;
  totalVotes: number;
  totalTokens: number;
  availableVotes: number; // 可用投票数
  solBalance?: number; // SOL余额
  joinedAt: Date;
  lastActive: Date;
  level: number;
  experience: number;
  achievements: string[];
  preferences: {
    language: 'en' | 'zh' | 'ja' | 'ko';
    notifications: boolean;
  };
  // 每日签到相关
  dailyCheckin: {
    lastCheckinDate?: Date;
    consecutiveDays: number;
    totalCheckins: number;
  };
  // 邀请相关
  inviteCode: string; // 用户的邀请码
  invitedBy?: string; // 被谁邀请（邀请码）
  invitedUsers: string[]; // 邀请的用户钱包地址列表
  inviteRewards: {
    totalInvites: number;
    totalRewards: number; // 获得的总奖励票数
  };
}

const UserSchema = new Schema<IUser>({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  totalTokens: {
    type: Number,
    default: 0
  },
  availableVotes: {
    type: Number,
    default: 0
  },
  solBalance: {
    type: Number,
    default: 0
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String
  }],
  preferences: {
    language: {
      type: String,
      enum: ['en', 'zh', 'ja', 'ko'],
      default: 'en'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  // 每日签到相关
  dailyCheckin: {
    lastCheckinDate: {
      type: Date,
      default: null
    },
    consecutiveDays: {
      type: Number,
      default: 0
    },
    totalCheckins: {
      type: Number,
      default: 0
    }
  },
  // 邀请相关
  inviteCode: {
    type: String,
    required: false, // 改为非必需，允许后续生成
    unique: true,
    sparse: true // 允许null值，但唯一
  },
  invitedBy: {
    type: String,
    default: null
  },
  invitedUsers: [{
    type: String
  }],
  inviteRewards: {
    totalInvites: {
      type: Number,
      default: 0
    },
    totalRewards: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// 创建索引
UserSchema.index({ totalVotes: -1 });
UserSchema.index({ totalTokens: -1 });
UserSchema.index({ level: -1, experience: -1 });
UserSchema.index({ 'dailyCheckin.lastCheckinDate': 1 });
// UserSchema.index({ inviteCode: 1 }); // 重复索引，unique: true已自动创建
UserSchema.index({ invitedBy: 1 });

// 生成邀请码的静态方法
UserSchema.statics.generateInviteCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 检查是否可以签到的实例方法
UserSchema.methods.canCheckinToday = function() {
  if (!this.dailyCheckin.lastCheckinDate) return true;
  
  const today = new Date();
  const lastCheckin = new Date(this.dailyCheckin.lastCheckinDate);
  
  // 检查是否是同一天
  return today.toDateString() !== lastCheckin.toDateString();
};

// 执行签到的实例方法
UserSchema.methods.performCheckin = function() {
  const today = new Date();
  const lastCheckin = this.dailyCheckin.lastCheckinDate ? new Date(this.dailyCheckin.lastCheckinDate) : null;
  
  // 检查连续签到
  let isConsecutive = false;
  if (lastCheckin) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    isConsecutive = yesterday.toDateString() === lastCheckin.toDateString();
  }
  
  // 更新签到数据
  this.dailyCheckin.lastCheckinDate = today;
  this.dailyCheckin.totalCheckins += 1;
  
  if (isConsecutive) {
    this.dailyCheckin.consecutiveDays += 1;
  } else {
    this.dailyCheckin.consecutiveDays = 1;
  }
  
  // 计算奖励票数
  let rewardVotes = 1; // 基础奖励1票
  
  // 连续签到奖励
  if (this.dailyCheckin.consecutiveDays >= 7) {
    rewardVotes = 3; // 连续7天奖励3票
  } else if (this.dailyCheckin.consecutiveDays >= 3) {
    rewardVotes = 2; // 连续3天奖励2票
  }
  
  // 添加奖励票数
  this.availableVotes += rewardVotes;
  this.experience += rewardVotes * 5; // 每票5经验
  
  return {
    rewardVotes,
    consecutiveDays: this.dailyCheckin.consecutiveDays,
    totalCheckins: this.dailyCheckin.totalCheckins
  };
};

const User = models.User || model<IUser>('User', UserSchema);
export default User;