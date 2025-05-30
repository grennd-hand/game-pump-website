'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useLeaderboard, LeaderboardUser } from '@/hooks/useLeaderboard'

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
            className={`absolute z-[9999] ${positionClasses[position]}`}
          >
            <div className="bg-black/95 text-white text-sm px-3 py-2 rounded-lg border border-retro-green/50 backdrop-blur-sm shadow-xl max-w-xs whitespace-nowrap">
              <div className="font-pixel">{content}</div>
              <div className={`absolute w-2 h-2 bg-black/95 border-retro-green/50 transform rotate-45 ${
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

export default function EnhancedLeaderboard() {
  const { lang } = useLanguage()
  const [currentTab, setCurrentTab] = useState('weekly')
  const { data, loading, error, refresh } = useLeaderboard(currentTab)

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
      checkinDays: 'Check-ins',
      inviteCount: 'Invites',
      joined: 'Joined',
      level: 'Level',
      points: 'Points',
      legendary: 'Legendary',
      professional: 'Professional',
      gamer: 'Gamer',
      player: 'Player',
      weeklyGain: 'Weekly +',
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      lastUpdated: 'Last Updated',
      refreshing: 'Refreshing...',
      refresh: 'Refresh',
      emptySlot: 'No Player Yet',
      tooltipVotes: 'Total number of votes cast',
      tooltipCheckins: 'Number of days checked in',
      tooltipInvites: 'Number of users invited'
    },
    zh: {
      votes: '投票数',
      checkinDays: '签到天数',
      inviteCount: '邀请数',
      joined: '加入时间',
      level: '等级',
      points: '积分',
      legendary: '传奇',
      professional: '专业',
      gamer: '游戏者',
      player: '玩家',
      weeklyGain: '本周 +',
      totalUsers: '总用户',
      activeUsers: '活跃用户',
      lastUpdated: '最后更新',
      refreshing: '刷新中...',
      refresh: '刷新',
      emptySlot: '暂无玩家',
      tooltipVotes: '累计投票总数',
      tooltipCheckins: '累计签到天数',
      tooltipInvites: '成功邀请用户数量'
    },
    ja: {
      votes: '投票数',
      checkinDays: 'チェックイン',
      inviteCount: '招待数',
      joined: '参加',
      level: 'レベル',
      points: 'ポイント',
      legendary: '伝説',
      professional: 'プロ',
      gamer: 'ゲーマー',
      player: 'プレイヤー',
      weeklyGain: '今週 +',
      totalUsers: '総ユーザー',
      activeUsers: 'アクティブユーザー',
      lastUpdated: '最終更新',
      refreshing: '更新中...',
      refresh: '更新',
      emptySlot: 'プレイヤーなし',
      tooltipVotes: '総投票数',
      tooltipCheckins: 'チェックイン日数',
      tooltipInvites: '招待ユーザー数'
    },
    ko: {
      votes: '투표수',
      checkinDays: '체크인',
      inviteCount: '초대수',
      joined: '가입',
      level: '레벨',
      points: '포인트',
      legendary: '전설',
      professional: '프로',
      gamer: '게이머',
      player: '플레이어',
      weeklyGain: '주간 +',
      totalUsers: '총 사용자',
      activeUsers: '활성 사용자',
      lastUpdated: '마지막 업데이트',
      refreshing: '새로고침 중...',
      refresh: '새로고침',
      emptySlot: '플레이어 없음',
      tooltipVotes: '총 투표 수',
      tooltipCheckins: '체크인 일수',
      tooltipInvites: '초대한 사용자 수'
    }
  }

  // 创建显示用的排行榜数据，确保显示10个位置
  const getDisplayLeaderboard = () => {
    const maxSlots = 10
    const leaderboard = data?.leaderboard || []
    const displayList = []
    
    for (let i = 0; i < maxSlots; i++) {
      const rank = i + 1
      const user = leaderboard[i]
      
      if (user) {
        // 有真实用户数据
        displayList.push({
          ...user,
          rank,
          isEmpty: false
        })
      } else {
        // 空位置占位符
        displayList.push({
          id: `empty-${rank}`,
          rank,
          username: statsLabelsMap[lang].emptySlot,
          avatar: '👤',
          level: 'player',
          score: 0,
          votes: 0,
          checkinDays: 0,
          inviteCount: 0,
          walletAddress: '---',
          joinedAt: new Date(),
          weeklyGain: 0,
          isEmpty: true
        })
      }
    }
    
    return displayList
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getLevelTitle = (level: string) => {
    const labels = statsLabelsMap[lang]
    switch (level) {
      case 'legendary': return labels.legendary
      case 'professional': return labels.professional
      case 'gamer': return labels.gamer
      default: return labels.player
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'legendary': return 'text-yellow-400'
      case 'professional': return 'text-purple-400'
      case 'gamer': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400'
    if (rank === 2) return 'text-gray-300'
    if (rank === 3) return 'text-orange-400'
    return 'text-retro-green'
  }

  const getProgressColor = (rank: number) => {
    if (rank <= 3) return 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20'
    if (rank <= 10) return 'bg-gradient-to-r from-retro-green/20 to-retro-cyan/20'
    return 'bg-gradient-to-r from-gray-600/20 to-gray-400/20'
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return '刚刚'
    if (diffMinutes < 60) return `${diffMinutes}分钟前`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}小时前`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}天前`
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* 标题和刷新按钮 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-retro-green mb-2 font-pixel">🏆 积分排行榜</h1>
          <div className="text-sm text-retro-cyan/80 mb-2 font-pixel">
            📊 积分计算: 签到天数×3 + 投票数×2 + 邀请数×5
          </div>
        </div>
        
        {data && (
          <motion.button
            onClick={refresh}
            disabled={loading}
            whileHover={!loading ? { scale: 1.05, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
            className={`
              group relative overflow-hidden rounded-xl px-4 py-3 
              bg-gradient-to-r from-retro-green/10 to-retro-cyan/10 
              border border-retro-green/30 backdrop-blur-sm
              transition-all duration-300 font-pixel text-sm
              ${loading 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:border-retro-green/60 hover:shadow-lg hover:shadow-retro-green/20'
              }
            `}
          >
            {/* 悬停背景效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-retro-green/20 to-retro-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center space-x-2">
              <motion.div
                animate={loading ? { rotate: 360 } : { rotate: 0 }}
                transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                className={loading ? 'text-retro-cyan' : 'text-retro-green group-hover:text-white'}
              >
                ⟳
              </motion.div>
              <span className={loading ? 'text-retro-cyan' : 'text-retro-green group-hover:text-white'}>
                {loading ? '刷新中' : '刷新'}
              </span>
            </div>
          </motion.button>
        )}
      </div>

      {/* 页面头部统计 */}
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-retro-green/30">
            <div className="text-2xl font-bold text-retro-green">{data.stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-400">{statsLabelsMap[lang].totalUsers}</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-retro-cyan/30">
            <div className="text-2xl font-bold text-retro-cyan">{data.stats.totalActiveUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-400">{statsLabelsMap[lang].activeUsers}</div>
          </div>
        </motion.div>
      )}

      {/* 时间范围切换 */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2 justify-center">
          {tabsMap[lang].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-pixel transition-all duration-300 ${
                currentTab === tab.id
                  ? 'bg-retro-green text-black shadow-lg shadow-retro-green/50'
                  : 'bg-black/40 text-retro-green border border-retro-green/30 hover:bg-retro-green/10'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-retro-green"></div>
          <p className="mt-4 text-gray-400">{statsLabelsMap[lang].refreshing}</p>
        </div>
      )}

      {/* 错误状态 */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">❌ {error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-retro-green/20 border border-retro-green/50 rounded-lg hover:bg-retro-green/30 transition-colors"
          >
            重试
          </button>
        </div>
      )}

      {/* 排行榜内容 */}
      {data && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 backdrop-blur-lg rounded-xl border border-retro-green/20 overflow-visible"
        >
          {/* 排行榜表头 */}
          <div className="bg-gradient-to-r from-black/80 to-retro-green/10 px-6 py-4 border-b border-retro-green/30">
            <div className="grid grid-cols-12 gap-4 items-center text-sm font-pixel text-gray-400 uppercase tracking-wider">
              <div className="col-span-1">排名</div>
              <div className="col-span-4">玩家</div>
              <div className="col-span-4">积分 & 统计</div>
              <div className="col-span-3">加入时间</div>
            </div>
          </div>

          {/* 排行榜列表 */}
          <div className="divide-y divide-retro-green/10 overflow-visible">
            <AnimatePresence>
              {getDisplayLeaderboard().map((user: any, index: number) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.05 }}
                  className={`px-6 py-4 transition-colors ${
                    user.isEmpty 
                      ? 'bg-black/20 opacity-50 hover:bg-black/30' 
                      : 'hover:bg-retro-green/5'
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* 排名 */}
                    <div className="col-span-1">
                      <div className={`text-xl font-bold ${getRankColor(user.rank)}`}>
                        {getRankIcon(user.rank)}
                      </div>
                    </div>

                    {/* 玩家信息 */}
                    <div className="col-span-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{user.avatar}</div>
                        <div>
                          <div className={`font-bold font-pixel ${user.isEmpty ? 'text-gray-500' : 'text-white'}`}>
                            {user.username}
                          </div>
                          {!user.isEmpty && (
                            <>
                              <div className={`text-xs ${getLevelColor(user.level)}`}>
                                {getLevelTitle(user.level)}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {user.walletAddress}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 积分 & 统计 */}
                    <div className="col-span-4">
                      {!user.isEmpty && (
                        <div className="space-y-2">
                          <div className="font-bold text-xl text-retro-green">
                            {user.score.toLocaleString()}
                          </div>
                          {user.weeklyGain > 0 && (
                            <div className="text-xs text-green-400">
                              +{user.weeklyGain} {statsLabelsMap[lang].weeklyGain}
                            </div>
                          )}
                          <div className="flex space-x-3 text-sm">
                          <div className="text-blue-400">🗳️ {user.votes}</div>
                          <div className="text-yellow-400">📅 {user.checkinDays}</div>
                          <div className="text-purple-400">👥 {user.inviteCount}</div>
                        </div>
                        </div>
                      )}
                      {user.isEmpty && (
                        <div className="text-gray-500">---</div>
                      )}
                    </div>

                    {/* 加入时间 */}
                    <div className="col-span-3">
                      {!user.isEmpty && (
                        <div className="text-sm text-gray-400">
                          {formatDate(user.joinedAt)}
                        </div>
                      )}
                      {user.isEmpty && (
                        <div className="text-gray-500">---</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  )
} 