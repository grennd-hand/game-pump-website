'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface User {
  id: number
  username: string
  avatar: string
  score: number
  level: number
  rank: number
  votes: number
  joinDate: string
  badges: string[]
  winRate: number
  totalGames: number
}

interface Trophy {
  id: number
  x: number
  y: number
  rotation: number
  duration: number
}

interface EnhancedLeaderboardSectionProps {
  lang: 'en' | 'zh' | 'ja' | 'ko'
}

export default function EnhancedLeaderboardSection({ lang }: EnhancedLeaderboardSectionProps) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [currentTab, setCurrentTab] = useState('weekly')
  const [trophies, setTrophies] = useState<Trophy[]>([])
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('rank')

  const titleMap = {
    en: '🏆 Enhanced Leaderboard',
    zh: '🏆 增强版积分排行榜',
    ja: '🏆 拡張リーダーボード',
    ko: '🏆 향상된 리더보드'
  }
  
  const descMap = {
    en: 'Comprehensive ranking system with detailed player statistics and achievements',
    zh: '包含详细玩家统计和成就的综合排名系统',
    ja: '詳細なプレイヤー統計と実績を含む包括的なランキングシステム',
    ko: '상세한 플레이어 통계와 업적을 포함한 종합 순위 시스템'
  }

  const tabsMap = {
    en: [
      { id: 'weekly', label: '📅 Weekly', icon: '📅' },
      { id: 'monthly', label: '📊 Monthly', icon: '📊' },
      { id: 'alltime', label: '🌟 All Time', icon: '🌟' },
      { id: 'achievements', label: '🏅 Achievements', icon: '🏅' }
    ],
    zh: [
      { id: 'weekly', label: '📅 本周', icon: '📅' },
      { id: 'monthly', label: '📊 本月', icon: '📊' },
      { id: 'alltime', label: '🌟 全部', icon: '🌟' },
      { id: 'achievements', label: '🏅 成就', icon: '🏅' }
    ],
    ja: [
      { id: 'weekly', label: '📅 週間', icon: '📅' },
      { id: 'monthly', label: '📊 月間', icon: '📊' },
      { id: 'alltime', label: '🌟 全期間', icon: '🌟' },
      { id: 'achievements', label: '🏅 実績', icon: '🏅' }
    ],
    ko: [
      { id: 'weekly', label: '📅 주간', icon: '📅' },
      { id: 'monthly', label: '📊 월간', icon: '📊' },
      { id: 'alltime', label: '🌟 전체 기간', icon: '🌟' },
      { id: 'achievements', label: '🏅 업적', icon: '🏅' }
    ]
  }

  const searchPlaceholderMap = {
    en: 'Search players...',
    zh: '搜索玩家...',
    ja: 'プレイヤーを検索...',
    ko: '플레이어 검색...'
  }

  const sortOptionsMap = {
    en: [
      { value: 'rank', label: 'Rank' },
      { value: 'score', label: 'Score' },
      { value: 'votes', label: 'Votes' },
      { value: 'winRate', label: 'Win Rate' },
      { value: 'level', label: 'Level' }
    ],
    zh: [
      { value: 'rank', label: '排名' },
      { value: 'score', label: '积分' },
      { value: 'votes', label: '投票数' },
      { value: 'winRate', label: '胜率' },
      { value: 'level', label: '等级' }
    ],
    ja: [
      { value: 'rank', label: 'ランク' },
      { value: 'score', label: 'スコア' },
      { value: 'votes', label: '投票数' },
      { value: 'winRate', label: '勝率' },
      { value: 'level', label: 'レベル' }
    ],
    ko: [
      { value: 'rank', label: '순위' },
      { value: 'score', label: '점수' },
      { value: 'votes', label: '투표수' },
      { value: 'winRate', label: '승률' },
      { value: 'level', label: '레벨' }
    ]
  }

  const levelMap = {
    en: {
      1: 'Newbie',
      2: 'Player', 
      3: 'Gamer',
      4: 'Pro',
      5: 'Legend'
    },
    zh: {
      1: '新手',
      2: '玩家',
      3: '游戏者', 
      4: '专业玩家',
      5: '传奇'
    },
    ja: {
      1: '初心者',
      2: 'プレイヤー',
      3: 'ゲーマー',
      4: 'プロ',
      5: '伝説'
    },
    ko: {
      1: '초보자',
      2: '플레이어',
      3: '게이머',
      4: '전문가',
      5: '전설'
    }
  }

  const statsLabelsMap = {
    en: {
      votes: 'Votes',
      joined: 'Joined',
      level: 'Level',
      winRate: 'Win Rate',
      totalGames: 'Total Games',
      badges: 'Badges'
    },
    zh: {
      votes: '投票数',
      joined: '加入时间',
      level: '等级',
      winRate: '胜率',
      totalGames: '总游戏数',
      badges: '徽章'
    },
    ja: {
      votes: '投票数',
      joined: '参加',
      level: 'レベル',
      winRate: '勝率',
      totalGames: '総ゲーム数',
      badges: 'バッジ'
    },
    ko: {
      votes: '투표수',
      joined: '가입',
      level: '레벨',
      winRate: '승률',
      totalGames: '총 게임수',
      badges: '배지'
    }
  }

  // 增强的用户数据
  const usersDataMap = {
    en: [
      {
        id: 1,
        username: "GameMaster42",
        avatar: "🎮",
        score: 15420,
        level: 5,
        rank: 1,
        votes: 147,
        joinDate: "2024-01",
        badges: ["🥇", "🔥", "⭐"],
        winRate: 87.5,
        totalGames: 234
      },
      {
        id: 2,
        username: "RetroLover88",
        avatar: "👾",
        score: 12850,
        level: 4,
        rank: 2,
        votes: 128,
        joinDate: "2024-01",
        badges: ["🥈", "💎"],
        winRate: 82.3,
        totalGames: 198
      },
      {
        id: 3,
        username: "PixelHunter",
        avatar: "🕹️",
        score: 11230,
        level: 4,
        rank: 3,
        votes: 112,
        joinDate: "2024-02",
        badges: ["🥉", "🎯"],
        winRate: 79.1,
        totalGames: 167
      },
      {
        id: 4,
        username: "ArcadeKing",
        avatar: "🏆",
        score: 9876,
        level: 3,
        rank: 4,
        votes: 98,
        joinDate: "2024-02",
        badges: ["🎪"],
        winRate: 75.6,
        totalGames: 145
      },
      {
        id: 5,
        username: "ChiptuneHero",
        avatar: "🎵",
        score: 8945,
        level: 3,
        rank: 5,
        votes: 89,
        joinDate: "2024-03",
        badges: ["🎼", "🔊"],
        winRate: 73.2,
        totalGames: 123
      },
      {
        id: 6,
        username: "NeonNinja",
        avatar: "⚡",
        score: 7654,
        level: 3,
        rank: 6,
        votes: 76,
        joinDate: "2024-03",
        badges: ["⚡"],
        winRate: 71.8,
        totalGames: 112
      },
      {
        id: 7,
        username: "ByteBuster",
        avatar: "💾",
        score: 6789,
        level: 2,
        rank: 7,
        votes: 67,
        joinDate: "2024-04",
        badges: ["💾"],
        winRate: 68.9,
        totalGames: 98
      },
      {
        id: 8,
        username: "CodeCrusher",
        avatar: "⌨️",
        score: 5432,
        level: 2,
        rank: 8,
        votes: 54,
        joinDate: "2024-04",
        badges: ["⌨️"],
        winRate: 65.4,
        totalGames: 87
      }
    ],
    zh: [
      {
        id: 1,
        username: "游戏大师42",
        avatar: "🎮",
        score: 15420,
        level: 5,
        rank: 1,
        votes: 147,
        joinDate: "2024-01",
        badges: ["🥇", "🔥", "⭐"],
        winRate: 87.5,
        totalGames: 234
      },
      {
        id: 2,
        username: "复古爱好者88",
        avatar: "👾",
        score: 12850,
        level: 4,
        rank: 2,
        votes: 128,
        joinDate: "2024-01",
        badges: ["🥈", "💎"],
        winRate: 82.3,
        totalGames: 198
      },
      {
        id: 3,
        username: "像素猎人",
        avatar: "🕹️",
        score: 11230,
        level: 4,
        rank: 3,
        votes: 112,
        joinDate: "2024-02",
        badges: ["🥉", "🎯"],
        winRate: 79.1,
        totalGames: 167
      },
      {
        id: 4,
        username: "街机之王",
        avatar: "🏆",
        score: 9876,
        level: 3,
        rank: 4,
        votes: 98,
        joinDate: "2024-02",
        badges: ["🎪"],
        winRate: 75.6,
        totalGames: 145
      },
      {
        id: 5,
        username: "芯片音乐英雄",
        avatar: "🎵",
        score: 8945,
        level: 3,
        rank: 5,
        votes: 89,
        joinDate: "2024-03",
        badges: ["🎼", "🔊"],
        winRate: 73.2,
        totalGames: 123
      },
      {
        id: 6,
        username: "霓虹忍者",
        avatar: "⚡",
        score: 7654,
        level: 3,
        rank: 6,
        votes: 76,
        joinDate: "2024-03",
        badges: ["⚡"],
        winRate: 71.8,
        totalGames: 112
      },
      {
        id: 7,
        username: "字节破坏者",
        avatar: "💾",
        score: 6789,
        level: 2,
        rank: 7,
        votes: 67,
        joinDate: "2024-04",
        badges: ["💾"],
        winRate: 68.9,
        totalGames: 98
      },
      {
        id: 8,
        username: "代码粉碎机",
        avatar: "⌨️",
        score: 5432,
        level: 2,
        rank: 8,
        votes: 54,
        joinDate: "2024-04",
        badges: ["⌨️"],
        winRate: 65.4,
        totalGames: 87
      }
    ],
    ja: [
      {
        id: 1,
        username: "ゲームマスター42",
        avatar: "🎮",
        score: 15420,
        level: 5,
        rank: 1,
        votes: 147,
        joinDate: "2024-01",
        badges: ["🥇", "🔥", "⭐"],
        winRate: 87.5,
        totalGames: 234
      },
      {
        id: 2,
        username: "レトロ愛好者88",
        avatar: "👾",
        score: 12850,
        level: 4,
        rank: 2,
        votes: 128,
        joinDate: "2024-01",
        badges: ["🥈", "💎"],
        winRate: 82.3,
        totalGames: 198
      },
      {
        id: 3,
        username: "ピクセルハンター",
        avatar: "🕹️",
        score: 11230,
        level: 4,
        rank: 3,
        votes: 112,
        joinDate: "2024-02",
        badges: ["🥉", "🎯"],
        winRate: 79.1,
        totalGames: 167
      },
      {
        id: 4,
        username: "アーケードキング",
        avatar: "🏆",
        score: 9876,
        level: 3,
        rank: 4,
        votes: 98,
        joinDate: "2024-02",
        badges: ["🎪"],
        winRate: 75.6,
        totalGames: 145
      },
      {
        id: 5,
        username: "チップチューンヒーロー",
        avatar: "🎵",
        score: 8945,
        level: 3,
        rank: 5,
        votes: 89,
        joinDate: "2024-03",
        badges: ["🎼", "🔊"],
        winRate: 73.2,
        totalGames: 123
      },
      {
        id: 6,
        username: "ネオンニンジャ",
        avatar: "⚡",
        score: 7654,
        level: 3,
        rank: 6,
        votes: 76,
        joinDate: "2024-03",
        badges: ["⚡"],
        winRate: 71.8,
        totalGames: 112
      },
      {
        id: 7,
        username: "バイトバスター",
        avatar: "💾",
        score: 6789,
        level: 2,
        rank: 7,
        votes: 67,
        joinDate: "2024-04",
        badges: ["💾"],
        winRate: 68.9,
        totalGames: 98
      },
      {
        id: 8,
        username: "コードクラッシャー",
        avatar: "⌨️",
        score: 5432,
        level: 2,
        rank: 8,
        votes: 54,
        joinDate: "2024-04",
        badges: ["⌨️"],
        winRate: 65.4,
        totalGames: 87
      }
    ],
    ko: [
      {
        id: 1,
        username: "게임마스터42",
        avatar: "🎮",
        score: 15420,
        level: 5,
        rank: 1,
        votes: 147,
        joinDate: "2024-01",
        badges: ["🥇", "🔥", "⭐"],
        winRate: 87.5,
        totalGames: 234
      },
      {
        id: 2,
        username: "레트로애호가88",
        avatar: "👾",
        score: 12850,
        level: 4,
        rank: 2,
        votes: 128,
        joinDate: "2024-01",
        badges: ["🥈", "💎"],
        winRate: 82.3,
        totalGames: 198
      },
      {
        id: 3,
        username: "픽셀헌터",
        avatar: "🕹️",
        score: 11230,
        level: 4,
        rank: 3,
        votes: 112,
        joinDate: "2024-02",
        badges: ["🥉", "🎯"],
        winRate: 79.1,
        totalGames: 167
      },
      {
        id: 4,
        username: "아케이드킹",
        avatar: "🏆",
        score: 9876,
        level: 3,
        rank: 4,
        votes: 98,
        joinDate: "2024-02",
        badges: ["🎪"],
        winRate: 75.6,
        totalGames: 145
      },
      {
        id: 5,
        username: "칩튠히어로",
        avatar: "🎵",
        score: 8945,
        level: 3,
        rank: 5,
        votes: 89,
        joinDate: "2024-03",
        badges: ["🎼", "🔊"],
        winRate: 73.2,
        totalGames: 123
      },
      {
        id: 6,
        username: "네온닌자",
        avatar: "⚡",
        score: 7654,
        level: 3,
        rank: 6,
        votes: 76,
        joinDate: "2024-03",
        badges: ["⚡"],
        winRate: 71.8,
        totalGames: 112
      },
      {
        id: 7,
        username: "바이트버스터",
        avatar: "💾",
        score: 6789,
        level: 2,
        rank: 7,
        votes: 67,
        joinDate: "2024-04",
        badges: ["💾"],
        winRate: 68.9,
        totalGames: 98
      },
      {
        id: 8,
        username: "코드크러셔",
        avatar: "⌨️",
        score: 5432,
        level: 2,
        rank: 8,
        votes: 54,
        joinDate: "2024-04",
        badges: ["⌨️"],
        winRate: 65.4,
        totalGames: 87
      }
    ]
  }

  const users = usersDataMap[lang]

  // 过滤和排序用户
  const filteredAndSortedUsers = users
    .filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score
        case 'votes':
          return b.votes - a.votes
        case 'winRate':
          return b.winRate - a.winRate
        case 'level':
          return b.level - a.level
        default:
          return a.rank - b.rank
      }
    })

  useEffect(() => {
    setIsClient(true)
    // 生成固定的奖杯动画数据（避免水合错误）
    const trophyData: Trophy[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: (i * 19 + 13) % 100, // 使用固定算法生成位置
      y: (i * 31 + 23) % 100,
      rotation: (i * 36) % 360,
      duration: (i % 4) + 3
    }))
    setTrophies(trophyData)
  }, [])

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400'
      case 2:
        return 'text-gray-300'
      case 3:
        return 'text-orange-400'
      default:
        return 'text-retro-cyan'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'text-gray-400'
      case 2:
        return 'text-green-400'
      case 3:
        return 'text-blue-400'
      case 4:
        return 'text-purple-400'
      case 5:
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <section className="py-20 relative">
      {/* 奖杯背景动画 */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        {isClient && trophies.map((trophy) => (
          <motion.div
            key={trophy.id}
            className="absolute text-4xl"
            style={{ 
              left: `${trophy.x}%`,
              top: `${trophy.y}%`
            }}
            initial={{ 
              rotate: 0,
              scale: 0.5
            }}
            animate={{ 
              rotate: trophy.rotation,
              scale: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: trophy.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🏆
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* 搜索和排序控件 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8 mt-8"
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder={searchPlaceholderMap[lang]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-gray-600 focus:border-retro-green rounded font-pixel text-white"
            />
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-black border-2 border-gray-600 focus:border-retro-green rounded font-pixel text-white"
            >
              {sortOptionsMap[lang].map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* 标签导航 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="flex flex-wrap justify-center space-x-1 bg-black/50 p-1 rounded-lg border border-retro-green/30">
            {tabsMap[lang].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2 rounded font-pixel text-sm transition-all ${
                  currentTab === tab.id
                    ? 'bg-retro-green text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 排行榜内容 */}
        <div className="space-y-4">
          {filteredAndSortedUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`pixel-card p-6 transition-all duration-300 cursor-pointer ${
                selectedUser === user.id ? 'border-retro-yellow scale-[1.02]' : ''
              }`}
              onMouseEnter={() => setSelectedUser(user.id)}
              onMouseLeave={() => setSelectedUser(null)}
            >
              <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
                {/* 排名和头像 */}
                <div className="flex items-center space-x-4">
                  <div className={`text-3xl font-bold game-score ${getRankColor(user.rank)}`}>
                    {getRankIcon(user.rank)}
                  </div>
                  <div className="text-4xl animate-float">{user.avatar}</div>
                </div>

                {/* 用户信息 */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl font-retro text-white mb-2">
                    {user.username}
                  </h3>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-2">
                    {user.badges.map((badge, badgeIndex) => (
                      <span key={badgeIndex} className="text-lg">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className={`text-lg font-pixel ${getLevelColor(user.level)}`}>
                    {statsLabelsMap[lang].level}: {levelMap[lang][user.level as keyof typeof levelMap[typeof lang]]}
                  </div>
                </div>

                {/* 详细统计 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-retro-green game-score">
                      {user.score.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400 font-pixel">Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-retro-cyan game-score">
                      {user.votes}
                    </div>
                    <div className="text-xs text-gray-400 font-pixel">{statsLabelsMap[lang].votes}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-retro-yellow game-score">
                      {user.winRate}%
                    </div>
                    <div className="text-xs text-gray-400 font-pixel">{statsLabelsMap[lang].winRate}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-retro-magenta game-score">
                      {user.totalGames}
                    </div>
                    <div className="text-xs text-gray-400 font-pixel">{statsLabelsMap[lang].totalGames}</div>
                  </div>
                </div>

                {/* 加入时间 */}
                <div className="text-sm text-gray-500 font-pixel">
                  {statsLabelsMap[lang].joined}: {user.joinDate}
                </div>
              </div>

              {/* 进度条 */}
              <div className="mt-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(user.score / 200, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.05 }}
                    className="h-full bg-gradient-to-r from-retro-green to-retro-cyan"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 