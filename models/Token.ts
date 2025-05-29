import mongoose, { Document, Schema } from 'mongoose';

export interface IToken extends Document {
  name: string;
  symbol: string;
  description: string;
  image: string;
  gameType: 'mario' | 'tetris' | 'donkey_kong' | 'pac_man' | 'zelda' | 'final_fantasy' | 'mega_man' | 'contra' | 'sonic' | 'street_fighter' | 'mario_world' | 'pokemon' | 'metroid' | 'ff7' | 'ocarina_of_time' | 'mario_64' | 'doom' | 'starcraft' | 'tomb_raider' | 'other';
  creator: string; // 钱包地址
  contractAddress?: string;
  totalSupply: number;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  votes: number;
  voters: string[]; // 钱包地址数组
  status: 'voting' | 'fundraising' | 'launched' | 'play_to_earn' | 'failed';
  createdAt: Date;
  launchedAt?: Date;
  fundraising: {
    targetSOL: number;
    raisedSOL: number;
    contributors: Array<{
      wallet: string;
      amount: number;
      timestamp: Date;
    }>;
    deadline: Date;
  };
  tokenomics: {
    presale: number; // 50%
    liquidity: number; // 30%
    votingAirdrop: number; // 10%
    solEcosystemAirdrop: number; // 7%
    development: number; // 3%
  };
  socialLinks: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  tags: string[];
  isVerified: boolean;
  playToEarnEnabled: boolean;
  daoProposals: Array<{
    id: string;
    title: string;
    description: string;
    type: 'enable_p2e' | 'game_update' | 'tokenomics_change';
    votes: { for: number; against: number };
    voters: Array<{ wallet: string; vote: 'for' | 'against'; weight: number }>;
    status: 'active' | 'passed' | 'rejected';
    deadline: Date;
  }>;
}

const TokenSchema = new Schema<IToken>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true,
    index: true
  },
  contractAddress: {
    type: String,
    default: null,
    unique: true,
    sparse: true
  },
  totalSupply: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  marketCap: {
    type: Number,
    default: 0,
    min: 0
  },
  volume24h: {
    type: Number,
    default: 0,
    min: 0
  },
  priceChange24h: {
    type: Number,
    default: 0
  },
  votes: {
    type: Number,
    default: 0,
    min: 0
  },
  voters: [{
    type: String
  }],
  gameType: {
    type: String,
    enum: ['mario', 'tetris', 'donkey_kong', 'pac_man', 'zelda', 'final_fantasy', 'mega_man', 'contra', 'sonic', 'street_fighter', 'mario_world', 'pokemon', 'metroid', 'ff7', 'ocarina_of_time', 'mario_64', 'doom', 'starcraft', 'tomb_raider', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['voting', 'fundraising', 'launched', 'play_to_earn', 'failed'],
    default: 'voting'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  launchedAt: {
    type: Date,
    default: null
  },
  fundraising: {
    targetSOL: {
      type: Number,
      default: 0
    },
    raisedSOL: {
      type: Number,
      default: 0
    },
    contributors: [{
      wallet: String,
      amount: Number,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    deadline: {
      type: Date,
      default: null
    }
  },
  tokenomics: {
    presale: {
      type: Number,
      default: 50
    },
    liquidity: {
      type: Number,
      default: 30
    },
    votingAirdrop: {
      type: Number,
      default: 10
    },
    solEcosystemAirdrop: {
      type: Number,
      default: 7
    },
    development: {
      type: Number,
      default: 3
    }
  },
  playToEarnEnabled: {
    type: Boolean,
    default: false
  },
  daoProposals: [{
    id: String,
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['enable_p2e', 'game_update', 'tokenomics_change']
    },
    votes: {
      for: {
        type: Number,
        default: 0
      },
      against: {
        type: Number,
        default: 0
      }
    },
    voters: [{
      wallet: String,
      vote: {
        type: String,
        enum: ['for', 'against']
      },
      weight: Number
    }],
    status: {
      type: String,
      enum: ['active', 'passed', 'rejected'],
      default: 'active'
    },
    deadline: Date
  }],
  socialLinks: {
    website: String,
    twitter: String,
    telegram: String,
    discord: String
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 创建索引
TokenSchema.index({ votes: -1 });
TokenSchema.index({ marketCap: -1 });
TokenSchema.index({ createdAt: -1 });
TokenSchema.index({ status: 1, votes: -1 });
TokenSchema.index({ symbol: 1 });

export default mongoose.models.Token || mongoose.model<IToken>('Token', TokenSchema);