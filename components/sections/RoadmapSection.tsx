'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Milestone {
  phase: string
  period: string
  title: string
  description: string[]
  status: 'completed' | 'current' | 'upcoming'
  icon: string
  color: string
}

interface Star {
  id: number
  x: number
  y: number
  opacity: number
  duration: number
}

import { useLanguage } from '@/contexts/LanguageContext'

export default function RoadmapSection() {
  const { lang } = useLanguage()
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null)
  const [stars, setStars] = useState<Star[]>([])
  const [isClient, setIsClient] = useState(false)

  const titleMap = {
    en: '🗺️ Project Roadmap',
    zh: '🗺️ 项目路线图',
    ja: '🗺️ プロジェクトロードマップ',
    ko: '🗺️ 프로젝트 로드맵'
  }
  const descMap = {
    en: 'Clear development plan leading classic games toward the Web3 future',
    zh: '清晰的发展计划，带领经典游戏走向Web3的未来',
    ja: 'クラシックゲームをWeb3の未来へ導く明確な開発計画',
    ko: '클래식 게임을 Web3 미래로 이끄는 명확한 개발 계획'
  }

  const roadmapDataMap = {
    en: [
      {
        phase: "Phase 1",
        period: "Q1 2025",
        title: "Project Launch",
        description: [
          "Release project whitepaper and website",
          "Community building and early user acquisition",
          "Solana wallet integration development",
          "Initial game library planning and compilation"
        ],
        status: "completed" as const,
        icon: "🚀",
        color: "#00FF00"
      },
      {
        phase: "Phase 2",
        period: "Q2 2025",
        title: "Voting Platform Launch",
        description: [
          "Official release of game voting system",
          "Launch first round of classic game voting",
          "Token presale and liquidity pool setup",
          "Implement community governance mechanism"
        ],
        status: "current" as const,
        icon: "🗳️",
        color: "#00FFFF"
      },
      {
        phase: "Phase 3",
        period: "Q3 2025",
        title: "First Game Development",
        description: [
          "Voting platform goes live, launch first round voting",
          "Select first classic game, create exclusive meme token, launch SOL fundraising",
          "Complete first game development, integrate P2E mechanism"
        ],
        status: "upcoming" as const,
        icon: "🎮",
        color: "#FFFF00"
      },
      {
        phase: "Phase 4",
        period: "Q4 2025",
        title: "Second Game & Expansion",
        description: [
          "First game goes live, launch second round voting",
          "Select second classic game, create exclusive meme token, launch SOL fundraising"
        ],
        status: "upcoming" as const,
        icon: "💎",
        color: "#FF00FF"
      },
      {
        phase: "Phase 5",
        period: "Q1 2026",
        title: "Ecosystem Completion",
        description: [
          "Complete second game development, integrate P2E mechanism",
          "Complete staking protocol application implementation",
          "Continue developing more games, expand ecosystem"
        ],
        status: "upcoming" as const,
        icon: "🌐",
        color: "#FF8000"
      }
    ],
    zh: [
      {
        phase: "阶段 1",
        period: "Q1 2025",
        title: "项目启动",
        description: [
          "发布项目白皮书和网站",
          "社区建设和早期用户获取",
          "Solana 钱包集成开发",
          "初始游戏库策划和整理"
        ],
        status: "completed" as const,
        icon: "🚀",
        color: "#00FF00"
      },
      {
        phase: "阶段 2",
        period: "Q2 2025",
        title: "投票平台上线",
        description: [
          "游戏投票系统正式发布",
          "第一轮经典游戏投票启动",
          "代币预售和流动性池设置",
          "社区治理机制实施"
        ],
        status: "current" as const,
        icon: "🗳️",
        color: "#00FFFF"
      },
      {
        phase: "阶段 3",
        period: "2025-Q3",
        title: "首款游戏开发",
        description: [
          "投票平台上线，启动首轮投票",
          "选出第一款经典游戏，创建其专属 meme 代币，启动 SOL 募集",
          "完成第一款游戏的开发，集成 P2E 机制"
        ],
        status: "upcoming" as const,
        icon: "🎮",
        color: "#FFFF00"
      },
      {
        phase: "阶段 4",
        period: "2025-Q4",
        title: "第二款游戏与扩展",
        description: [
          "第一款游戏上线，启动第二轮投票",
          "选出第二款经典游戏，创建其专属 meme 代币，启动 SOL 募集"
        ],
        status: "upcoming" as const,
        icon: "💎",
        color: "#FF00FF"
      },
      {
        phase: "阶段 5",
        period: "2026-Q1",
        title: "生态系统完善",
        description: [
          "完成第二款游戏的开发，集成 P2E 机制",
          "完成staking协议的应用落地",
          "持续开发更多游戏，扩展生态系统"
        ],
        status: "upcoming" as const,
        icon: "🌐",
        color: "#FF8000"
      }
    ],
    ja: [
      {
        phase: "フェーズ 1",
        period: "Q1 2025",
        title: "プロジェクト開始",
        description: [
          "プロジェクトホワイトペーパーとウェブサイトのリリース",
          "コミュニティ構築と初期ユーザー獲得",
          "Solanaウォレット統合開発",
          "初期ゲームライブラリの企画と整理"
        ],
        status: "completed" as const,
        icon: "🚀",
        color: "#00FF00"
      },
      {
        phase: "フェーズ 2",
        period: "Q2 2025",
        title: "投票プラットフォーム開始",
        description: [
          "ゲーム投票システムの正式リリース",
          "第1回クラシックゲーム投票の開始",
          "トークンプレセールと流動性プール設定",
          "コミュニティガバナンス機構の実装"
        ],
        status: "current" as const,
        icon: "🗳️",
        color: "#00FFFF"
      },
      {
        phase: "フェーズ 3",
        period: "2025-Q3",
        title: "初回ゲーム開発",
        description: [
          "投票プラットフォーム開始、初回投票開始",
          "初回クラシックゲーム選定、専用ミームトークン作成、SOL募金開始",
          "初回ゲーム開発完了、P2E機構統合"
        ],
        status: "upcoming" as const,
        icon: "🎮",
        color: "#FFFF00"
      },
      {
        phase: "フェーズ 4",
        period: "2025-Q4",
        title: "第2ゲーム＆拡張",
        description: [
          "初回ゲーム開始、第2回投票開始",
          "第2クラシックゲーム選定、専用ミームトークン作成、SOL募金開始"
        ],
        status: "upcoming" as const,
        icon: "💎",
        color: "#FF00FF"
      },
      {
        phase: "フェーズ 5",
        period: "2026-Q1",
        title: "エコシステム完成",
        description: [
          "第2ゲーム開発完了、P2E機構統合",
          "ステーキングプロトコルアプリケーション実装完了",
          "より多くのゲーム開発継続、エコシステム拡張"
        ],
        status: "upcoming" as const,
        icon: "🌐",
        color: "#FF8000"
      }
    ],
    ko: [
      {
        phase: "1단계",
        period: "Q1 2025",
        title: "프로젝트 시작",
        description: [
          "프로젝트 백서 및 웹사이트 출시",
          "커뮤니티 구축 및 초기 사용자 확보",
          "Solana 지갑 통합 개발",
          "초기 게임 라이브러리 기획 및 정리"
        ],
        status: "completed" as const,
        icon: "🚀",
        color: "#00FF00"
      },
      {
        phase: "2단계",
        period: "Q2 2025",
        title: "투표 플랫폼 출시",
        description: [
          "게임 투표 시스템 정식 출시",
          "첫 번째 클래식 게임 투표 시작",
          "토큰 프리세일 및 유동성 풀 설정",
          "커뮤니티 거버넌스 메커니즘 구현"
        ],
        status: "current" as const,
        icon: "🗳️",
        color: "#00FFFF"
      },
      {
        phase: "3단계",
        period: "2025-Q3",
        title: "첫 게임 개발",
        description: [
          "투표 플랫폼 출시, 첫 라운드 투표 시작",
          "첫 번째 클래식 게임 선정, 전용 밈 토큰 생성, SOL 모금 시작",
          "첫 번째 게임 개발 완료, P2E 메커니즘 통합"
        ],
        status: "upcoming" as const,
        icon: "🎮",
        color: "#FFFF00"
      },
      {
        phase: "4단계",
        period: "2025-Q4",
        title: "두 번째 게임 & 확장",
        description: [
          "첫 번째 게임 출시, 두 번째 라운드 투표 시작",
          "두 번째 클래식 게임 선정, 전용 밈 토큰 생성, SOL 모금 시작"
        ],
        status: "upcoming" as const,
        icon: "💎",
        color: "#FF00FF"
      },
      {
        phase: "5단계",
        period: "2026-Q1",
        title: "생태계 완성",
        description: [
          "두 번째 게임 개발 완료, P2E 메커니즘 통합",
          "스테이킹 프로토콜 애플리케이션 구현 완료",
          "더 많은 게임 개발 지속, 생태계 확장"
        ],
        status: "upcoming" as const,
        icon: "🌐",
        color: "#FF8000"
      }
    ]
  }

  const statsMap = {
    en: [
      { label: "Completed Milestones", value: "1", color: "text-retro-green" },
      { label: "Currently In Progress", value: "1", color: "text-retro-cyan" },
      { label: "Planned Phases", value: "3", color: "text-retro-yellow" },
      { label: "Expected Completion", value: "18mo", color: "text-retro-magenta" },
    ],
    zh: [
      { label: "已完成里程碑", value: "1", color: "text-retro-green" },
      { label: "当前进行中", value: "1", color: "text-retro-cyan" },
      { label: "计划中阶段", value: "3", color: "text-retro-yellow" },
      { label: "预计完成时间", value: "18月", color: "text-retro-magenta" },
    ],
    ja: [
      { label: "完了マイルストーン", value: "1", color: "text-retro-green" },
      { label: "現在進行中", value: "1", color: "text-retro-cyan" },
      { label: "計画フェーズ", value: "3", color: "text-retro-yellow" },
      { label: "完了予定", value: "18ヶ月", color: "text-retro-magenta" },
    ],
    ko: [
      { label: "완료된 마일스톤", value: "1", color: "text-retro-green" },
      { label: "현재 진행 중", value: "1", color: "text-retro-cyan" },
      { label: "계획된 단계", value: "3", color: "text-retro-yellow" },
      { label: "완료 예정", value: "18개월", color: "text-retro-magenta" },
    ]
  }

  const statusTextMap = {
    en: {
      completed: '✅ Completed',
      current: '🔄 In Progress', 
      upcoming: '⏳ Coming Soon'
    },
    zh: {
      completed: '✅ 已完成',
      current: '🔄 进行中',
      upcoming: '⏳ 即将到来'
    },
    ja: {
      completed: '✅ 完了',
      current: '🔄 進行中',
      upcoming: '⏳ 近日公開'
    },
    ko: {
      completed: '✅ 완료',
      current: '🔄 진행 중',
      upcoming: '⏳ 곧 출시'
    }
  }

  const warningTitleMap = {
    en: '⚠️ Important Notice',
    zh: '⚠️ 重要说明',
    ja: '⚠️ 重要なお知らせ',
    ko: '⚠️ 중요 공지'
  }

  const warningTextMap = {
    en: 'Roadmap timelines may be adjusted based on technical development, market conditions and community feedback. We are committed to maintaining transparency and regularly updating the community on project progress. All major changes will be decided through community voting.',
    zh: '路线图时间安排可能会根据技术发展、市场条件和社区反馈进行调整。我们承诺保持透明度，定期向社区更新项目进展情况。所有重大变更都将通过社区投票决定。',
    ja: 'ロードマップのタイムラインは、技術開発、市場状況、コミュニティフィードバックに基づいて調整される場合があります。私たちは透明性を保ち、プロジェクトの進捗について定期的にコミュニティに更新することをお約束します。すべての重要な変更はコミュニティ投票によって決定されます。',
    ko: '로드맵 타임라인은 기술 개발, 시장 상황 및 커뮤니티 피드백에 따라 조정될 수 있습니다. 우리는 투명성을 유지하고 프로젝트 진행 상황에 대해 정기적으로 커뮤니티에 업데이트할 것을 약속합니다. 모든 주요 변경 사항은 커뮤니티 투표를 통해 결정됩니다.'
  }

  const roadmapData = roadmapDataMap[lang]

  useEffect(() => {
    setIsClient(true)
    // 生成固定的星空数据（避免水合错误）
    const starField: Star[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: (i * 3 + 5) % 100, // 使用固定算法生成位置
      y: (i * 7 + 11) % 100,
      opacity: ((i % 10) + 1) / 10, // 生成0.1到1.0的固定透明度
      duration: (i % 3) + 1
    }))
    setStars(starField)
  }, [])

  return (
    <section id="roadmap" className="py-20 relative">
      {/* 星空背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {isClient && stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ 
              left: `${star.x}%`,
              top: `${star.y}%`
            }}
            initial={{ 
              opacity: star.opacity 
            }}
            animate={{ 
              opacity: [0.3, star.opacity, 0.3]
            }}
            transition={{ 
              duration: star.duration,
              repeat: Infinity 
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">


        {/* 路线图时间线 */}
        <div className="relative">
          {/* 中央时间线 */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-retro-green via-retro-cyan to-retro-yellow"></div>

          {/* 里程碑节点 */}
          <div className="space-y-16">
            {roadmapData.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? '' : 'md:flex-row-reverse'
                }`}
              >
                {/* 内容卡片 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`w-full md:w-5/12 ${
                    selectedMilestone === index ? 'scale-105' : ''
                  } transition-transform duration-300`}
                  onMouseEnter={() => setSelectedMilestone(index)}
                  onMouseLeave={() => setSelectedMilestone(null)}
                >
                  <div className={`pixel-card p-6 ${
                    milestone.status === 'completed' ? 'border-retro-green' :
                    milestone.status === 'current' ? 'border-retro-cyan' :
                    'border-gray-600'
                  }`}>
                    {/* 状态标签 */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-xs font-pixel rounded-full ${
                        milestone.status === 'completed' ? 'bg-retro-green/20 text-retro-green' :
                        milestone.status === 'current' ? 'bg-retro-cyan/20 text-retro-cyan' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        {statusTextMap[lang][milestone.status]}
                      </span>
                      <span className="text-sm font-pixel text-gray-400">
                        {milestone.period}
                      </span>
                    </div>

                    {/* 阶段信息 */}
                    <div className="mb-4">
                      <h3 className="text-sm font-pixel" style={{ color: milestone.color }}>
                        {milestone.phase}
                      </h3>
                      <h4 className="text-xl font-retro text-white mt-1">
                        {milestone.title}
                      </h4>
                    </div>

                    {/* 详细描述 */}
                    <ul className="space-y-2">
                      {milestone.description.map((item, itemIndex) => (
                        <motion.li
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                          className="text-sm text-gray-400 font-pixel flex items-start"
                        >
                          <span className="text-retro-green mr-2">•</span>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* 中央节点 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl ${
                      milestone.status === 'completed' ? 'bg-retro-green border-retro-green' :
                      milestone.status === 'current' ? 'bg-retro-cyan border-retro-cyan animate-pulse' :
                      'bg-gray-600 border-gray-600'
                    }`}
                  >
                    {milestone.icon}
                  </motion.div>
                  
                  {/* 发光效果 */}
                  {milestone.status === 'current' && (
                    <div className="absolute inset-0 rounded-full animate-ping" 
                         style={{ backgroundColor: milestone.color, opacity: 0.3 }} />
                  )}
                </div>

                {/* 连接线动画 */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '40%' }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={`h-0.5 ${
                    index % 2 === 0 ? 'ml-auto mr-8' : 'mr-auto ml-8'
                  }`}
                  style={{ backgroundColor: milestone.color }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* 统计数据 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {statsMap[lang].map((stat, index) => (
            <div key={index} className="pixel-card p-4 text-center">
              <div className={`text-2xl font-bold game-score ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 font-pixel mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* 重要提醒 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          <div className="pixel-card p-6 max-w-4xl mx-auto border-retro-yellow">
            <h3 className="text-xl font-retro text-retro-yellow mb-4">{warningTitleMap[lang]}</h3>
            <p className="text-gray-400 font-pixel text-sm leading-relaxed">
              {warningTextMap[lang]}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 