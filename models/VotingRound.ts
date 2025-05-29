import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface IVotingRound extends Document {
  roundNumber: number;
  title: string;
  description: string;
  games: Array<{
    id: string;
    name: string;
    nameTranslations: {
      en: string;
      zh: string;
      ja: string;
      ko: string;
    };
    icon: string;
    description: string;
    descriptionTranslations: {
      en: string;
      zh: string;
      ja: string;
      ko: string;
    };
    released: string;
    votes: number;
    voters: string[];
  }>;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  totalVotes: number;
  totalParticipants: number;
  winnerGameId?: string;
  winnerToken?: string; // Token ID after creation
  votingRules: {
    minSOLBalance: number; // 0.1 SOL
    maxVotesPerWallet: number; // 3 votes
    votingPower: 'equal' | 'weighted'; // equal for now
  };
  rewards: {
    votingAirdropPercentage: number; // 10%
    participationRewards: boolean;
  };
}

const VotingRoundSchema = new Schema<IVotingRound>({
  roundNumber: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  games: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    nameTranslations: {
      en: String,
      zh: String,
      ja: String,
      ko: String
    },
    icon: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    descriptionTranslations: {
      en: String,
      zh: String,
      ja: String,
      ko: String
    },
    released: {
      type: String,
      required: true
    },
    votes: {
      type: Number,
      default: 0
    },
    voters: [{
      type: String
    }]
  }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  totalParticipants: {
    type: Number,
    default: 0
  },
  winnerGameId: {
    type: String,
    default: null
  },
  winnerToken: {
    type: String,
    default: null
  },
  votingRules: {
    minSOLBalance: {
      type: Number,
      default: 0.1
    },
    maxVotesPerWallet: {
      type: Number,
      default: 3
    },
    votingPower: {
      type: String,
      enum: ['equal', 'weighted'],
      default: 'equal'
    }
  },
  rewards: {
    votingAirdropPercentage: {
      type: Number,
      default: 10
    },
    participationRewards: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// 创建索引
VotingRoundSchema.index({ roundNumber: 1 });
VotingRoundSchema.index({ status: 1 });
VotingRoundSchema.index({ startDate: 1, endDate: 1 });

const VotingRound = models.VotingRound || model<IVotingRound>('VotingRound', VotingRoundSchema);
export default VotingRound;