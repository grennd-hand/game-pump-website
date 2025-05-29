import mongoose, { Document, Schema } from 'mongoose';

export interface IFundraising extends Document {
  tokenId: string;
  gameId: string;
  gameName: string;
  targetSOL: number;
  raisedSOL: number;
  minContribution: number;
  maxContribution: number;
  contributors: Array<{
    wallet: string;
    amount: number;
    timestamp: Date;
    txHash?: string;
  }>;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  tokenAllocation: {
    presaleTokens: number; // 50% of total supply
    pricePerToken: number; // SOL per token
  };
  milestones: Array<{
    percentage: number; // e.g., 25%, 50%, 75%, 100%
    targetAmount: number;
    reached: boolean;
    reachedAt?: Date;
    reward?: string;
  }>;
  refundPolicy: {
    enabled: boolean;
    conditions: string[];
  };
}

const FundraisingSchema = new Schema<IFundraising>({
  tokenId: {
    type: String,
    required: true,
    ref: 'Token'
  },
  gameId: {
    type: String,
    required: true
  },
  gameName: {
    type: String,
    required: true
  },
  targetSOL: {
    type: Number,
    required: true,
    min: 0
  },
  raisedSOL: {
    type: Number,
    default: 0,
    min: 0
  },
  minContribution: {
    type: Number,
    default: 0.1,
    min: 0
  },
  maxContribution: {
    type: Number,
    default: 100,
    min: 0
  },
  contributors: [{
    wallet: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    txHash: {
      type: String,
      default: null
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'failed', 'cancelled'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  tokenAllocation: {
    presaleTokens: {
      type: Number,
      required: true,
      min: 0
    },
    pricePerToken: {
      type: Number,
      required: true,
      min: 0
    }
  },
  milestones: [{
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0
    },
    reached: {
      type: Boolean,
      default: false
    },
    reachedAt: {
      type: Date,
      default: null
    },
    reward: {
      type: String,
      default: null
    }
  }],
  refundPolicy: {
    enabled: {
      type: Boolean,
      default: true
    },
    conditions: [{
      type: String
    }]
  }
}, {
  timestamps: true
});

// 创建索引
FundraisingSchema.index({ tokenId: 1 });
FundraisingSchema.index({ status: 1 });
FundraisingSchema.index({ startDate: 1, endDate: 1 });
FundraisingSchema.index({ 'contributors.wallet': 1 });

export default mongoose.models.Fundraising || mongoose.model<IFundraising>('Fundraising', FundraisingSchema);