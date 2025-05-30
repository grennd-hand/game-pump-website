'use client'

import { useState, useEffect, memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useProposals, useCreateProposal, useProposalVote, CreateProposalData } from '@/hooks/useProposals'
import { useUserProposals } from '@/hooks/useUserProposals'
import { useProposalManagement } from '@/hooks/useProposalManagement'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletConnect } from '@/hooks/useWalletConnect'
import { useCommunityStats } from '@/hooks/useCommunityStats'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'

interface Proposal {
  id: number
  title: string
  description: string
  author: string
  status: 'active' | 'passed' | 'failed' | 'pending'
  votesFor: number
  votesAgainst: number
  timeLeft: string
  category: string
}

interface CommunityStats {
  label: string
  value: string
  change: string
  icon: string
  color: string
}

interface NetworkLine {
  id: number
  x1: number
  y1: number
  x2: number
  y2: number
  duration: number
}

export default memo(function CommunitySection() {
  const { lang } = useLanguage()
  const { connected } = useWallet()
  const { user, loading: userLoading, error: userError, connectUser } = useWalletConnect()
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState('proposals')
  const [networkLines, setNetworkLines] = useState<NetworkLine[]>([])
  const [isClient, setIsClient] = useState(false)
  
  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'game' as 'game' | 'governance' | 'technical' | 'funding'
  })

  // 使用hooks
  const { data: proposalsData, loading: proposalsLoading, error: proposalsError, refresh: refreshProposals } = useProposals('active')
  const { createProposal, loading: createLoading, error: createError } = useCreateProposal()
  const { vote, loading: voteLoading, error: voteError } = useProposalVote()
  const { stats: communityStats, loading: statsLoading, error: statsError, refresh: refreshStats } = useCommunityStats()
  const { data: userProposalsData, loading: userProposalsLoading, error: userProposalsError, refresh: refreshUserProposals } = useUserProposals()
  const { deleteProposal, loading: managementLoading } = useProposalManagement()

  // 提案管理状态
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedProposalForEdit, setSelectedProposalForEdit] = useState<any>(null)

  const titleMap = {
    en: '🏛️ Community Governance',
    zh: '🏛️ 社区治理',
    ja: '🏛️ コミュニティ・ガバナンス',
    ko: '🏛️ 커뮤니티 거버넌스'
  }
  const descMap = {
    en: 'Decentralized Autonomous Organization (DAO) - Every community member has a voice',
    zh: '去中心化自治组织 (DAO) - 让每个社区成员都有发言权',
    ja: '分散型自律組織（DAO）- コミュニティのメンバーはすべて声を持っています',
    ko: '분산형 자율 조직 (DAO) - 각 커뮤니티 멤버는 말할 권리가 있습니다'
  }

  // 使用真实的社区统计数据
  const getCommunityStatsMap = () => {
    if (statsLoading || !communityStats) {
      return {
        en: [
          { label: "DAO Members", value: "...", change: "...", icon: "👥", color: "text-retro-green" },
          { label: "Active Proposals", value: "...", change: "...", icon: "📝", color: "text-retro-cyan" },
          { label: "Governance Participation", value: "...", change: "...", icon: "🗳️", color: "text-retro-yellow" },
          { label: "Staked Tokens", value: "...", change: "...", icon: "🔒", color: "text-retro-magenta" }
        ],
        zh: [
          { label: "DAO成员", value: "...", change: "...", icon: "👥", color: "text-retro-green" },
          { label: "活跃提案", value: "...", change: "...", icon: "📝", color: "text-retro-cyan" },
          { label: "治理参与率", value: "...", change: "...", icon: "🗳️", color: "text-retro-yellow" },
          { label: "质押代币", value: "...", change: "...", icon: "🔒", color: "text-retro-magenta" }
        ],
        ja: [
          { label: "DAOメンバー", value: "...", change: "...", icon: "👥", color: "text-retro-green" },
          { label: "アクティブ提案", value: "...", change: "...", icon: "📝", color: "text-retro-cyan" },
          { label: "ガバナンス参加率", value: "...", change: "...", icon: "🗳️", color: "text-retro-yellow" },
          { label: "ステーキングトークン", value: "...", change: "...", icon: "🔒", color: "text-retro-magenta" }
        ],
        ko: [
          { label: "DAO 멤버", value: "...", change: "...", icon: "👥", color: "text-retro-green" },
          { label: "활성 제안", value: "...", change: "...", icon: "📝", color: "text-retro-cyan" },
          { label: "거버넌스 참여율", value: "...", change: "...", icon: "🗳️", color: "text-retro-yellow" },
          { label: "스테이킹 토큰", value: "...", change: "...", icon: "🔒", color: "text-retro-magenta" }
        ]
      }
    }

    return {
      en: [
        {
          label: "DAO Members",
          value: communityStats.totalMembers.toLocaleString(),
          change: communityStats.growth.members,
          icon: "👥",
          color: "text-retro-green"
        },
        {
          label: "Active Proposals",
          value: communityStats.activeProposals.toString(),
          change: communityStats.growth.proposals,
          icon: "📝",
          color: "text-retro-cyan"
        },
        {
          label: "Governance Participation",
          value: `${communityStats.participationRate}%`,
          change: communityStats.growth.participation,
          icon: "🗳️",
          color: "text-retro-yellow"
        },
        {
          label: "Staked Tokens",
          value: communityStats.stakedTokens,
          change: communityStats.growth.staked,
          icon: "🔒",
          color: "text-retro-magenta"
        }
      ],
      zh: [
        {
          label: "DAO成员",
          value: communityStats.totalMembers.toLocaleString(),
          change: communityStats.growth.members,
          icon: "👥",
          color: "text-retro-green"
        },
        {
          label: "活跃提案",
          value: communityStats.activeProposals.toString(),
          change: communityStats.growth.proposals,
          icon: "📝",
          color: "text-retro-cyan"
        },
        {
          label: "治理参与率",
          value: `${communityStats.participationRate}%`,
          change: communityStats.growth.participation,
          icon: "🗳️",
          color: "text-retro-yellow"
        },
        {
          label: "质押代币",
          value: communityStats.stakedTokens,
          change: communityStats.growth.staked,
          icon: "🔒",
          color: "text-retro-magenta"
        }
      ],
      ja: [
        {
          label: "DAOメンバー",
          value: communityStats.totalMembers.toLocaleString(),
          change: communityStats.growth.members,
          icon: "👥",
          color: "text-retro-green"
        },
        {
          label: "アクティブ提案",
          value: communityStats.activeProposals.toString(),
          change: communityStats.growth.proposals,
          icon: "📝",
          color: "text-retro-cyan"
        },
        {
          label: "ガバナンス参加率",
          value: `${communityStats.participationRate}%`,
          change: communityStats.growth.participation,
          icon: "🗳️",
          color: "text-retro-yellow"
        },
        {
          label: "ステーキングトークン",
          value: communityStats.stakedTokens,
          change: communityStats.growth.staked,
          icon: "🔒",
          color: "text-retro-magenta"
        }
      ],
      ko: [
        {
          label: "DAO 멤버",
          value: communityStats.totalMembers.toLocaleString(),
          change: communityStats.growth.members,
          icon: "👥",
          color: "text-retro-green"
        },
        {
          label: "활성 제안",
          value: communityStats.activeProposals.toString(),
          change: communityStats.growth.proposals,
          icon: "📝",
          color: "text-retro-cyan"
        },
        {
          label: "거버넌스 참여율",
          value: `${communityStats.participationRate}%`,
          change: communityStats.growth.participation,
          icon: "🗳️",
          color: "text-retro-yellow"
        },
        {
          label: "스테이킹 토큰",
          value: communityStats.stakedTokens,
          change: communityStats.growth.staked,
          icon: "🔒",
          color: "text-retro-magenta"
        }
      ]
    }
  }

  const communityStatsMap = getCommunityStatsMap()

  const proposalsMap = {
    en: [
      {
        id: 1,
        title: "Add Final Fantasy to candidate game list",
        description: "Propose to add the classic RPG game Final Fantasy series to the next round of voting candidate game list",
        author: "GameMaster.sol",
        status: "active" as const,
        votesFor: 1284,
        votesAgainst: 156,
        timeLeft: "3 days 12 hours",
        category: "Game Proposal"
      },
      {
        id: 2,
        title: "Increase token staking reward mechanism",
        description: "Suggest providing staking rewards for long-term GAME token holders to incentivize community participation",
        author: "DefiWizard.sol",
        status: "active" as const,
        votesFor: 2156,
        votesAgainst: 89,
        timeLeft: "1 day 8 hours",
        category: "Governance Proposal"
      },
      {
        id: 3,
        title: "Reduce minimum token amount required for voting",
        description: "Reduce the minimum GAME token amount required to participate in governance voting from 1000 to 500",
        author: "Voter.sol",
        status: "passed" as const,
        votesFor: 3421,
        votesAgainst: 234,
        timeLeft: "Ended",
        category: "Governance Proposal"
      }
    ],
    zh: [
      {
        id: 1,
        title: "添加《最终幻想》到候选游戏列表",
        description: "提议将经典RPG游戏《最终幻想》系列加入下一轮投票的候选游戏列表中",
        author: "GameMaster.sol",
        status: "active" as const,
        votesFor: 1284,
        votesAgainst: 156,
        timeLeft: "3天 12小时",
        category: "游戏提案"
      },
      {
        id: 2,
        title: "增加代币质押奖励机制",
        description: "建议为长期持有GAME代币的用户提供质押奖励，激励社区参与",
        author: "DefiWizard.sol",
        status: "active" as const,
        votesFor: 2156,
        votesAgainst: 89,
        timeLeft: "1天 8小时",
        category: "治理提案"
      },
      {
        id: 3,
        title: "降低投票所需的最小代币数量",
        description: "将参与治理投票所需的最小GAME代币数量从1000降低到500",
        author: "Voter.sol",
        status: "passed" as const,
        votesFor: 3421,
        votesAgainst: 234,
        timeLeft: "已结束",
        category: "治理提案"
      }
    ],
    ja: [
      {
        id: 1,
        title: "ファイナルファンタジーを候補ゲームリストに追加",
        description: "クラシックRPGゲーム「ファイナルファンタジー」シリーズを次回投票の候補ゲームリストに追加することを提案",
        author: "GameMaster.sol",
        status: "active" as const,
        votesFor: 1284,
        votesAgainst: 156,
        timeLeft: "3日 12時間",
        category: "ゲーム提案"
      },
      {
        id: 2,
        title: "トークンステーキング報酬メカニズムの増加",
        description: "長期間GAMEトークンを保有するユーザーにステーキング報酬を提供し、コミュニティ参加を促進することを提案",
        author: "DefiWizard.sol",
        status: "active" as const,
        votesFor: 2156,
        votesAgainst: 89,
        timeLeft: "1日 8時間",
        category: "ガバナンス提案"
      },
      {
        id: 3,
        title: "投票に必要な最小トークン数を削減",
        description: "ガバナンス投票に参加するのに必要な最小GAMEトークン数を1000から500に削減",
        author: "Voter.sol",
        status: "passed" as const,
        votesFor: 3421,
        votesAgainst: 234,
        timeLeft: "終了",
        category: "ガバナンス提案"
      }
    ],
    ko: [
      {
        id: 1,
        title: "파이널 판타지를 후보 게임 목록에 추가",
        description: "클래식 RPG 게임 파이널 판타지 시리즈를 다음 투표 후보 게임 목록에 추가하는 것을 제안",
        author: "GameMaster.sol",
        status: "active" as const,
        votesFor: 1284,
        votesAgainst: 156,
        timeLeft: "3일 12시간",
        category: "게임 제안"
      },
      {
        id: 2,
        title: "토큰 스테이킹 보상 메커니즘 증가",
        description: "장기간 GAME 토큰을 보유한 사용자에게 스테이킹 보상을 제공하여 커뮤니티 참여를 장려하는 것을 제안",
        author: "DefiWizard.sol",
        status: "active" as const,
        votesFor: 2156,
        votesAgainst: 89,
        timeLeft: "1일 8시간",
        category: "거버넌스 제안"
      },
      {
        id: 3,
        title: "투표에 필요한 최소 토큰 수량 감소",
        description: "거버넌스 투표 참여에 필요한 최소 GAME 토큰 수량을 1000에서 500으로 감소",
        author: "Voter.sol",
        status: "passed" as const,
        votesFor: 3421,
        votesAgainst: 234,
        timeLeft: "종료",
        category: "거버넌스 제안"
      }
    ]
  }

  const tabsMap = {
    en: [
      { id: 'proposals', label: '📋 Proposal List', icon: '📋' },
      { id: 'create', label: '➕ Create Proposal', icon: '➕' },
      { id: 'history', label: '📚 History', icon: '📚' }
    ],
    zh: [
      { id: 'proposals', label: '📋 提案列表', icon: '📋' },
      { id: 'create', label: '➕ 创建提案', icon: '➕' },
      { id: 'history', label: '📚 历史记录', icon: '📚' }
    ],
    ja: [
      { id: 'proposals', label: '📋 提案リスト', icon: '📋' },
      { id: 'create', label: '➕ 提案作成', icon: '➕' },
      { id: 'history', label: '📚 履歴', icon: '📚' }
    ],
    ko: [
      { id: 'proposals', label: '📋 제안 목록', icon: '📋' },
      { id: 'create', label: '➕ 제안 생성', icon: '➕' },
      { id: 'history', label: '📚 기록', icon: '📚' }
    ]
  }

  const statusTextMap = {
    en: {
      active: '🔄 Voting',
      passed: '✅ Passed',
      failed: '❌ Failed',
      pending: '⏳ Pending'
    },
    zh: {
      active: '🔄 投票中',
      passed: '✅ 已通过',
      failed: '❌ 未通过',
      pending: '⏳ 待定'
    },
    ja: {
      active: '🔄 投票中',
      passed: '✅ 可決',
      failed: '❌ 否決',
      pending: '⏳ 保留中'
    },
    ko: {
      active: '🔄 투표 중',
      passed: '✅ 통과',
      failed: '❌ 실패',
      pending: '⏳ 보류 중'
    }
  }

  const voteTextMap = {
    en: {
      support: 'Support votes',
      against: 'Against votes',
      voteFor: 'Vote For',
      voteAgainst: 'Vote Against',
      progress: 'Voting progress',
      supportPercent: 'support'
    },
    zh: {
      support: '支持票',
      against: '反对票', 
      voteFor: '投票支持',
      voteAgainst: '投票反对',
      progress: '投票进度',
      supportPercent: '支持'
    },
    ja: {
      support: '賛成票',
      against: '反対票',
      voteFor: '賛成投票',
      voteAgainst: '反対投票',
      progress: '投票進捗',
      supportPercent: '賛成'
    },
    ko: {
      support: '찬성표',
      against: '반대표',
      voteFor: '찬성 투표',
      voteAgainst: '반대 투표',
      progress: '투표 진행률',
      supportPercent: '찬성'
    }
  }

  const createFormMap = {
    en: {
      title: '📝 Create New Proposal',
      titleLabel: 'Proposal Title',
      titlePlaceholder: 'Enter proposal title...',
      typeLabel: 'Proposal Type',
      descLabel: 'Detailed Description',
      descPlaceholder: 'Describe your proposal content in detail...',
      submit: '🚀 Submit Proposal',
      gameProposal: 'Game Proposal',
      governanceProposal: 'Governance Proposal',
      technicalProposal: 'Technical Proposal',
      fundingProposal: 'Funding Proposal'
    },
    zh: {
      title: '📝 创建新提案',
      titleLabel: '提案标题',
      titlePlaceholder: '输入提案标题...',
      typeLabel: '提案类型',
      descLabel: '详细描述',
      descPlaceholder: '详细描述你的提案内容...',
      submit: '🚀 提交提案',
      gameProposal: '游戏提案',
      governanceProposal: '治理提案',
      technicalProposal: '技术提案',
      fundingProposal: '资金提案'
    },
    ja: {
      title: '📝 新規提案作成',
      titleLabel: '提案タイトル',
      titlePlaceholder: '提案タイトルを入力...',
      typeLabel: '提案タイプ',
      descLabel: '詳細説明',
      descPlaceholder: '提案内容を詳しく説明してください...',
      submit: '🚀 提案提出',
      gameProposal: 'ゲーム提案',
      governanceProposal: 'ガバナンス提案',
      technicalProposal: '技術提案',
      fundingProposal: '資金提案'
    },
    ko: {
      title: '📝 새 제안 생성',
      titleLabel: '제안 제목',
      titlePlaceholder: '제안 제목을 입력하세요...',
      typeLabel: '제안 유형',
      descLabel: '상세 설명',
      descPlaceholder: '제안 내용을 자세히 설명하세요...',
      submit: '🚀 제안 제출',
      gameProposal: '게임 제안',
      governanceProposal: '거버넌스 제안',
      technicalProposal: '기술 제안',
      fundingProposal: '자금 제안'
    }
  }

  const historyMap = {
    en: {
      title: '📚 History',
      description: 'This will display all completed proposals and voting history records. Feature is under development, stay tuned!'
    },
    zh: {
      title: '📚 历史记录',
      description: '这里将显示所有已完成的提案和投票历史记录。功能正在开发中，敬请期待！'
    },
    ja: {
      title: '📚 履歴',
      description: 'ここには完了した提案と投票履歴が表示されます。機能は開発中です。お楽しみに！'
    },
    ko: {
      title: '📚 기록',
      description: '여기에는 완료된 제안과 투표 기록이 표시됩니다. 기능 개발 중입니다. 기대해 주세요!'
    }
  }

  const governanceInfoMap = {
    en: [
      {
        icon: '🤝',
        title: 'Democratic Governance',
        description: 'Every token holder has voting rights, major decisions are made collectively by the community'
      },
      {
        icon: '🔍',
        title: 'Transparent and Open',
        description: 'All proposals and voting results are publicly transparent on the blockchain and can be verified at any time'
      },
      {
        icon: '⚡',
        title: 'Efficient Execution',
        description: 'Passed proposals will be automatically executed without manual intervention, ensuring governance efficiency'
      }
    ],
    zh: [
      {
        icon: '🤝',
        title: '民主治理',
        description: '每个代币持有者都有投票权，重大决策由社区共同决定'
      },
      {
        icon: '🔍',
        title: '透明公开',
        description: '所有提案和投票结果在区块链上公开透明，可随时查验'
      },
      {
        icon: '⚡',
        title: '高效执行',
        description: '通过的提案将自动执行，无需人工干预，确保治理效率'
      }
    ],
    ja: [
      {
        icon: '🤝',
        title: '民主的ガバナンス',
        description: 'すべてのトークン保有者に投票権があり、重要な決定はコミュニティが共同で行います'
      },
      {
        icon: '🔍',
        title: '透明性と公開性',
        description: 'すべての提案と投票結果はブロックチェーン上で公開され、いつでも検証できます'
      },
      {
        icon: '⚡',
        title: '効率的な実行',
        description: '可決された提案は人的介入なしに自動実行され、ガバナンス効率を確保します'
      }
    ],
    ko: [
      {
        icon: '🤝',
        title: '민주적 거버넌스',
        description: '모든 토큰 보유자가 투표권을 가지며, 중요한 결정은 커뮤니티가 공동으로 내립니다'
      },
      {
        icon: '🔍',
        title: '투명하고 공개적',
        description: '모든 제안과 투표 결과는 블록체인에서 공개적으로 투명하며 언제든지 검증할 수 있습니다'
      },
      {
        icon: '⚡',
        title: '효율적인 실행',
        description: '통과된 제안은 인적 개입 없이 자동으로 실행되어 거버넌스 효율성을 보장합니다'
      }
    ]
  }

  const proposals = proposalsData?.proposals || []

  useEffect(() => {
    setIsClient(true)
    // 生成固定的网络连接线数据（避免水合错误）
    const lines: NetworkLine[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x1: (i * 5 + 3) % 100, // 使用固定算法生成位置
      y1: (i * 7 + 11) % 100,
      x2: (i * 11 + 17) % 100,
      y2: (i * 13 + 19) % 100,
      duration: (i % 3) + 2
    }))
    setNetworkLines(lines)
  }, [])

  // 自动获取用户数据
  useEffect(() => {
    if (connected && !user && !userLoading) {
      console.log('🔄 钱包已连接但没有用户数据，自动获取...')
      connectUser().then(result => {
        if (result) {
          console.log('✅ 自动获取用户数据成功:', result.user.availableVotes, '票')
        } else {
          console.log('❌ 自动获取用户数据失败')
        }
      })
    }
  }, [connected, user, userLoading, connectUser])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-retro-cyan text-retro-cyan bg-retro-cyan/10'
      case 'passed': return 'border-retro-green text-retro-green bg-retro-green/10'
      case 'failed': return 'border-red-400 text-red-400 bg-red-400/10'
      case 'pending': return 'border-retro-yellow text-retro-yellow bg-retro-yellow/10'
      default: return 'border-gray-400 text-gray-400 bg-gray-400/10'
    }
  }

  const getStatusText = (status: string) => {
    return statusTextMap[lang][status as keyof typeof statusTextMap[typeof lang]] || status
  }

  // 处理投票
  const handleVote = useCallback(async (proposalId: string, voteType: 'for' | 'against') => {
    if (!connected) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '钱包未连接',
          message: '请先连接钱包'
        })
      }
      return
    }

    const result = await vote(proposalId, voteType)
    if (result) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'success',
          title: '投票成功',
          message: result.message
        })
      }
      refreshProposals()
    } else if (voteError) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '投票失败',
          message: voteError
        })
      }
    }
  }, [connected, vote, voteError, refreshProposals])

  // 处理创建提案
  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🎯 提交提案检查状态:', {
      connected,
      userLoading,
      user: user ? `存在，票数:${user.availableVotes}` : '不存在',
      title: formData.title.length,
      description: formData.description.length
    })
    
    if (!connected) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '钱包未连接',
          message: '请先连接钱包'
        })
      }
      return
    }

    // 检查用户数据是否还在加载
    if (userLoading) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'warning',
          title: '用户数据加载中',
          message: '请等待用户数据加载完成后再试'
        })
      }
      return
    }

    // 检查用户是否存在
    if (!user) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '用户数据异常',
          message: '用户数据获取失败，请尝试重新连接钱包'
        })
      }
      return
    }

    // 检查积分（使用计算方案）
    const votes = user.totalVotes || 0
    const checkinDays = user.dailyCheckin?.totalCheckins || 0
    const inviteCount = user.inviteRewards?.totalInvites || 0
    const calculatedScore = checkinDays * 3 + votes * 2 + inviteCount * 5
    
    if (calculatedScore < 300) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '积分不足',
          message: `需要300积分才能创建提案，当前积分：${calculatedScore}`
        })
      }
      return
    }

    // 验证表单内容
    if (!formData.title.trim() || !formData.description.trim()) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '表单错误',
          message: '请填写完整的标题和描述'
        })
      }
      return
    }

    // 验证标题长度
    if (formData.title.length > 200) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '标题过长',
          message: '标题不能超过200个字符，当前：' + formData.title.length
        })
      }
      return
    }

    // 验证描述长度
    if (formData.description.length > 2000) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '描述过长',
          message: '描述不能超过2000个字符，当前：' + formData.description.length
        })
      }
      return
    }

    // 简单的内容健康检查
    const forbiddenWords = ['垃圾', '废物', '傻逼', '操你妈', '死', '杀'];
    const titleLower = formData.title.toLowerCase();
    const descLower = formData.description.toLowerCase();
    
    for (const word of forbiddenWords) {
      if (titleLower.includes(word) || descLower.includes(word)) {
        if ((window as any).addToast) {
          (window as any).addToast({
            type: 'error',
            title: '内容审核失败',
            message: '请使用健康、积极、建设性的语言'
          })
        }
        return
      }
    }

    const result = await createProposal(formData)
    if (result) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'success',
          title: '提案创建成功',
          message: '提案已提交，等待社区投票'
        })
      }
      // 重置表单
      setFormData({
        title: '',
        description: '',
        type: 'game'
      })
      // 切换到提案列表
      setSelectedTab('proposals')
      refreshProposals()
      refreshUserProposals() // 刷新用户提案历史
    } else if (createError) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '创建失败',
          message: createError
        })
      }
    }
  }

  // 删除提案
  const handleDeleteProposal = (proposal: any) => {
    setSelectedProposalForEdit(proposal)
    setDeleteModalOpen(true)
  }

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!selectedProposalForEdit) return

    try {
      await deleteProposal(selectedProposalForEdit.id)
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'success',
          title: '删除成功',
          message: '提案已成功删除'
        })
      }

      setDeleteModalOpen(false)
      setSelectedProposalForEdit(null)
      refreshUserProposals()
    } catch (error) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '删除失败',
          message: error instanceof Error ? error.message : '操作失败'
        })
      }
    }
  }

  // 调试用户状态
  console.log('📊 CommunitySection 用户状态:', {
    connected,
    userLoading,
    userExists: !!user,
    userVotes: user?.availableVotes,
    userError
  })

  // 计算用户积分状态
  const getUserScoreStatus = (user: any) => {
    if (!user) return { score: 0, canCreate: false }
    
    const votes = user.totalVotes || 0
    const checkinDays = user.dailyCheckin?.totalCheckins || 0
    const inviteCount = user.inviteRewards?.totalInvites || 0
    const calculatedScore = checkinDays * 3 + votes * 2 + inviteCount * 5
    
    return {
      score: calculatedScore,
      canCreate: calculatedScore >= 300,
      scoreColor: calculatedScore >= 300 ? 'text-retro-green' : 'text-red-400'
    }
  }

  // 缓存用户积分状态
  const scoreStatus = useMemo(() => getUserScoreStatus(user), [user])

  // 防抖用户状态检查
  const [stableUser, setStableUser] = useState(user)
  useEffect(() => {
    const timer = setTimeout(() => {
      setStableUser(user)
    }, 100) // 100ms防抖
    
    return () => clearTimeout(timer)
  }, [user])

  return (
    <section id="community" className="py-20 relative">
      {/* 网络连接线背景 */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg className="w-full h-full">
          {networkLines.map((line) => (
            <motion.line
              key={line.id}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="#00FF00"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: line.duration,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">


        {/* 社区统计 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {communityStatsMap[lang].map((stat, index) => (
            <motion.div
              key={`community-stat-${stat.label}-${index}`}
              whileHover={{ scale: 1.05 }}
              className="pixel-card p-6 text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-bold game-score ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 font-pixel mt-1">
                {stat.label}
              </div>
              <div className="text-xs text-retro-green font-pixel mt-1">
                {stat.change}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 标签导航 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="flex space-x-1 bg-black/50 p-1 rounded-lg border border-retro-green/30">
            {tabsMap[lang].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-6 py-3 rounded font-pixel text-sm transition-all ${
                  selectedTab === tab.id
                    ? 'bg-retro-green text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 内容区域 */}
        <div className="min-h-[600px]">
          {selectedTab === 'proposals' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {proposals.map((proposal, index) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`pixel-card p-6 transition-all duration-300 cursor-pointer ${
                    selectedProposal === proposal.id ? 'border-retro-yellow scale-[1.02]' : ''
                  }`}
                  onMouseEnter={() => setSelectedProposal(proposal.id)}
                  onMouseLeave={() => setSelectedProposal(null)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* 提案信息 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className={`px-3 py-1 text-xs font-pixel rounded-full border ${getStatusColor(proposal.status)}`}>
                          {getStatusText(proposal.status)}
                        </span>
                        <span className="text-sm text-gray-500 font-pixel">
                          {proposal.category}
                        </span>
                        <span className="text-sm text-gray-500 font-pixel">
                          by {proposal.author}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-retro text-white mb-2">
                        {proposal.title}
                      </h3>
                      <p className="text-gray-400 text-sm font-pixel leading-relaxed">
                        {proposal.description}
                      </p>
                    </div>

                    {/* 投票信息 */}
                    <div className="lg:ml-8 mt-4 lg:mt-0 lg:text-right">
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-2">
                        <div>
                          <div className="text-lg font-bold text-retro-green game-score">
                            👍 {proposal.votesFor.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400 font-pixel">{voteTextMap[lang].support}</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-400 game-score">
                            👎 {proposal.votesAgainst.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400 font-pixel">{voteTextMap[lang].against}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="text-sm text-retro-cyan font-pixel">
                          ⏰ {proposal.timeLeft}
                        </div>
                      </div>

                      {proposal.status === 'active' && (
                        <div className="mt-4 space-y-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full neon-button text-retro-green border-retro-green px-4 py-2 text-sm"
                            onClick={() => handleVote(proposal.id.toString(), 'for')}
                          >
                            {voteTextMap[lang].voteFor}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full neon-button text-red-400 border-red-400 px-4 py-2 text-sm"
                            onClick={() => handleVote(proposal.id.toString(), 'against')}
                          >
                            {voteTextMap[lang].voteAgainst}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 投票进度条 */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 font-pixel mb-2">
                      <span>{voteTextMap[lang].progress}</span>
                      <span>
                        {((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(1)}% {voteTextMap[lang].supportPercent}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ 
                          width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` 
                        }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-retro-green to-retro-cyan"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedTab === 'create' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="pixel-card p-8">
                <h3 className="text-2xl font-retro text-retro-cyan mb-6">{createFormMap[lang].title}</h3>
                
                {/* 积分状态提示 */}
                {connected && (
                  <div className="mb-6 p-4 border-2 border-gray-600 rounded bg-gray-900">
                    {userLoading ? (
                      <div className="text-center">
                        <div className="text-retro-cyan text-sm font-pixel mb-2">
                          ⏳ 正在加载用户数据...
                        </div>
                        <div className="text-gray-400 text-xs font-pixel">
                          请稍等，正在从服务器获取您的积分信息
                        </div>
                      </div>
                    ) : !user ? (
                      <div className="text-center">
                        <div className="text-red-400 text-sm font-pixel mb-2">
                          ❌ 用户数据获取失败
                        </div>
                        {userError && (
                          <div className="text-red-300 text-xs font-pixel mb-2">
                            错误详情：{userError}
                          </div>
                        )}
                        <div className="text-gray-400 text-xs font-pixel mb-3">
                          请尝试重新连接钱包或手动重试
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={async () => {
                            console.log('🔄 手动重试获取用户数据...')
                            const result = await connectUser()
                            if (result) {
                              console.log('✅ 手动重试成功:', result.user.availableVotes, '票')
                            } else {
                              console.log('❌ 手动重试失败')
                            }
                          }}
                          className="neon-button text-retro-cyan border-retro-cyan px-4 py-2 text-xs"
                        >
                          🔄 重新获取用户数据
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-pixel text-gray-400">当前积分</span>
                          <span className={`text-lg font-bold ${scoreStatus.scoreColor}`}>
                            {scoreStatus.score} / 300
                          </span>
                        </div>
                        
                        {scoreStatus.canCreate ? (
                          <div className="text-center">
                            <div className="text-retro-green text-sm font-pixel">
                              ✅ 积分充足，可以创建提案
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-red-400 text-sm font-pixel mb-2">
                              ❌ 积分不足，需要300积分才能创建提案
                            </div>
                            <div className="text-gray-400 text-xs font-pixel">
                              通过投票、签到等方式获得更多积分
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-pixel text-retro-green mb-2">{createFormMap[lang].titleLabel}</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className={`w-full px-4 py-3 bg-black border-2 rounded font-pixel text-white ${
                        formData.title.length > 200 ? 'border-red-400' : 'border-gray-600 focus:border-retro-green'
                      }`}
                      placeholder={createFormMap[lang].titlePlaceholder}
                      maxLength={250}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <div className={`text-xs font-pixel ${
                        formData.title.length > 200 ? 'text-red-400' : 
                        formData.title.length > 180 ? 'text-yellow-400' : 'text-gray-500'
                      }`}>
                        {formData.title.length}/200 字符
                      </div>
                      {formData.title.length > 200 && (
                        <div className="text-xs text-red-400 font-pixel">❌ 超出限制</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-pixel text-retro-green mb-2">{createFormMap[lang].typeLabel}</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'game' | 'governance' | 'technical' | 'funding'})}
                      className="w-full px-4 py-3 bg-black border-2 border-gray-600 focus:border-retro-green rounded font-pixel text-white"
                      title={createFormMap[lang].typeLabel}
                    >
                      <option value="game">{createFormMap[lang].gameProposal}</option>
                      <option value="governance">{createFormMap[lang].governanceProposal}</option>
                      <option value="technical">{createFormMap[lang].technicalProposal}</option>
                      <option value="funding">{createFormMap[lang].fundingProposal}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-pixel text-retro-green mb-2">{createFormMap[lang].descLabel}</label>
                    <textarea
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className={`w-full px-4 py-3 bg-black border-2 rounded font-pixel text-white resize-none ${
                        formData.description.length > 2000 ? 'border-red-400' : 'border-gray-600 focus:border-retro-green'
                      }`}
                      placeholder={createFormMap[lang].descPlaceholder}
                      maxLength={2100}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <div className={`text-xs font-pixel ${
                        formData.description.length > 2000 ? 'text-red-400' : 
                        formData.description.length > 1800 ? 'text-yellow-400' : 'text-gray-500'
                      }`}>
                        {formData.description.length}/2000 字符
                      </div>
                      {formData.description.length > 2000 && (
                        <div className="text-xs text-red-400 font-pixel">❌ 超出限制</div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: !createLoading ? 1.05 : 1 }}
                      whileTap={{ scale: !createLoading ? 0.95 : 1 }}
                      className={`neon-button px-8 py-3 ${
                        createLoading
                          ? 'text-gray-500 border-gray-500 cursor-not-allowed opacity-50'
                          : 'text-retro-cyan border-retro-cyan'
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // 检查是否可以提交
                        if (createLoading) return
                        
                        if (!connected) {
                          if ((window as any).addToast) {
                            (window as any).addToast({
                              type: 'error',
                              title: '钱包未连接',
                              message: '请先连接钱包'
                            })
                          }
                          return
                        }
                        
                        if (userLoading) {
                          if ((window as any).addToast) {
                            (window as any).addToast({
                              type: 'warning',
                              title: '用户数据加载中',
                              message: '请等待用户数据加载完成后再试'
                            })
                          }
                          return
                        }
                        
                        if (!user) {
                          if ((window as any).addToast) {
                            (window as any).addToast({
                              type: 'error',
                              title: '用户数据异常',
                              message: '用户数据获取失败，请尝试重新连接钱包'
                            })
                          }
                          return
                        }
                        
                        if (!formData.title.trim()) {
                          if ((window as any).addToast) {
                            (window as any).addToast({
                              type: 'error',
                              title: '标题为空',
                              message: '请填写提案标题'
                            })
                          }
                          return
                        }
                        
                        if (!formData.description.trim()) {
                          if ((window as any).addToast) {
                            (window as any).addToast({
                              type: 'error',
                              title: '描述为空',
                              message: '请填写提案描述'
                            })
                          }
                          return
                        }
                        
                        if (formData.title.length > 200) {
                          if ((window as any).addToast) {
                            (window as any).addToast({
                              type: 'error',
                              title: '标题过长',
                              message: `标题不能超过200字符，当前：${formData.title.length}字符`
                            })
                          }
                          return
                        }
                        
                        if (formData.description.length > 2000) {
                          if ((window as any).addToast) {
                            (window as any).addToast({
                              type: 'error',
                              title: '描述过长',
                              message: `描述不能超过2000字符，当前：${formData.description.length}字符`
                            })
                          }
                          return
                        }
                        
                        // 所有条件都满足，提交提案
                        handleCreateProposal(e)
                      }}
                      disabled={createLoading}
                    >
                      {createLoading ? '提交中...' : createFormMap[lang].submit}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {!connected ? (
                <div className="text-center py-16">
                  <div className="pixel-card p-8 max-w-2xl mx-auto">
                    <div className="text-6xl mb-4">🔗</div>
                    <h3 className="text-2xl font-retro text-retro-yellow mb-4">连接钱包查看历史</h3>
                    <p className="text-gray-400 font-pixel">
                      请连接钱包来查看您的提案历史记录
                    </p>
                  </div>
                </div>
              ) : userProposalsLoading ? (
                <div className="text-center py-16">
                  <div className="pixel-card p-8 max-w-2xl mx-auto">
                    <div className="text-6xl mb-4">⏳</div>
                    <h3 className="text-2xl font-retro text-retro-cyan mb-4">加载中...</h3>
                    <p className="text-gray-400 font-pixel">
                      正在获取您的提案历史记录
                    </p>
                  </div>
                </div>
              ) : userProposalsData && userProposalsData.proposals.length > 0 ? (
                <>
                  {/* 用户提案统计 */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="pixel-card p-4 text-center">
                      <div className="text-2xl font-bold text-retro-green game-score">
                        {userProposalsData.stats.totalProposals}
                      </div>
                      <div className="text-xs text-gray-400 font-pixel">总提案</div>
                    </div>
                    <div className="pixel-card p-4 text-center">
                      <div className="text-2xl font-bold text-retro-cyan game-score">
                        {userProposalsData.stats.activeProposals}
                      </div>
                      <div className="text-xs text-gray-400 font-pixel">进行中</div>
                    </div>
                    <div className="pixel-card p-4 text-center">
                      <div className="text-2xl font-bold text-retro-green game-score">
                        {userProposalsData.stats.passedProposals}
                      </div>
                      <div className="text-xs text-gray-400 font-pixel">已通过</div>
                    </div>
                    <div className="pixel-card p-4 text-center">
                      <div className="text-2xl font-bold text-red-400 game-score">
                        {userProposalsData.stats.failedProposals}
                      </div>
                      <div className="text-xs text-gray-400 font-pixel">未通过</div>
                    </div>
                    <div className="pixel-card p-4 text-center">
                      <div className="text-2xl font-bold text-retro-yellow game-score">
                        {userProposalsData.stats.totalVotes}
                      </div>
                      <div className="text-xs text-gray-400 font-pixel">总票数</div>
                    </div>
                    <div className="pixel-card p-4 text-center">
                      <div className="text-2xl font-bold text-retro-magenta game-score">
                        {userProposalsData.stats.averageSupport}%
                      </div>
                      <div className="text-xs text-gray-400 font-pixel">平均支持率</div>
                    </div>
                  </div>

                  {/* 用户提案列表 */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-retro text-white mb-4">📋 我的提案历史</h3>
                    {userProposalsData.proposals.map((proposal, index) => (
                      <motion.div
                        key={proposal.id}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="pixel-card p-6 transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          {/* 提案信息 */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <span className={`px-3 py-1 text-xs font-pixel rounded-full border ${getStatusColor(proposal.status)}`}>
                                {getStatusText(proposal.status)}
                              </span>
                              <span className="text-sm text-gray-500 font-pixel">
                                {proposal.category}
                              </span>
                              <span className="text-sm text-gray-500 font-pixel">
                                创建于 {new Date(proposal.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <h3 className="text-xl font-retro text-white mb-2">
                              {proposal.title}
                            </h3>
                            <p className="text-gray-400 text-sm font-pixel leading-relaxed">
                              {proposal.description}
                            </p>
                          </div>

                          {/* 投票结果 */}
                          <div className="lg:ml-8 mt-4 lg:mt-0 lg:text-right">
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-2">
                              <div>
                                <div className="text-lg font-bold text-retro-green game-score">
                                  👍 {proposal.votesFor.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400 font-pixel">支持票</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-red-400 game-score">
                                  👎 {proposal.votesAgainst.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400 font-pixel">反对票</div>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <div className="text-sm text-retro-cyan font-pixel">
                                支持率: {proposal.supportRate}%
                              </div>
                              <div className="text-sm text-gray-500 font-pixel">
                                {proposal.timeLeft}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 投票进度条 */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-400 font-pixel mb-2">
                            <span>投票结果</span>
                            <span>{proposal.supportRate}% 支持</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${proposal.supportRate}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-full bg-gradient-to-r from-retro-green to-retro-cyan"
                            />
                          </div>
                        </div>

                        {/* 管理按钮 */}
                        <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                          {(proposal.status === 'pending' || (proposal.votesFor + proposal.votesAgainst === 0)) && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteProposal(proposal)}
                              className="flex items-center space-x-2 text-xs font-pixel text-red-400 hover:text-red-300 transition-colors border border-red-400 hover:border-red-300 rounded px-3 py-1"
                            >
                              <span>🗑️</span>
                              <span>删除</span>
                            </motion.button>
                          )}

                          <div className="text-xs text-gray-500 font-pixel flex items-center">
                            💡 只能删除待审核或无投票的提案
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="pixel-card p-8 max-w-2xl mx-auto">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-2xl font-retro text-retro-yellow mb-4">暂无提案历史</h3>
                    <p className="text-gray-400 font-pixel mb-6">
                      您还没有创建过任何提案。点击"创建提案"来发起您的第一个提案吧！
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="neon-button text-retro-green border-retro-green px-6 py-3"
                      onClick={() => setSelectedTab('create')}
                    >
                      ➕ 创建提案
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* DAO 治理说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          {/* 提案规则说明 */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h3 className="text-3xl font-retro text-retro-cyan mb-4">📋 提案规则说明</h3>
              <p className="text-gray-400 font-pixel max-w-3xl mx-auto">
                为确保社区治理的公平性和质量，请仔细阅读以下提案规则
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* 积分要求 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="pixel-card p-6"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="text-lg font-retro text-retro-yellow mb-3">积分要求</h4>
                  <div className="text-2xl font-bold text-retro-green mb-2">300积分</div>
                  <p className="text-sm text-gray-400 font-pixel">
                    创建提案需要达到300积分门槛，通过投票、签到等活动获得积分
                  </p>
                </div>
              </motion.div>

              {/* 投票时间 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="pixel-card p-6"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">⏰</div>
                  <h4 className="text-lg font-retro text-retro-cyan mb-3">投票时间</h4>
                  <div className="text-2xl font-bold text-retro-cyan mb-2">7天</div>
                  <p className="text-sm text-gray-400 font-pixel">
                    每个提案的投票期为7天，到期后自动结算投票结果
                  </p>
                </div>
              </motion.div>

              {/* 通过条件 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pixel-card p-6"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h4 className="text-lg font-retro text-retro-green mb-3">通过条件</h4>
                  <div className="text-2xl font-bold text-retro-green mb-2">60%+</div>
                  <p className="text-sm text-gray-400 font-pixel">
                    支持率达到60%且最少50票才能通过提案
                  </p>
                </div>
              </motion.div>

              {/* 提案类型 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pixel-card p-6"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">📝</div>
                  <h4 className="text-lg font-retro text-retro-magenta mb-3">提案类型</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div>🎮 游戏提案</div>
                    <div>🏛️ 治理提案</div>
                    <div>⚙️ 技术提案</div>
                    <div>💰 资金提案</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 详细规则说明 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pixel-card p-8"
            >
              <h4 className="text-xl font-retro text-retro-green mb-6 text-center">📖 详细规则</h4>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h5 className="text-lg font-retro text-retro-cyan mb-4">📝 提案创建规则</h5>
                  <div className="space-y-3 text-sm text-gray-300 font-pixel">
                    <div className="flex items-start space-x-2">
                      <span className="text-retro-green">•</span>
                      <span>需要300积分才能创建提案</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-retro-green">•</span>
                      <span>标题不超过200个字符</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-retro-green">•</span>
                      <span>描述不超过2000个字符</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-retro-green">•</span>
                      <span>必须选择合适的提案类型</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-retro-green">•</span>
                      <span>内容需健康、积极、建设性</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-lg font-retro text-retro-yellow mb-4">🗳️ 投票规则</h5>
                  <div className="space-y-3 text-sm text-gray-300 font-pixel">
                    <div className="flex items-start space-x-2">
                      <span className="text-retro-yellow">•</span>
                      <span>每个用户对每个提案只能投一票</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-retro-yellow">•</span>
                      <span>投票不消耗用户的投票票数</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-retro-yellow">•</span>
                      <span>投票一旦提交不可修改</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-retro-yellow">•</span>
                      <span>投票结果公开透明</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-retro-yellow">•</span>
                      <span>7天投票期结束后自动结算</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <h5 className="text-lg font-retro text-retro-magenta mb-4 text-center">🎯 通过与执行</h5>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300 font-pixel">
                  <div className="text-center">
                    <div className="text-retro-green text-lg mb-2">✅ 通过条件</div>
                    <div>支持率 ≥ 60%</div>
                    <div>总票数 ≥ 50票</div>
                    <div>投票期内达成</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 text-lg mb-2">❌ 未通过</div>
                    <div>支持率 &lt; 60%</div>
                    <div>或总票数 &lt; 50票</div>
                    <div>投票期结束未达成</div>
                  </div>
                  <div className="text-center">
                    <div className="text-retro-cyan text-lg mb-2">⚡ 自动执行</div>
                    <div>通过的提案</div>
                    <div>将由开发团队</div>
                    <div>评估并执行</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {governanceInfoMap[lang].map((info, index) => (
              <div key={`governance-info-${info.title}-${index}`} className="pixel-card p-6 text-center">
                <div className="text-4xl mb-4">{info.icon}</div>
                <h4 className="text-lg font-retro text-retro-green mb-3">{info.title}</h4>
                <p className="text-sm text-gray-400 font-pixel">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 删除确认模态 */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={managementLoading}
        title={selectedProposalForEdit?.title || ''}
      />
    </section>
  )
}) 