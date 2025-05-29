'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TokenAllocation {
  label: string
  percentage: number
  amount: string
  color: string
  description: string
  icon: string
}

interface DigitalRainDrop {
  id: number
  x: number
  y: number
  duration: number
  delay: number
  content: string
}

import { useLanguage } from '@/contexts/LanguageContext'

export default function TokenomicsSection() {
  const { lang } = useLanguage()
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [digitalRain, setDigitalRain] = useState<DigitalRainDrop[]>([])
  const [isClient, setIsClient] = useState(false)

  const titleMap = {
    en: '🪙 Tokenomics',
    zh: '🪙 代币经济学',
    ja: '🪙 トークンエコノミクス',
    ko: '🪙 토큰 이코노믹스'
  }
  const descMap = {
    en: 'Transparent token distribution mechanism ensuring fair participation and long-term sustainable development',
    zh: '透明的代币分配机制，确保公平参与和长期可持续发展',
    ja: '透明なトークン分配メカニズムを確保し、長期的な持続可能性を確保する',
    ko: '투명한 토큰 할당 메커니즘을 보장하여 공정 참여와 장기간 지속 가능한 개발을 보장합니다.'
  }
  const chartTitleMap = {
    en: 'Token Distribution Chart',
    zh: '代币分配图',
    ja: 'トークン分配チャート',
    ko: '토큰 할당 차트'
  }
  const totalSupplyMap = {
    en: 'Total Supply',
    zh: '总供应量',
    ja: '総供給量',
    ko: '총 공급량'
  }
  const tokensMap = {
    en: 'GAME Tokens',
    zh: 'GAME 代币',
    ja: 'GAME トークン',
    ko: 'GAME 토큰'
  }
  const launchTitleMap = {
    en: '🚀 Token Launch Mechanism',
    zh: '🚀 代币发射机制',
    ja: '🚀 トークン発射メカニズム',
    ko: '🚀 토큰 발사 기구'
  }
  const step1Map = {
    en: 'Step 1: Voting',
    zh: '步骤 1: 投票',
    ja: 'ステップ 1: 投票',
    ko: '단계 1: 투표'
  }
  const step1DescMap = {
    en: 'Community votes for classic games, each wallet needs minimum 0.1 SOL balance to vote',
    zh: '社区投票选择经典游戏，每个钱包需要至少 0.1 SOL 余额才能投票',
    ja: 'コミュニティはクラシックゲームに投票し、各ウォレットは投票に最低0.1 SOL残高が必要です',
    ko: '커뮤니티는 고전 게임에 투표하고 각 월렛은 투표에 최소 0.1 SOL 잔액이 필요합니다.'
  }
  const step2Map = {
    en: 'Step 2: Fundraising',
    zh: '步骤 2: 筹款',
    ja: 'ステップ 2: 資金調達',
    ko: '단계 2: 투자'
  }
  const step2DescMap = {
    en: 'Winning game starts SOL fundraising, creates exclusive meme token after reaching target',
    zh: '获胜游戏启动 SOL 筹款，达到目标后创建专属 meme 代币',
    ja: '勝者のゲームはSOL資金調達を開始し、ターゲットに達した後に専用のメムトークンを作成します',
    ko: '승리한 게임이 SOL 투자를 시작하고 목표에 도달한 후 전용 메멈 토큰을 만듭니다.'
  }
  const step3Map = {
    en: 'Step 3: Development',
    zh: '步骤 3: 开发',
    ja: 'ステップ 3: 開発',
    ko: '단계 3: 개발'
  }
  const step3DescMap = {
    en: 'Community decides whether to develop Play-to-Earn version, token holders participate in governance',
    zh: '社区决定是否开发 Play-to-Earn 版本，代币持有者参与治理',
    ja: 'コミュニティはPlay-to-Earnバージョンを開発するかどうかを決定し、トークンホルダーはガバナンスに参加します',
    ko: '커뮤니티는 Play-to-Earn 버전을 개발할지 결정하고 토큰 보유자는 관리에 참여합니다.'
  }
  const utilityTitleMap = {
    en: '💎 Token Utility',
    zh: '💎 代币实用性',
    ja: '💎 トークンの実用性',
    ko: '💎 토큰의 유용성'
  }
  const securityTitleMap = {
    en: '🔒 Security Guarantee',
    zh: '🔒 安全保障',
    ja: '🔒 セキュリティガンダー',
    ko: '🔒 보안 보장'
  }

  const tokenDataMap = {
    en: [
      {
        label: "Pre-sale",
        percentage: 50,
        amount: "500M",
        color: "#00FF00",
        description: "For project startup funding, sold through IDO or similar methods to raise SOL for game development and operations",
        icon: "🏦"
      },
      {
        label: "Liquidity",
        percentage: 30,
        amount: "300M",
        color: "#00FFFF",
        description: "For DEX liquidity pools, ensuring token circulation and trading activity",
        icon: "💧"
      },
      {
        label: "Voting Airdrop",
        percentage: 10,
        amount: "100M",
        color: "#FFFF00",
        description: "Airdropped to community members through voting activities, rewarding participation in game selection and governance",
        icon: "🎁"
      },
      {
        label: "SOL Ecosystem Airdrop",
        percentage: 7,
        amount: "70M",
        color: "#FF00FF",
        description: "Airdropped to Solana ecosystem users, promoting project ecosystem integration and user growth",
        icon: "🌐"
      },
      {
        label: "Development",
        percentage: 3,
        amount: "30M",
        color: "#FF8000",
        description: "For project development and maintenance, supporting future updates and improvements",
        icon: "👨‍💻"
      }
    ],
    zh: [
      {
        label: "预售",
        percentage: 50,
        amount: "500M",
        color: "#00FF00",
        description: "用于项目启动资金，通过 IDO 或类似方式售卖代币，筹集 SOL 用于游戏开发和运营",
        icon: "🏦"
      },
      {
        label: "流动性",
        percentage: 30,
        amount: "300M",
        color: "#00FFFF",
        description: "用于 DEX 的流动性池，确保代币的流通和交易活跃度",
        icon: "💧"
      },
      {
        label: "投票空投",
        percentage: 10,
        amount: "100M",
        color: "#FFFF00",
        description: "通过投票活动空投给社区成员，奖励参与游戏选择和治理的用户",
        icon: "🎁"
      },
      {
        label: "SOL生态空投",
        percentage: 7,
        amount: "70M",
        color: "#FF00FF",
        description: "空投给 Solana 生态系统内的用户，促进项目的生态整合和用户增长",
        icon: "🌐"
      },
      {
        label: "开发",
        percentage: 3,
        amount: "30M",
        color: "#FF8000",
        description: "用于项目开发和维护，支持未来的更新和改进",
        icon: "👨‍💻"
      }
    ],
    ja: [
      {
        label: "プリセール",
        percentage: 50,
        amount: "500M",
        color: "#00FF00",
        description: "プロジェクト開始資金のため、IDOまたは類似の方法でトークンを販売し、ゲーム開発と運営のためのSOLを調達",
        icon: "🏦"
      },
      {
        label: "流動性",
        percentage: 30,
        amount: "300M",
        color: "#00FFFF",
        description: "DEXの流動性プールのため、トークンの流通と取引活動を確保",
        icon: "💧"
      },
      {
        label: "投票エアドロップ",
        percentage: 10,
        amount: "100M",
        color: "#FFFF00",
        description: "投票活動を通じてコミュニティメンバーにエアドロップ、ゲーム選択とガバナンスへの参加を報酬",
        icon: "🎁"
      },
      {
        label: "SOLエコシステムエアドロップ",
        percentage: 7,
        amount: "70M",
        color: "#FF00FF",
        description: "Solanaエコシステムユーザーにエアドロップ、プロジェクトのエコシステム統合とユーザー成長を促進",
        icon: "🌐"
      },
      {
        label: "開発",
        percentage: 3,
        amount: "30M",
        color: "#FF8000",
        description: "プロジェクト開発とメンテナンスのため、将来のアップデートと改善をサポート",
        icon: "👨‍💻"
      }
    ],
    ko: [
      {
        label: "프리세일",
        percentage: 50,
        amount: "500M",
        color: "#00FF00",
        description: "프로젝트 시작 자금을 위해 IDO 또는 유사한 방법으로 토큰을 판매하여 게임 개발 및 운영을 위한 SOL 조달",
        icon: "🏦"
      },
      {
        label: "유동성",
        percentage: 30,
        amount: "300M",
        color: "#00FFFF",
        description: "DEX 유동성 풀을 위해 토큰 유통 및 거래 활동 보장",
        icon: "💧"
      },
      {
        label: "투표 에어드롭",
        percentage: 10,
        amount: "100M",
        color: "#FFFF00",
        description: "투표 활동을 통해 커뮤니티 구성원에게 에어드롭, 게임 선택 및 거버넌스 참여 보상",
        icon: "🎁"
      },
      {
        label: "SOL 생태계 에어드롭",
        percentage: 7,
        amount: "70M",
        color: "#FF00FF",
        description: "Solana 생태계 사용자에게 에어드롭, 프로젝트 생태계 통합 및 사용자 성장 촉진",
        icon: "🌐"
      },
      {
        label: "개발",
        percentage: 3,
        amount: "30M",
        color: "#FF8000",
        description: "프로젝트 개발 및 유지보수를 위해 향후 업데이트 및 개선 지원",
        icon: "👨‍💻"
      }
    ]
  }

  const utilityListMap = {
    en: [
      "• Participate in project governance voting",
      "• Priority for game token airdrops", 
      "• Play-to-Earn game rewards",
      "• Exclusive NFT and item purchases",
      "• Community event participation eligibility"
    ],
    zh: [
      "• 参与项目治理投票",
      "• 获得游戏代币空投优先权",
      "• Play-to-Earn 游戏内奖励", 
      "• 独家 NFT 和道具购买",
      "• 社区活动参与资格"
    ],
    ja: [
      "• プロジェクトガバナンス投票に参加",
      "• ゲームトークンエアドロップの優先権",
      "• Play-to-Earnゲームリワード",
      "• 専用NFTとアイテム購入",
      "• コミュニティイベント参加資格"
    ],
    ko: [
      "• 프로젝트 관리 투표에 참여",
      "• 게임 토큰 에어드롭 우선권",
      "• Play-to-Earn 게임 보상",
      "• 전용 NFT 및 아이템 구매",
      "• 커뮤니티 행사 참여 자격"
    ]
  }

  const securityListMap = {
    en: [
      "• Development team tokens locked for 2 years",
      "• Liquidity pool permanently locked",
      "• Multi-signature wallet management", 
      "• Third-party security audit",
      "• Transparent community fund oversight"
    ],
    zh: [
      "• 开发团队代币锁仓 2 年",
      "• 流动性池永久锁定",
      "• 多重签名钱包管理",
      "• 第三方安全审计", 
      "• 社区资金透明监管"
    ],
    ja: [
      "• 開発チームトークンを2年間ロック",
      "• 流動性プールを永久にロック",
      "• マルチサインウォレット管理",
      "• 第三者セキュリティ監査",
      "• 透明なコミュニティ資金監督"
    ],
    ko: [
      "• 개발 팀 토큰 2년간 잠금",
      "• 유동성 풀 영구 잠금",
      "• 다중 서명 월렛 관리",
      "• 타사 보안 감사",
      "• 투명한 커뮤니티 자금 감독"
    ]
  }

  const tokenData = tokenDataMap[lang]

  useEffect(() => {
    setIsClient(true)
    // 生成固定的数字雨数据（避免水合错误）
    const rainDrops: DigitalRainDrop[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: (i * 5 + 7) % 100, // 使用固定算法生成位置
      y: -20,
      duration: (i % 3) + 2,
      delay: (i % 10) * 0.2,
      content: (i * 123456789).toString(2).substr(2, 8) // 生成固定的二进制字符串
    }))
    setDigitalRain(rainDrops)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // 计算饼图路径
  const createPieSlice = (startAngle: number, endAngle: number, radius: number = 120) => {
    const x1 = Math.cos((startAngle * Math.PI) / 180) * radius
    const y1 = Math.sin((startAngle * Math.PI) / 180) * radius
    const x2 = Math.cos((endAngle * Math.PI) / 180) * radius
    const y2 = Math.sin((endAngle * Math.PI) / 180) * radius
    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  let currentAngle = 0

  return (
    <section id="tokenomics" className="py-20 relative">
      {/* 数字雨背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {isClient && digitalRain.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute text-retro-green opacity-20 font-mono text-sm"
            style={{ left: `${drop.x}%` }}
            initial={{ y: -20 }}
            animate={{ y: '100vh' }}
            transition={{ 
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay 
            }}
          >
            {drop.content}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 饼图可视化 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="pixel-card p-4 sm:p-8 text-center">
              <h3 className="text-2xl font-retro text-retro-yellow mb-8">
                {chartTitleMap[lang]}
              </h3>
              
              <div className="relative inline-block">
                <svg width="192" height="192" viewBox="-96 -96 192 192" className="w-48 h-48 sm:w-72 sm:h-72 transform rotate-[-90deg]">
                  {tokenData.map((segment, index) => {
                    const segmentAngle = (segment.percentage / 100) * 360
                    const path = createPieSlice(currentAngle, currentAngle + segmentAngle)
                    const previousAngle = currentAngle
                    currentAngle += segmentAngle

                    return (
                      <motion.path
                        key={index}
                        d={path}
                        fill={segment.color}
                        stroke="#000"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: animationProgress / 100 }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="cursor-pointer hover:brightness-110 transition-all"
                        onMouseEnter={() => setSelectedSegment(index)}
                        onMouseLeave={() => setSelectedSegment(null)}
                        style={{
                          filter: selectedSegment === index ? 'brightness(1.3) drop-shadow(0 0 10px currentColor)' : 'none'
                        }}
                      />
                    )
                  })}
                  
                  {/* 中心圆 */}
                  <circle r="40" fill="#000" stroke="#00FF00" strokeWidth="3" />
                  <text 
                    textAnchor="middle" 
                    dy="0" 
                    fill="#00FF00" 
                    fontSize="14" 
                    fontFamily="monospace"
                    className="rotate-90"
                  >
                    {tokensMap[lang]}
                  </text>
                  <text 
                    textAnchor="middle" 
                    dy="15" 
                    fill="#00FF00" 
                    fontSize="14" 
                    fontFamily="monospace"
                    className="rotate-90"
                  >
                    PUMP
                  </text>
                </svg>

                {/* 图例 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6">
                  <div className="text-center">
                    <div className="text-lg font-retro text-retro-green">
                      {totalSupplyMap[lang]}
                    </div>
                    <div className="text-3xl font-bold game-score text-retro-yellow">1,000,000,000</div>
                    <div className="text-sm text-gray-400 font-pixel">
                      {tokensMap[lang]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 详细分配信息 */}
          <div className="space-y-4">
            {tokenData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`pixel-card p-6 transition-all duration-300 cursor-pointer ${
                  selectedSegment === index ? 'border-retro-yellow scale-105' : ''
                }`}
                onMouseEnter={() => setSelectedSegment(index)}
                onMouseLeave={() => setSelectedSegment(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-retro" style={{ color: item.color }}>
                          {item.label}
                        </h4>
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-1 max-w-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold game-score" style={{ color: item.color }}>
                      {item.percentage}%
                    </div>
                    <div className="text-lg text-gray-300 font-pixel">
                      {item.amount}
                    </div>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 代币发射机制 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="pixel-card p-8">
            <h3 className="text-3xl font-retro text-retro-green text-center mb-8">
              {launchTitleMap[lang]}
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🗳️</div>
                <h4 className="text-xl font-retro text-retro-cyan mb-3">{step1Map[lang]}</h4>
                <p className="text-gray-400 font-pixel text-sm">
                  {step1DescMap[lang]}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h4 className="text-xl font-retro text-retro-yellow mb-3">{step2Map[lang]}</h4>
                <p className="text-gray-400 font-pixel text-sm">
                  {step2DescMap[lang]}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🎮</div>
                <h4 className="text-xl font-retro text-retro-magenta mb-3">{step3Map[lang]}</h4>
                <p className="text-gray-400 font-pixel text-sm">
                  {step3DescMap[lang]}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 代币实用性 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 grid md:grid-cols-2 gap-8"
        >
          <div className="pixel-card p-6">
            <h4 className="text-xl font-retro text-retro-green mb-4">{utilityTitleMap[lang]}</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-pixel">
              {utilityListMap[lang].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="pixel-card p-6">
            <h4 className="text-xl font-retro text-retro-cyan mb-4">{securityTitleMap[lang]}</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-pixel">
              {securityListMap[lang].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 