import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface IVote extends Document {
  walletAddress: string;
  proposalId: string;
  vote: 'for' | 'against';
  timestamp: Date;
  ipAddress?: string; // 用于审计
  signature?: string; // 钱包签名验证
}

const VoteSchema = new Schema<IVote>({
  walletAddress: {
    type: String,
    required: true,
    index: true
  },
  proposalId: {
    type: String,
    required: true,
    index: true
  },
  vote: {
    type: String,
    enum: ['for', 'against'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: {
    type: String,
    required: false
  },
  signature: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// 创建复合索引确保一个钱包对一个提案只能投一票
VoteSchema.index({ walletAddress: 1, proposalId: 1 }, { unique: true });

// 创建其他索引优化查询
VoteSchema.index({ proposalId: 1, vote: 1 });
VoteSchema.index({ timestamp: -1 });

const Vote = models.Vote || model<IVote>('Vote', VoteSchema);
export default Vote; 