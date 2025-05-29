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
}

interface Trophy {
  id: number
  x: number
  y: number
  rotation: number
  duration: number
}

interface LeaderboardSectionProps {
  lang: 'en' | 'zh' | 'ja' | 'ko'
}

export default function LeaderboardSection({ lang }: LeaderboardSectionProps) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [currentTab, setCurrentTab] = useState('weekly')
  const [trophies, setTrophies] = useState<Trophy[]>([])
  const [isClient, setIsClient] = useState(false)
  const [userWinRate, setUserWinRate] = useState(0)
  const [userPosition, setUserPosition] = useState(0)

  const titleMap = {
    en: '🏆 Leaderboard',
    zh: '🏆 积分排行榜',
    ja: '🏆 リーダーボード',
    ko: '🏆 리더보드'
  }
  
  const descMap = {
    en: 'Top players who are actively voting and contributing to the community',
    zh: '积极投票并为社区做出贡献的顶级玩家',
    ja: 'コミュニティに貢献しているトッププレイヤー',
    ko: '커뮤니티에 기여하는 최상위 플레이어'
  }

  const tabsMap = {
    en: [
      { id: 'weekly', label: '📅 Weekly', icon: '📅' },
      { id: 'monthly', label: '📊 Monthly', icon: '📊' },
      { id: 'alltime', label: '🌟 All Time', icon: '🌟' }
    ],
    zh: [
      { id: 'weekly', label: '📅 本周', icon: '📅' },
      { id: 'monthly', label: '📊 本月', icon: '📊' },
      { id: 'alltime', label: '🌟 全部', icon: '🌟' }
    ],
    ja: [
      { id: 'weekly', label: '📅 週間', icon: '📅' },
      { id: 'monthly', label: '📊 月間', icon: '📊' },
      { id: 'alltime', label: '🌟 全期間', icon: '🌟' }
    ],
    ko: [
      { id: 'weekly', label: '📅 주간', icon: '📅' },
      { id: 'monthly', label: '📊 월간', icon: '📊' },
      { id: 'alltime', label: '🌟 전체 기간', icon: '🌟' }
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
      level: 'Level'
    },
    zh: {
      votes: '投票数',
      joined: '加入时间',
      level: '等级'
    },
    ja: {
      votes: '投票数',
      joined: '参加',
      level: 'レベル'
    },
    ko: {
      votes: '투표수',
      joined: '가입',
      level: '레벨'
    }
  }

  // 模拟用户数据
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
        joinDate: "2024-01"
      },
      {
        id: 2,
        username: "RetroLover88",
        avatar: "👾",
        score: 12850,
        level: 4,
        rank: 2,
        votes: 128,
        joinDate: "2024-01"
      },
      {
        id: 3,
        username: "PixelHunter",
        avatar: "🕹️",
        score: 11230,
        level: 4,
        rank: 3,
        votes: 112,
        joinDate: "2024-02"
      },
      {
        id: 4,
        username: "ArcadeKing",
        avatar: "🏆",
        score: 9876,
        level: 3,
        rank: 4,
        votes: 98,
        joinDate: "2024-02"
      },
      {
        id: 5,
        username: "ChiptuneHero",
        avatar: "🎵",
        score: 8945,
        level: 3,
        rank: 5,
        votes: 89,
        joinDate: "2024-03"
      },
      {
        id: 6,
        username: "NeonNinja",
        avatar: "⚡",
        score: 7654,
        level: 3,
        rank: 6,
        votes: 76,
        joinDate: "2024-03"
      },
      {
        id: 7,
        username: "ByteBuster",
        avatar: "💾",
        score: 6789,
        level: 2,
        rank: 7,
        votes: 67,
        joinDate: "2024-04"
      },
      {
        id: 8,
        username: "CyberPunk77",
        avatar: "🤖",
        score: 5432,
        level: 2,
        rank: 8,
        votes: 54,
        joinDate: "2024-04"
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
        joinDate: "2024-01"
      },
      {
        id: 2,
        username: "怀旧爱好者88",
        avatar: "👾",
        score: 12850,
        level: 4,
        rank: 2,
        votes: 128,
        joinDate: "2024-01"
      },
      {
        id: 3,
        username: "像素猎人",
        avatar: "🕹️",
        score: 11230,
        level: 4,
        rank: 3,
        votes: 112,
        joinDate: "2024-02"
      },
      {
        id: 4,
        username: "街机之王",
        avatar: "🏆",
        score: 9876,
        level: 3,
        rank: 4,
        votes: 98,
        joinDate: "2024-02"
      },
      {
        id: 5,
        username: "芯片音乐英雄",
        avatar: "🎵",
        score: 8945,
        level: 3,
        rank: 5,
        votes: 89,
        joinDate: "2024-03"
      },
      {
        id: 6,
        username: "霓虹忍者",
        avatar: "⚡",
        score: 7654,
        level: 3,
        rank: 6,
        votes: 76,
        joinDate: "2024-03"
      },
      {
        id: 7,
        username: "字节破坏者",
        avatar: "💾",
        score: 6789,
        level: 2,
        rank: 7,
        votes: 67,
        joinDate: "2024-04"
      },
      {
        id: 8,
        username: "赛博朋克77",
        avatar: "🤖",
        score: 5432,
        level: 2,
        rank: 8,
        votes: 54,
        joinDate: "2024-04"
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
        joinDate: "2024-01"
      },
      {
        id: 2,
        username: "レトロラバー88",
        avatar: "👾",
        score: 12850,
        level: 4,
        rank: 2,
        votes: 128,
        joinDate: "2024-01"
      },
      {
        id: 3,
        username: "ピクセルハンター",
        avatar: "🕹️",
        score: 11230,
        level: 4,
        rank: 3,
        votes: 112,
        joinDate: "2024-02"
      },
      {
        id: 4,
        username: "アーケードキング",
        avatar: "🏆",
        score: 9876,
        level: 3,
        rank: 4,
        votes: 98,
        joinDate: "2024-02"
      },
      {
        id: 5,
        username: "チップチューンヒーロー",
        avatar: "🎵",
        score: 8945,
        level: 3,
        rank: 5,
        votes: 89,
        joinDate: "2024-03"
      },
      {
        id: 6,
        username: "ネオンニンジャ",
        avatar: "⚡",
        score: 7654,
        level: 3,
        rank: 6,
        votes: 76,
        joinDate: "2024-03"
      },
      {
        id: 7,
        username: "バイトバスター",
        avatar: "💾",
        score: 6789,
        level: 2,
        rank: 7,
        votes: 67,
        joinDate: "2024-04"
      },
      {
        id: 8,
        username: "サイバーパンク77",
        avatar: "🤖",
        score: 5432,
        level: 2,
        rank: 8,
        votes: 54,
        joinDate: "2024-04"
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
        joinDate: "2024-01"
      },
      {
        id: 2,
        username: "레트로러버88",
        avatar: "👾",
        score: 12850,
        level: 4,
        rank: 2,
        votes: 128,
        joinDate: "2024-01"
      },
      {
        id: 3,
        username: "픽셀헌터",
        avatar: "🕹️",
        score: 11230,
        level: 4,
        rank: 3,
        votes: 112,
        joinDate: "2024-02"
      },
      {
        id: 4,
        username: "아케이드킹",
        avatar: "🏆",
        score: 9876,
        level: 3,
        rank: 4,
        votes: 98,
        joinDate: "2024-02"
      },
      {
        id: 5,
        username: "칩튠히어로",
        avatar: "🎵",
        score: 8945,
        level: 3,
        rank: 5,
        votes: 89,
        joinDate: "2024-03"
      },
      {
        id: 6,
        username: "네온닌자",
        avatar: "⚡",
        score: 7654,
        level: 3,
        rank: 6,
        votes: 76,
        joinDate: "2024-03"
      },
      {
        id: 7,
        username: "바이트버스터",
        avatar: "💾",
        score: 6789,
        level: 2,
        rank: 7,
        votes: 67,
        joinDate: "2024-04"
      },
      {
        id: 8,
        username: "사이버펑크77",
        avatar: "🤖",
        score: 5432,
        level: 2,
        rank: 8,
        votes: 54,
        joinDate: "2024-04"
      }
    ]
  }

  const users = usersDataMap[lang]

  useEffect(() => {
    setIsClient(true)
    // 生成固定的奖杯效果（避免水合错误）
    const trophyData: Trophy[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: (i * 23 + 17) % 100, // 使用固定算法生成位置
      y: (i * 37 + 29) % 100,
      rotation: (i * 45) % 360,
      duration: (i % 3) + 3
    }))
    setTrophies(trophyData)
    
    // 设置固定的用户数据（避免水合错误）
    setUserWinRate(25)
    setUserPosition(156)
  }, [])

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400'
      case 2:
        return 'text-gray-300'
      case 3:
        return 'text-amber-600'
      default:
        return 'text-retro-green'
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
        return '🏅'
    }
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'text-gray-400'
      case 2:
        return 'text-blue-400'
      case 3:
        return 'text-purple-400'
      case 4:
        return 'text-orange-400'
      case 5:
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <section id="leaderboard" className="py-20 relative">
      {/* 飘动奖杯背景 */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {isClient && trophies.map((trophy) => (
          <motion.div
            key={trophy.id}
            className="absolute text-2xl"
            style={{
              left: `${trophy.x}%`,
              top: `${trophy.y}%`
            }}
            initial={{ 
              rotate: trophy.rotation,
              scale: 0.5 
            }}
            animate={{ 
              rotate: trophy.rotation + 360,
              y: [-20, 20, -20],
              scale: [0.5, 0.8, 0.5]
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

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-retro text-retro-yellow mb-6 animate-glow">
            {titleMap[lang]}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {descMap[lang]}
          </p>
        </motion.div>

        {/* 时间范围标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex space-x-1 bg-black/50 p-1 rounded-lg border border-retro-yellow/30">
            {tabsMap[lang].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-6 py-3 rounded font-pixel text-sm transition-all ${
                  currentTab === tab.id
                    ? 'bg-retro-yellow text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 排行榜列表 */}
        <div className="space-y-4">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`pixel-card p-6 transition-all duration-300 cursor-pointer ${
                selectedUser === user.id ? 'border-retro-yellow scale-[1.02]' : ''
              } ${user.rank <= 3 ? 'border-t-4 border-t-yellow-400' : ''}`}
              onMouseEnter={() => setSelectedUser(user.id)}
              onMouseLeave={() => setSelectedUser(null)}
            >
              <div className="flex items-center justify-between">
                {/* 排名和用户信息 */}
                <div className="flex items-center space-x-6">
                  {/* 排名 */}
                  <div className="text-center min-w-[60px]">
                    <div className="text-3xl mb-1">{getRankIcon(user.rank)}</div>
                    <div className={`text-2xl font-bold game-score ${getRankColor(user.rank)}`}>
                      #{user.rank}
                    </div>
                  </div>

                  {/* 头像和用户名 */}
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="text-4xl p-2 bg-gradient-to-br from-retro-green/20 to-retro-cyan/20 rounded-lg border border-retro-green/30"
                    >
                      {user.avatar}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-retro text-white">
                        {user.username}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm font-pixel">
                        <span className={`${getLevelColor(user.level)}`}>
                          {statsLabelsMap[lang].level} {user.level} - {levelMap[lang][user.level as keyof typeof levelMap.en]}
                        </span>
                        <span className="text-retro-cyan">
                          {statsLabelsMap[lang].votes}: {user.votes}
                        </span>
                        <span className="text-gray-400">
                          {statsLabelsMap[lang].joined}: {user.joinDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 积分 */}
                <div className="text-right">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-3xl font-bold game-score text-retro-yellow"
                  >
                    {user.score.toLocaleString()}
                  </motion.div>
                  <div className="text-sm text-gray-400 font-pixel">
                    {lang === 'en' ? 'Points' : '积分'}
                  </div>
                  
                  {/* 等级进度条 */}
                  <div className="mt-2 w-24">
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(user.level / 5) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full ${
                          user.level >= 5 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                          user.level >= 4 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                          user.level >= 3 ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                          user.level >= 2 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                          'bg-gradient-to-r from-gray-400 to-gray-600'
                        } animate-glow`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 用户详细信息（悬停时显示） */}
              {selectedUser === user.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-retro-green/30"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="pixel-card p-3">
                      <div className="text-lg font-bold text-retro-green game-score">
                        +{Math.floor(user.score * 0.1)}
                      </div>
                      <div className="text-xs text-gray-400 font-pixel">
                        {lang === 'en' ? 'This Week' : '本周'}
                      </div>
                    </div>
                    <div className="pixel-card p-3">
                      <div className="text-lg font-bold text-retro-cyan game-score">
                        {user.votes}
                      </div>
                      <div className="text-xs text-gray-400 font-pixel">
                        {lang === 'en' ? 'Total Votes' : '总投票'}
                      </div>
                    </div>
                    <div className="pixel-card p-3">
                      <div className="text-lg font-bold text-retro-yellow game-score">
                        {Math.floor(user.score / 100)}
                      </div>
                      <div className="text-xs text-gray-400 font-pixel">
                        {lang === 'en' ? 'Achievements' : '成就'}
                      </div>
                    </div>
                    <div className="pixel-card p-3">
                      <div className="text-lg font-bold text-retro-magenta game-score">
                        {isClient ? userWinRate : '0'}
                      </div>
                      <div className="text-xs text-gray-400 font-pixel">
                        {lang === 'en' ? 'Win Rate %' : '胜率 %'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 当前用户位置 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="pixel-card p-6 max-w-md mx-auto border-retro-cyan">
            <h3 className="text-lg font-retro text-retro-cyan mb-4">
              {lang === 'en' ? '🎯 Your Position' : '🎯 你的位置'}
            </h3>
            <div className="text-2xl font-bold game-score text-retro-yellow mb-2">
              #{isClient ? userPosition : '0'}
            </div>
            <div className="text-sm text-gray-400 font-pixel">
              {lang === 'en' ? 'Keep voting to climb the leaderboard!' : '继续投票以提升排名！'}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 