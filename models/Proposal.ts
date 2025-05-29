import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface IProposal extends Document {
  title: string;
  description: string;
  author: string; // 钱包地址
  authorUsername?: string;
  type: 'game' | 'governance' | 'technical' | 'funding';
  status: 'active' | 'passed' | 'failed' | 'pending';
  votesFor: number;
  votesAgainst: number;
  voters: Array<{
    wallet: string;
    vote: 'for' | 'against';
    votingPower: number;
    timestamp: Date;
  }>;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    requiredVotes: number; // 需要的最小票数
    passingThreshold: number; // 通过阈值(百分比)
    category: string;
    withdrawnByAuthor?: boolean; // 是否被作者撤回
    withdrawnAt?: Date; // 撤回时间
  };
}

const ProposalSchema = new Schema<IProposal>({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  author: {
    type: String,
    required: true
  },
  authorUsername: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: ['game', 'governance', 'technical', 'funding'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'passed', 'failed', 'pending'],
    default: 'active'
  },
  votesFor: {
    type: Number,
    default: 0
  },
  votesAgainst: {
    type: Number,
    default: 0
  },
  voters: [{
    wallet: {
      type: String,
      required: true
    },
    vote: {
      type: String,
      enum: ['for', 'against'],
      required: true
    },
    votingPower: {
      type: Number,
      default: 1
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  deadline: {
    type: Date,
    required: true
  },
  metadata: {
    requiredVotes: {
      type: Number,
      default: 100
    },
    passingThreshold: {
      type: Number,
      default: 60 // 60%通过
    },
    category: {
      type: String,
      default: '社区提案'
    },
    withdrawnByAuthor: {
      type: Boolean,
      default: false
    },
    withdrawnAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// 创建索引
ProposalSchema.index({ status: 1, deadline: 1 });
ProposalSchema.index({ author: 1 });
ProposalSchema.index({ type: 1 });
ProposalSchema.index({ createdAt: -1 });

// 在保存前检查提案状态
ProposalSchema.pre('save', function(next) {
  if (this.deadline < new Date() && this.status === 'active') {
    const totalVotes = this.votesFor + this.votesAgainst;
    const passingRate = totalVotes > 0 ? (this.votesFor / totalVotes) * 100 : 0;
    
    if (totalVotes >= this.metadata.requiredVotes && passingRate >= this.metadata.passingThreshold) {
      this.status = 'passed';
    } else {
      this.status = 'failed';
    }
  }
  next();
});

const Proposal = models.Proposal || model<IProposal>('Proposal', ProposalSchema);

export default Proposal; 