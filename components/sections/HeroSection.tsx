'use client'

import React, { useState, useEffect, memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useStats } from '@/hooks/useStats'
import { useUser } from '@/contexts/UserContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCheckin } from '@/hooks/useCheckin'
import { useVotingStats } from '@/hooks/useVotingStats'
import { useVotingRounds } from '@/hooks/useVotingRounds'

interface Particle {
  id: number
  x: number
  y: number
  opacity: number
  yEnd: number
  duration: number
  delay: number
}

export default memo(function HeroSection() {
  const { lang } = useLanguage()
  const { stats } = useStats()
  const { stats: votingStats, refetch: refetchVotingStats } = useVotingStats()
  const { currentRound, loading: roundsLoading, refetch: refetchRounds } = useVotingRounds()
  const { user: currentUser, loading: userLoading, refetch: refreshUser } = useUser()
  const { connected, publicKey } = useWallet()
  const { handleCheckin, checking } = useCheckin()
  
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [currentGameIndex, setCurrentGameIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  
  // 自动滚动相关状态
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  
  // 组件初始化时刷新投票轮次数据
  useEffect(() => {
    console.log('🎮 HeroSection: 组件初始化，刷新投票轮次数据');
    refetchRounds();
  }, [refetchRounds]);

  // 监听投票轮次数据变化
  useEffect(() => {
    console.log('🎮 HeroSection: 投票轮次数据变化', {
      hasCurrentRound: !!currentRound,
      roundId: currentRound?._id,
      gamesCount: currentRound?.games?.length || 0,
      gamesData: currentRound?.games?.map(g => ({ name: g.name, icon: g.icon, votes: g.votes })) || []
    });
  }, [currentRound]);

  // 减少日志频率，只在关键状态变化时输出
  useEffect(() => {
    console.log('🎮 HeroSection 用户状态更新:', {
      connected,
      currentUser: !!currentUser,
      userLoading,
      availableVotes: currentUser?.availableVotes
    });
  }, [connected, !!currentUser, userLoading]); // 只监听关键状态变化

  // 监听用户数据变化，同时刷新统计数据
  useEffect(() => {
    if (currentUser) {
      console.log('🔄 用户数据已加载，刷新统计数据...');
      // 延迟一点点时间确保数据库已更新
      setTimeout(() => {
        refetchVotingStats();
      }, 100);
    }
  }, [currentUser, refetchVotingStats]);

  // 使用用户数据的签到检查函数
  const canCheckinToday = () => {
    if (!currentUser || !(currentUser as any).dailyCheckin) return true;
    
    const today = new Date();
    const lastCheckin = (currentUser as any).dailyCheckin.lastCheckinDate ? 
      new Date((currentUser as any).dailyCheckin.lastCheckinDate) : null;
    
    if (!lastCheckin) return true;
    
    return today.toDateString() !== lastCheckin.toDateString();
  };

  const fullTextMap = {
    en: "Make Classic Games Great Again",
    zh: "Make Classic Games Great Again",  // 中文版本也显示英文
    ja: "Make Classic Games Great Again",
    ko: "Make Classic Games Great Again"
  }
  const descMap = {
    en: "Revive classic games through community voting and bring them to the blockchain world. Connect your Solana wallet, vote for your favorite classic games, and get exclusive meme tokens.",
    zh: "通过社区投票复兴经典游戏，将其带入区块链世界。\n连接 Solana 钱包，投票选择你最喜爱的经典游戏，获得专属 meme 代币。",
    ja: "コミュニティ投票でクラシックゲームを復活させ、ブロックチェーンの世界に持ち込みます。Solanaウォレットを接続し、お気に入りのクラシックゲームに投票して、専用のミームトークンを獲得しましょう。",
    ko: "커뮤니티 투표를 통해 클래식 게임을 되살리고 블록체인 세계로 가져옵니다. Solana 지갑을 연결하고, 좋아하는 클래식 게임에 투표하여 전용 밈 토큰을 얻으세요."
  }
  const btnVoteMap = {
    en: "Start Voting",
    zh: "开始投票",
    ja: "投票を始める",
    ko: "투표 시작"
  }
  const btnCommunityMap = {
    en: "View Community",
    zh: "查看社区",
    ja: "コミュニティを見る",
    ko: "커뮤니티 보기"
  }
  const btnTasksMap = {
    en: "Social Tasks",
    zh: "社交任务",
    ja: "ソーシャルタスク",
    ko: "소셜 작업"
  }
  const btnCheckinMap = {
    en: "Daily Check-in",
    zh: "每日签到",
    ja: "デイリーチェックイン",
    ko: "일일 체크인"
  }
  const checkinSuccessMap = {
    en: "Check-in successful!",
    zh: "签到成功！",
    ja: "チェックイン成功！",
    ko: "체크인 성공!"
  }
  const checkinErrorMap = {
    en: "Check-in failed",
    zh: "签到失败",
    ja: "チェックイン失敗",
    ko: "체크인 실패"
  }
  const connectWalletMap = {
    en: "Connect wallet first",
    zh: "请先连接钱包",
    ja: "まずウォレットを接続してください",
    ko: "먼저 지갑을 연결하세요"
  }
  
  // 游戏展示标题国际化
  const gameDisplayMap = {
    en: "Current Voting Games:",
    zh: "当前投票游戏:",
    ja: "現在投票中のゲーム:",
    ko: "현재 투표 중인 게임:"
  }
  
  // 备用静态游戏列表（当没有投票轮次时使用）
  const fallbackClassicGamesMap = {
    en: [
      { name: "Super Mario", icon: "🍄", color: "text-red-400" },
      { name: "Tetris", icon: "🟦", color: "text-blue-400" },
      { name: "Space Invaders", icon: "👾", color: "text-green-400" },
      { name: "Pac-Man", icon: "🟡", color: "text-yellow-400" },
      { name: "Legend of Zelda", icon: "🗡️", color: "text-emerald-400" },
    ],
    zh: [
      { name: "超级马里奥", icon: "🍄", color: "text-red-400" },
      { name: "俄罗斯方块", icon: "🟦", color: "text-blue-400" },
      { name: "太空侵略者", icon: "👾", color: "text-green-400" },
      { name: "吃豆人", icon: "🟡", color: "text-yellow-400" },
      { name: "塞尔达传说", icon: "🗡️", color: "text-emerald-400" },
    ],
    ja: [
      { name: "スーパーマリオ", icon: "🍄", color: "text-red-400" },
      { name: "テトリス", icon: "🟦", color: "text-blue-400" },
      { name: "スペースインベーダー", icon: "👾", color: "text-green-400" },
      { name: "パックマン", icon: "🟡", color: "text-yellow-400" },
      { name: "ゼルダの伝説", icon: "🗡️", color: "text-emerald-400" },
    ],
    ko: [
      { name: "슈퍼 마리오", icon: "🍄", color: "text-red-400" },
      { name: "테트리스", icon: "🟦", color: "text-blue-400" },
      { name: "스페이스 인베이더", icon: "👾", color: "text-green-400" },
      { name: "팩맨", icon: "🟡", color: "text-yellow-400" },
      { name: "젤다의 전설", icon: "🗡️", color: "text-emerald-400" },
    ]
  }

  // 动态获取游戏数据：优先使用投票轮次中的游戏，否则使用备用列表
  const getClassicGames = useMemo(() => {
    if (currentRound && currentRound.games && currentRound.games.length > 0) {
      console.log('🎮 HeroSection: 使用投票轮次中的游戏数据', {
        roundId: currentRound._id,
        totalGames: currentRound.games.length,
        games: currentRound.games.map(g => g.name)
      });
      
      // 使用投票轮次中的游戏数据
      const colors = [
        "text-red-400", "text-blue-400", "text-green-400", 
        "text-yellow-400", "text-emerald-400", "text-purple-400",
        "text-cyan-400", "text-orange-400", "text-pink-400", "text-indigo-400"
      ];
      
      return currentRound.games.map((game: any, index: number) => ({
        name: game.nameTranslations?.[lang] || game.name,
        icon: game.icon || "🎮",
        color: colors[index % colors.length]
      }));
    }
    
    console.log('🎮 HeroSection: 使用备用静态游戏列表');
    // 使用备用静态游戏列表
    return fallbackClassicGamesMap[lang];
  }, [currentRound, lang]);

  const classicGames = getClassicGames;
  
  // 统计数据国际化标签
  const statsLabelsMap = {
    en: {
      totalVotes: "Total Votes",
      totalParticipants: "Users", 
      timeLeft: "Time Left",
      totalTokens: "Total Tokens"
    },
    zh: {
      totalVotes: "总投票数",
      totalParticipants: "用户数",
      timeLeft: "投票倒计时",
      totalTokens: "代币总数"
    },
    ja: {
      totalVotes: "総投票数",
      totalParticipants: "ユーザー数",
      timeLeft: "残り時間",
      totalTokens: "総トークン数"
    },
    ko: {
      totalVotes: "총 투표수",
      totalParticipants: "사용자 수",
      timeLeft: "남은 시간",
      totalTokens: "총 토큰 수"
    }
  }

  // 格式化数字显示
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  // 格式化时间显示
  const formatTimeLeft = (timeLeft: { hours: number; minutes: number; seconds: number } | null) => {
    if (!timeLeft) return '已结束'
    const { hours, minutes, seconds } = timeLeft
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // 动态统计数据
  const getStatsData = () => {
    // 添加调试日志
    console.log('🎮 HeroSection统计数据状态:', {
      stats: !!stats,
      votingStats: !!votingStats,
      statsData: stats,
      votingStatsData: votingStats
    });

    // 优先显示投票数据，即使Token统计未加载
    if (!votingStats) {
      return [
        { label: statsLabelsMap[lang].totalParticipants, value: "...", color: "text-retro-green" },
        { label: statsLabelsMap[lang].timeLeft, value: "...", color: "text-retro-cyan" },
        { label: statsLabelsMap[lang].totalVotes, value: "...", color: "text-retro-yellow" },
        { label: statsLabelsMap[lang].totalTokens, value: stats ? formatNumber(stats.totalTokens) : "...", color: "text-retro-magenta" },
      ]
    }

    return [
      { 
        label: statsLabelsMap[lang].totalParticipants, 
        value: formatNumber(votingStats.totalParticipants), 
        color: "text-retro-green" 
      },
      { 
        label: statsLabelsMap[lang].timeLeft, 
        value: formatTimeLeft(votingStats.timeLeft),
        color: "text-retro-cyan" 
      },
      { 
        label: statsLabelsMap[lang].totalVotes, 
        value: formatNumber(votingStats.totalVotes),
        color: "text-retro-yellow" 
      },
      { 
        label: statsLabelsMap[lang].totalTokens, 
        value: stats ? formatNumber(stats.totalTokens) : "0", 
        color: "text-retro-magenta" 
      },
    ]
  }
  


  const fullText = fullTextMap[lang]

  useEffect(() => {
    setIsClient(true)
    // 生成固定的粒子数据（避免水合错误）
    const particleData: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: (i * 7 + 11) % 100, // 使用固定算法生成位置
      y: (i * 13 + 17) % 100,
      opacity: 0,
      yEnd: -((i % 10) + 5), // 向上移动5-15%
      duration: (i % 3) + 2,
      delay: (i % 20) * 0.1
    }))
    setParticles(particleData)
  }, [])

  // 打字机效果
  useEffect(() => {
    setTypedText('') // 重置文本
    let i = 0
    const typingTimer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(typingTimer)
      }
    }, 150)

    return () => clearInterval(typingTimer)
  }, [fullText]) // 只依赖fullText

  // 游戏轮播效果 - 只在游戏数量少时启用
  useEffect(() => {
    if (classicGames.length <= 3) {
      const gameTimer = setInterval(() => {
        setCurrentGameIndex((prev) => (prev + 1) % classicGames.length)
      }, 2000)

      return () => clearInterval(gameTimer)
    }
  }, [classicGames.length])

  // 语言切换时重置游戏索引
  useEffect(() => {
    setCurrentGameIndex(0)
  }, [lang])

  // 导航到指定页面
  const navigateToPage = useCallback((page: string) => {
    window.location.href = `/${page}`
  }, [])

  // 缓存游戏轮播的渲染逻辑 - 水平滚动展示所有游戏
  const gameCarousel = useMemo(() => {
    return classicGames.map((game, index) => {
      // 从投票轮次中获取游戏的投票数据
      const gameData = currentRound?.games?.find((g: any) => 
        (g.nameTranslations?.[lang] || g.name) === game.name
      );
      
      return (
        <motion.div
          key={`${game.name}-${lang}-${index}`}
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ 
            opacity: 1,
            scale: 1,
            x: 0
          }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            ease: "easeOut" 
          }}
          whileHover={{
            scale: 1.05,
            y: -5,
            transition: { duration: 0.2 }
          }}
          className="flex-shrink-0 flex flex-col items-center space-y-3 p-4 w-28 rounded-lg border border-retro-green/20 bg-black/20 backdrop-blur-sm hover:border-retro-green/50 transition-all duration-300 cursor-pointer"
          onClick={() => navigateToPage('voting')}
        >
          <motion.div 
            className="text-4xl"
            animate={{
              y: [0, -5, 0],
              rotate: [0, 3, -3, 0]
            }}
            transition={{
              duration: 2 + index * 0.2,
              repeat: Infinity,
              delay: index * 0.3
            }}
          >
            {game.icon}
          </motion.div>
          <div className={`font-pixel text-xs ${game.color} text-center leading-tight`}>
            {game.name}
          </div>
          {gameData && (
            <div className="text-xs text-gray-400 font-pixel">
              {gameData.votes || 0} 票
            </div>
          )}
        </motion.div>
      )
    })
  }, [classicGames, lang, currentRound, navigateToPage])

  // 缓存统计数据
  const statsData = useMemo(() => getStatsData(), [votingStats, stats, lang])

  // 每日签到功能
  const onCheckinClick = async () => {
    // 首先检查钱包连接状态
    if (!connected) {
      // 显示提示需要连接钱包
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'warning',
          title: '⚠️ 提示',
          message: connectWalletMap[lang],
          duration: 3000
        });
      }
      return;
    }

    // 检查用户数据是否加载完成
    if (!currentUser) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'info',
          title: '⏳ 请稍候',
          message: '正在加载用户数据...',
          duration: 2000
        });
      }
      return;
    }

    // 检查是否已经签到
    if (!canCheckinToday()) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'info',
          title: '✅ 提示',
          message: '今日已签到，明天再来吧！',
          duration: 3000
        });
      }
      return;
    }

    const result = await handleCheckin();
    
    if (result.success) {
      // 签到成功
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'success',
          title: '🎉 ' + checkinSuccessMap[lang],
          message: `获得 ${result.data?.rewardVotes} 票！连续签到 ${result.data?.consecutiveDays} 天`,
          duration: 4000
        });
      }
    } else {
      // 签到失败
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '❌ ' + checkinErrorMap[lang],
          message: result.error || '签到失败，请重试',
          duration: 3000
        });
      }
    }
  }

  // 自动滚动逻辑
  useEffect(() => {
    if (!classicGames || classicGames.length <= 3 || isPaused) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollInterval = setInterval(() => {
      const containerWidth = container.offsetWidth;
      const scrollWidth = container.scrollWidth;
      const maxScroll = scrollWidth - containerWidth;

      setScrollPosition(prev => {
        const newPosition = prev + 2; // 每次滚动2px，可以调整速度
        
        // 如果滚动到末尾，重置到开始
        if (newPosition >= maxScroll) {
          return 0;
        }
        
        return newPosition;
      });
    }, 50); // 每50ms更新一次位置

    return () => clearInterval(scrollInterval);
  }, [classicGames, isPaused]);

  // 应用滚动位置
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-28 pb-16 md:pt-32 lg:pt-36">
      {/* 动态背景粒子 */}
      <div className="absolute inset-0 overflow-hidden">
        {isClient && particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute w-1 h-1 bg-retro-green"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [`${particle.y}%`, `${particle.y + particle.yEnd}%`]
            }}
            transition={{ 
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay 
            }}
          />
        ))}
      </div>

      <div className="max-w-full sm:max-w-3xl md:max-w-6xl mx-auto px-6 text-center relative z-10 mt-8 sm:mt-12 md:mt-16">
        {/* 主标题 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold font-retro mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-retro animate-glow">
                GAME PUMP
              </span>
            </h1>
            {/* 像素化边框效果 */}
            <div className="absolute -inset-4 border-4 border-retro-green opacity-50 animate-pulse"></div>
            <div className="absolute -inset-8 border-2 border-retro-cyan opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </motion.div>

        {/* 副标题 - 打字机效果 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-lg sm:text-2xl md:text-4xl font-retro text-retro-cyan mb-4">
            {typedText}
            <span className="animate-blink">|</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {descMap[lang].split('\n').map((line, i) => <span key={`desc-${lang}-${i}`}>{line}<br /></span>)}
          </p>
        </motion.div>

        {/* 经典游戏展示 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-sm text-retro-yellow mb-6 font-pixel">{gameDisplayMap[lang]}</div>
          
          {/* 水平滚动展示所有游戏 */}
          <div className="w-full max-w-6xl mx-auto">
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{
                scrollBehavior: 'smooth'
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="flex space-x-4 py-6 px-4 min-w-max">
                {gameCarousel}
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400 font-pixel text-center">
              共 {classicGames.length} 个游戏正在参与投票 • 
              {classicGames.length > 3 ? '自动滚动播放中（悬停暂停）' : '左右滑动查看更多'}
            </div>
          </div>
        </motion.div>

        {/* CTA按钮组 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 30px #00FF00",
              backgroundColor: "#00FF00",
              color: "#000000"
            }}
            whileTap={{ scale: 0.95 }}
            className="neon-button text-retro-green border-retro-green w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            onClick={() => navigateToPage('voting')}
          >
            🗳️ {btnVoteMap[lang]}
          </motion.button>
          
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 30px #00FFFF",
              backgroundColor: "#00FFFF",
              color: "#000000"
            }}
            whileTap={{ scale: 0.95 }}
            className="neon-button text-retro-cyan border-retro-cyan w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            onClick={() => navigateToPage('community')}
          >
            📄 {btnCommunityMap[lang]}
          </motion.button>

          {/* 社交任务按钮 */}
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 30px #FF00FF",
              backgroundColor: "#FF00FF",
              color: "#000000"
            }}
            whileTap={{ scale: 0.95 }}
            className="neon-button text-retro-magenta border-retro-magenta w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            onClick={() => navigateToPage('tasks')}
          >
            🎯 {btnTasksMap[lang]}
          </motion.button>

          {/* 每日签到按钮 */}
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: connected && currentUser && canCheckinToday() ? "0 0 30px #FFD700" : "0 0 15px #666",
              backgroundColor: connected && currentUser && canCheckinToday() ? "#FFD700" : "#666",
              color: "#000000"
            }}
            whileTap={{ scale: 0.95 }}
            className={`neon-button w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 ${
              connected && currentUser && canCheckinToday() 
                ? 'text-yellow-400 border-yellow-400 hover:text-black' 
                : 'text-gray-500 border-gray-500'
            }`}
            onClick={onCheckinClick}
            disabled={checking || userLoading}
          >
            {checking ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>签到中...</span>
              </div>
            ) : userLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>加载用户数据...</span>
              </div>
            ) : (
              <>
                {!connected ? (
                  <>🔗 {connectWalletMap[lang]}</>
                ) : !currentUser ? (
                  <>⏳ 加载中...</>
                ) : canCheckinToday() ? (
                  <>✨ {btnCheckinMap[lang]}</>
                ) : (
                  <>✅ {btnCheckinMap[lang]} <span className="ml-2 text-xs">(已签到)</span></>
                )}
              </>
            )}
          </motion.button>
        </motion.div>

        {/* 用户信息显示 */}
        {connected && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-12 max-w-md mx-auto"
          >
            <div className="pixel-card p-6 bg-gradient-to-r from-retro-green/10 to-retro-cyan/10 border-retro-green">
              <h3 className="text-lg font-retro text-retro-green mb-4 text-center">
                👤 {currentUser.username || `Player_${publicKey?.toString().slice(-6)}`}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-pixel">可用票数:</span>
                  <span className="text-retro-yellow font-bold">{currentUser.availableVotes || 0} 票</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-pixel">等级:</span>
                  <span className="text-retro-magenta font-bold">Lv.{currentUser.level || 1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-pixel">SOL余额:</span>
                  <span className="text-retro-green font-bold">{(currentUser.solBalance || 0).toFixed(4)} SOL</span>
                </div>
                {(currentUser as any).dailyCheckin && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-pixel">连续签到:</span>
                    <span className="text-orange-400 font-bold">{(currentUser as any).dailyCheckin.consecutiveDays || 0} 天</span>
                  </div>
                )}
              </div>
              
              {/* 投票按钮 */}
              {(currentUser.availableVotes || 0) > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mt-4 pt-4 border-t border-retro-green/30"
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
                      backgroundColor: '#22c55e',
                      color: '#000000'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="neon-button w-full px-4 py-3 text-center text-retro-green border-retro-green font-pixel"
                    onClick={() => navigateToPage('voting')}
                  >
                    🗳️ 前往投票 ({currentUser.availableVotes} 票可用)
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* 统计数据 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {statsData.map((stat, index) => (
            <div key={`stat-${stat.label}-${index}`} className="pixel-card p-4">
              <div className={`text-3xl font-bold game-score ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 font-pixel mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
})