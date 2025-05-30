'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface User {
  id: number
  username: string
  avatar: string
  score: number
  level: number
  rank: number
  votes: number
  joinDate: string
  weeklyGain?: number
  achievements?: number
  winRate?: number
}

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${positionClasses[position]}`}
          >
            <div className="bg-black/90 text-white text-sm px-3 py-2 rounded-lg border border-retro-green/50 backdrop-blur-sm shadow-lg max-w-xs">
              <div className="font-pixel">{content}</div>
              {/* 箭头 */}
              <div className={`absolute w-2 h-2 bg-black/90 border-retro-green/50 transform rotate-45 ${
                position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b' :
                position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l border-t' :
                position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r' :
                'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l'
              }`}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SimpleLeaderboard() {
  const { lang } = useLanguage()
  const [currentTab, setCurrentTab] = useState('weekly')

  const tabsMap = {
    en: [
      { id: 'weekly', label: '📅 Weekly' },
      { id: 'monthly', label: '📊 Monthly' },
      { id: 'alltime', label: '🌟 All Time' }
    ],
    zh: [
      { id: 'weekly', label: '📅 本周' },
      { id: 'monthly', label: '📊 本月' },
      { id: 'alltime', label: '🌟 全部' }
    ],
    ja: [
      { id: 'weekly', label: '📅 週間' },
      { id: 'monthly', label: '📊 月間' },
      { id: 'alltime', label: '🌟 全期間' }
    ],
    ko: [
      { id: 'weekly', label: '📅 주간' },
      { id: 'monthly', label: '📊 월간' },
      { id: 'alltime', label: '🌟 전체 기간' }
    ]
  }

  const statsLabelsMap = {
    en: {
      votes: 'Votes',
      joined: 'Joined',
      level: 'Level',
      points: 'Points',
      legendary: 'Legendary',
      professional: 'Professional Player',
      gamer: 'Gamer',
      player: 'Player',
      weeklyGain: 'Weekly',
      totalVotes: 'Total Votes',
      achievements: 'Achievements',
      winRate: 'Win Rate'
    },
    zh: {
      votes: '投票数',
      joined: '加入时间',
      level: '等级',
      points: '积分',
      legendary: '传奇',
      professional: '专业玩家',
      gamer: '游戏者',
      player: '玩家',
      weeklyGain: '本周',
      totalVotes: '总投票',
      achievements: '成就',
      winRate: '胜率'
    },
    ja: {
      votes: '投票数',
      joined: '参加',
      level: 'レベル',
      points: 'ポイント',
      legendary: '伝説',
      professional: 'プロプレイヤー',
      gamer: 'ゲーマー',
      player: 'プレイヤー',
      weeklyGain: '今週',
      totalVotes: '総投票',
      achievements: '実績',
      winRate: '勝率'
    },
    ko: {
      votes: '투표수',
      joined: '가입',
      level: '레벨',
      points: '포인트',
      legendary: '전설',
      professional: '프로 플레이어',
      gamer: '게이머',
      player: '플레이어',
      weeklyGain: '주간',
      totalVotes: '총 투표',
      achievements: '업적',
      winRate: '승률'
    }
  }

  const tooltipTextsMap = {
    en: {
      weeklyGainTooltip: 'Points gained this week compared to last week',
      totalVotesTooltip: 'Total number of votes received from community',
      achievementsTooltip: 'Number of achievements unlocked in games',
      winRateTooltip: 'Percentage of games won vs total games played',
      levelTooltip: 'Player level based on total votes and achievements',
      scoreTooltip: 'Total accumulated points from all activities',
      rankTooltip: 'Current ranking position in the leaderboard'
    },
    zh: {
      weeklyGainTooltip: '本周相比上周获得的积分增长',
      totalVotesTooltip: '从社区获得的总投票数',
      achievementsTooltip: '在游戏中解锁的成就数量',
      winRateTooltip: '获胜游戏数占总游戏数的百分比',
      levelTooltip: '基于总经验和成就的玩家等级',
      scoreTooltip: '所有活动累积的总积分',
      rankTooltip: '在排行榜中的当前排名位置'
    },
    ja: {
      weeklyGainTooltip: '先週と比較した今週のポイント増加',
      totalVotesTooltip: 'コミュニティから受けた総投票数',
      achievementsTooltip: 'ゲームで解除した実績の数',
      winRateTooltip: '総ゲーム数に対する勝利ゲーム数の割合',
      levelTooltip: '総経験値と実績に基づくプレイヤーレベル',
      scoreTooltip: 'すべての活動から蓄積された総ポイント',
      rankTooltip: 'リーダーボードでの現在のランキング位置'
    },
    ko: {
      weeklyGainTooltip: '지난주 대비 이번주 획득한 포인트 증가량',
      totalVotesTooltip: '커뮤니티에서 받은 총 투표 수',
      achievementsTooltip: '게임에서 해제한 업적 수',
      winRateTooltip: '총 게임 수 대비 승리한 게임 수의 비율',
      levelTooltip: '총 경험치와 업적을 기반으로 한 플레이어 레벨',
      scoreTooltip: '모든 활동에서 누적된 총 포인트',
      rankTooltip: '리더보드에서의 현재 순위 위치'
    }
  }

  const usersData: User[] = [
    {
      id: 1,
      username: lang === 'en' ? "GameMaster42" : lang === 'zh' ? "游戏大师42" : lang === 'ja' ? "ゲームマスター42" : "게임마스터42",
      avatar: "🎮",
      score: 15420,
      level: 5,
      rank: 1,
      votes: 147,
      joinDate: "2024-01",
      weeklyGain: 1542,
      achievements: 154,
      winRate: 89
    },
    {
      id: 2,
      username: lang === 'en' ? "RetroLover88" : lang === 'zh' ? "怀旧爱好者88" : lang === 'ja' ? "レトロ愛好者88" : "레트로애호가88",
      avatar: "👾",
      score: 12850,
      level: 4,
      rank: 2,
      votes: 128,
      joinDate: "2024-01",
      weeklyGain: 1285,
      achievements: 132,
      winRate: 85
    },
    {
      id: 3,
      username: lang === 'en' ? "PixelHunter" : lang === 'zh' ? "像素猎人" : lang === 'ja' ? "ピクセルハンター" : "픽셀헌터",
      avatar: "🕹️",
      score: 11230,
      level: 4,
      rank: 3,
      votes: 112,
      joinDate: "2024-02",
      weeklyGain: 1123,
      achievements: 118,
      winRate: 82
    },
    {
      id: 4,
      username: lang === 'en' ? "ArcadeKing" : lang === 'zh' ? "街机之王" : lang === 'ja' ? "アーケードキング" : "아케이드킹",
      avatar: "🏆",
      score: 9876,
      level: 3,
      rank: 4,
      votes: 98,
      joinDate: "2024-02",
      weeklyGain: 987,
      achievements: 105,
      winRate: 78
    },
    {
      id: 5,
      username: lang === 'en' ? "ChiptuneHero" : lang === 'zh' ? "芯片音乐英雄" : lang === 'ja' ? "チップチューンヒーロー" : "칩튠히어로",
      avatar: "🎵",
      score: 8945,
      level: 3,
      rank: 5,
      votes: 89,
      joinDate: "2024-03",
      weeklyGain: 894,
      achievements: 95,
      winRate: 75
    },
    {
      id: 6,
      username: lang === 'en' ? "NeonNinja" : lang === 'zh' ? "霓虹忍者" : lang === 'ja' ? "ネオンニンジャ" : "네온닌자",
      avatar: "⚡",
      score: 7654,
      level: 3,
      rank: 6,
      votes: 76,
      joinDate: "2024-03",
      weeklyGain: 765,
      achievements: 82,
      winRate: 72
    },
    {
      id: 7,
      username: lang === 'en' ? "ByteBuster" : lang === 'zh' ? "字节破坏者" : lang === 'ja' ? "バイトバスター" : "바이트버스터",
      avatar: "💾",
      score: 6789,
      level: 2,
      rank: 7,
      votes: 67,
      joinDate: "2024-04",
      weeklyGain: 678,
      achievements: 71,
      winRate: 68
    },
    {
      id: 8,
      username: lang === 'en' ? "CyberPunk77" : lang === 'zh' ? "赛博朋克77" : lang === 'ja' ? "サイバーパンク77" : "사이버펑크77",
      avatar: "🤖",
      score: 5432,
      level: 2,
      rank: 8,
      votes: 54,
      joinDate: "2024-04",
      weeklyGain: 543,
      achievements: 58,
      winRate: 65
    }
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '🏅'
    }
  }

  const getLevelTitle = (level: number) => {
    switch (level) {
      case 5: return statsLabelsMap[lang].legendary
      case 4: return statsLabelsMap[lang].professional
      case 3: return statsLabelsMap[lang].gamer
      default: return statsLabelsMap[lang].player
    }
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 5: return 'text-red-400'
      case 4: return 'text-orange-400'
      case 3: return 'text-purple-400'
      default: return 'text-blue-400'
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400'
      case 2: return 'text-gray-300'
      case 3: return 'text-amber-600'
      default: return 'text-retro-green'
    }
  }

  const getProgressColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-red-400 to-red-600'
      case 2: return 'from-orange-400 to-orange-600'
      case 3: return 'from-orange-400 to-orange-600'
      case 4: return 'from-purple-400 to-purple-600'
      case 5: return 'from-purple-400 to-purple-600'
      case 6: return 'from-purple-400 to-purple-600'
      default: return 'from-blue-400 to-blue-600'
    }
  }

  const getProgressWidth = (score: number) => {
    const maxScore = 15420
    return Math.min((score / maxScore) * 100, 100)
  }

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标签导航 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div className="flex space-x-1 bg-black/50 p-1 rounded-lg border border-retro-green/30">
            {tabsMap[lang].map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2 rounded font-pixel text-sm transition-all duration-300 ${
                  currentTab === tab.id
                    ? 'bg-retro-green text-black shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 排行榜列表 */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {usersData.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3 + index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.02,
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className={`pixel-card p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-retro-green/20 ${
                user.rank <= 3 ? 'border-t-4 border-t-yellow-400' : ''
              }`}
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                {/* 左侧：排名、头像、用户信息 */}
                <div className="flex items-center space-x-6">
                  {/* 排名徽章 */}
                  <Tooltip content={tooltipTextsMap[lang].rankTooltip}>
                    <div className="text-center min-w-[60px]">
                      <div className="text-3xl mb-1">
                        {getRankIcon(user.rank)}
                      </div>
                      <div className={`text-2xl font-bold game-score ${getRankColor(user.rank)}`}>
                        #{user.rank}
                      </div>
                    </div>
                  </Tooltip>

                  {/* 头像和用户信息 */}
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="text-4xl p-2 bg-gradient-to-br from-retro-green/20 to-retro-cyan/20 rounded-lg border border-retro-green/30"
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {user.avatar}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-retro text-white">
                        {user.username}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm font-pixel">
                        <Tooltip content={tooltipTextsMap[lang].levelTooltip}>
                          <span className={getLevelColor(user.level)}>
                            {statsLabelsMap[lang].level} {user.level} - {getLevelTitle(user.level)}
                          </span>
                        </Tooltip>
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

                {/* 右侧：积分和进度条 */}
                <div className="text-right">
                  <Tooltip content={tooltipTextsMap[lang].scoreTooltip}>
                    <motion.div 
                      className="text-3xl font-bold game-score text-retro-yellow"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {user.score.toLocaleString()}
                    </motion.div>
                  </Tooltip>
                  <div className="text-sm text-gray-400 font-pixel">{statsLabelsMap[lang].points}</div>
                  
                  {/* 进度条 */}
                  <div className="mt-2 w-24">
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full bg-gradient-to-r ${getProgressColor(user.rank)} animate-glow`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${getProgressWidth(user.score)}%` }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 1.5, 
                          delay: 0.8 + index * 0.1,
                          ease: "easeOut"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 详细统计数据网格 */}
              <motion.div 
                className="grid grid-cols-4 gap-4 mt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.9 + index * 0.1 
                }}
              >
                {/* 本周增长 */}
                <Tooltip content={tooltipTextsMap[lang].weeklyGainTooltip}>
                  <motion.div 
                    className="pixel-card p-3 text-center transition-all duration-300"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="text-lg font-bold text-retro-green">
                      +{user.weeklyGain}
                    </div>
                    <div className="text-xs text-gray-400 font-pixel">
                      {statsLabelsMap[lang].weeklyGain}
                    </div>
                  </motion.div>
                </Tooltip>

                {/* 总投票 */}
                <Tooltip content={tooltipTextsMap[lang].totalVotesTooltip}>
                  <motion.div 
                    className="pixel-card p-3 text-center transition-all duration-300"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: 'rgba(6, 182, 212, 0.1)',
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="text-lg font-bold text-retro-cyan">
                      {user.votes}
                    </div>
                    <div className="text-xs text-gray-400 font-pixel">
                      {statsLabelsMap[lang].totalVotes}
                    </div>
                  </motion.div>
                </Tooltip>

                {/* 成就数 */}
                <Tooltip content={tooltipTextsMap[lang].achievementsTooltip}>
                  <motion.div 
                    className="pixel-card p-3 text-center transition-all duration-300"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: 'rgba(234, 179, 8, 0.1)',
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="text-lg font-bold text-retro-yellow">
                      {user.achievements}
                    </div>
                    <div className="text-xs text-gray-400 font-pixel">
                      {statsLabelsMap[lang].achievements}
                    </div>
                  </motion.div>
                </Tooltip>

                {/* 胜率 */}
                <Tooltip content={tooltipTextsMap[lang].winRateTooltip}>
                  <motion.div 
                    className="pixel-card p-3 text-center transition-all duration-300"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: 'rgba(168, 85, 247, 0.1)',
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="text-lg font-bold text-purple-400">
                      {user.winRate}%
                    </div>
                    <div className="text-xs text-gray-400 font-pixel">
                      {statsLabelsMap[lang].winRate}
                    </div>
                  </motion.div>
                </Tooltip>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* 你的位置 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-8 text-center"
        >
          <div className="pixel-card p-6">
            <h3 className="text-xl font-bold text-retro-green mb-2">🎯 你的位置</h3>
            <div className="text-2xl font-bold text-gray-400 mb-2">#163</div>
            <p className="text-gray-400">继续投票以提升排名！</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 