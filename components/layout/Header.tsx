 'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WalletButton from '../wallet/WalletButton'
import { usePageTransition } from '../utils/PageTransition'
import { usePagePreloader } from '../utils/PagePreloader'
import { usePageSoundEffects } from '../utils/PageSoundEffects'

interface HeaderProps {
  lang: 'en' | 'zh' | 'ja' | 'ko'
  setLang: (lang: 'en' | 'zh' | 'ja' | 'ko') => void
}

export default function Header({ lang, setLang }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentTime, setCurrentTime] = useState('00:00:00')
  const [isClient, setIsClient] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { navigateWithTransition } = usePageTransition()
  const { preloadRoute } = usePagePreloader()
  const { playClickSound, playHoverSound } = usePageSoundEffects()

  // 导航菜单国际化
  const navMenuMap = {
    en: [
      { name: 'Home', sectionId: 'home', icon: '🏠' },
      { name: 'Voting', sectionId: 'voting', icon: '🗳️' },
      { name: 'Tokenomics', sectionId: 'tokenomics', icon: '🪙' },
      { name: 'Roadmap', sectionId: 'roadmap', icon: '🗺️' },
      { name: 'Leaderboard', sectionId: 'leaderboard', icon: '🏆' },
      { name: 'Community', sectionId: 'community', icon: '👥' },
    ],
    zh: [
      { name: '首页', sectionId: 'home', icon: '🏠' },
      { name: '投票', sectionId: 'voting', icon: '🗳️' },
      { name: '代币', sectionId: 'tokenomics', icon: '🪙' },
      { name: '路线图', sectionId: 'roadmap', icon: '🗺️' },
      { name: '排行榜', sectionId: 'leaderboard', icon: '🏆' },
      { name: '社区', sectionId: 'community', icon: '👥' },
    ],
    ja: [
      { name: 'ホーム', sectionId: 'home', icon: '🏠' },
      { name: '投票', sectionId: 'voting', icon: '🗳️' },
      { name: 'トークン', sectionId: 'tokenomics', icon: '🪙' },
      { name: 'ロードマップ', sectionId: 'roadmap', icon: '🗺️' },
      { name: 'リーダーボード', sectionId: 'leaderboard', icon: '🏆' },
      { name: 'コミュニティ', sectionId: 'community', icon: '👥' },
    ],
    ko: [
      { name: '홈', sectionId: 'home', icon: '🏠' },
      { name: '투표', sectionId: 'voting', icon: '🗳️' },
      { name: '토큰', sectionId: 'tokenomics', icon: '🪙' },
      { name: '로드맵', sectionId: 'roadmap', icon: '🗺️' },
      { name: '리더보드', sectionId: 'leaderboard', icon: '🏆' },
      { name: '커뮤니티', sectionId: 'community', icon: '👥' },
    ]
  }

  const logoSubtitleMap = {
    en: 'Make Classic Games Great Again',
    zh: 'Make Classic Games Great Again',
    ja: 'Make Classic Games Great Again',
    ko: 'Make Classic Games Great Again'
  }

  useEffect(() => {
    // 标记客户端已挂载
    setIsClient(true)
    setIsMounted(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 单独的 useEffect 处理时间更新
  useEffect(() => {
    if (!isClient || !isMounted) return

    // 游戏风格的时间显示
    const updateTime = () => {
      const now = new Date()
      
      // 根据语言设置时区和格式
      const timeZoneMap = {
        en: { timezone: 'America/New_York', locale: 'en-US', hour12: true },
        zh: { timezone: 'Asia/Shanghai', locale: 'zh-CN', hour12: false },
        ja: { timezone: 'Asia/Tokyo', locale: 'ja-JP', hour12: false },
        ko: { timezone: 'Asia/Seoul', locale: 'ko-KR', hour12: false }
      }
      
      const config = timeZoneMap[lang]
      const timeString = now.toLocaleTimeString(config.locale, { 
        timeZone: config.timezone,
        hour12: config.hour12, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
      setCurrentTime(timeString)
    }

    // 立即更新一次时间
    updateTime()
    
    // 设置定时器
    const timeInterval = setInterval(updateTime, 1000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [isClient, isMounted, lang])

  // 平滑滚动到指定区域或导航到页面
  const handleNavigation = (sectionId: string) => {
    playClickSound() // 播放点击音效
    if (sectionId === 'leaderboard') {
      navigateWithTransition('/leaderboard')
    } else if (sectionId === 'voting') {
      navigateWithTransition('/voting')
    } else if (sectionId === 'tokenomics') {
      navigateWithTransition('/tokenomics')
    } else if (sectionId === 'roadmap') {
      navigateWithTransition('/roadmap')
    } else if (sectionId === 'community') {
      navigateWithTransition('/community')
    } else if (sectionId === 'home') {
      navigateWithTransition('/')
    } else {
      // 对于其他链接，检查当前是否在首页
      const currentPath = window.location.pathname
      if (currentPath !== '/') {
        // 如果不在首页，跳转到首页的对应区域
        navigateWithTransition(`/#${sectionId}`)
      } else {
        // 在首页则直接滚动到指定区域
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      })
        }
      }
    }
  }

  // 悬停时预加载页面
  const handleMouseEnter = (sectionId: string) => {
    playHoverSound() // 播放悬停音效
    const routeMap: { [key: string]: string } = {
      'leaderboard': '/leaderboard',
      'voting': '/voting',
      'tokenomics': '/tokenomics',
      'roadmap': '/roadmap',
      'community': '/community',
      'home': '/'
    }
    
    if (routeMap[sectionId]) {
      preloadRoute(routeMap[sectionId])
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md border-b-2 border-retro-green border-glow' 
          : 'bg-black/20 backdrop-blur-sm'
      }`}
    >
      {/* 游戏状态栏风格的顶部条 */}
      <div className="bg-black border-b border-retro-green/50 px-2 sm:px-4 py-1 pixel-dots">
        <div className="flex justify-between items-center text-xs font-pixel">
          <div className="flex items-center space-x-4">
            <span className="text-retro-green">STATUS: ONLINE</span>
            <span className="text-retro-yellow">PLAYERS: 1,337</span>
            <span className="text-retro-cyan">NETWORK: SOLANA</span>
            {/* 社交媒体快捷链接 */}
            <div className="hidden sm:flex items-center space-x-2 ml-4">
              <a href="https://t.me/+hTX4-8gYcVo5M2Fl" target="_blank" rel="noopener noreferrer" className="text-retro-cyan hover:text-retro-green transition-colors text-xs">TG</a>
              <span className="text-gray-500">|</span>
              <a href="https://x.com/lawblock?s=09" target="_blank" rel="noopener noreferrer" className="text-retro-cyan hover:text-retro-green transition-colors text-xs">X</a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isMounted ? (
              <span className="text-retro-magenta">
                TIME: {currentTime}
              </span>
            ) : (
            <span className="text-retro-magenta">
                TIME: 00:00:00
            </span>
            )}
            <div className="w-2 h-2 bg-retro-green rounded animate-blink"></div>
            {/* 语言切换按钮 */}
            <div className="ml-4 flex items-center space-x-1">
              <button
                className={`font-bold text-xs ${lang === 'en' ? 'text-retro-green underline' : 'text-gray-400'}`}
                onClick={() => setLang('en')}
              >EN</button>
              <span className="text-gray-500">|</span>
              <button
                className={`font-bold text-xs ${lang === 'zh' ? 'text-retro-green underline' : 'text-gray-400'}`}
                onClick={() => setLang('zh')}
              >CN</button>
              <span className="text-gray-500">|</span>
              <button
                className={`font-bold text-xs ${lang === 'ja' ? 'text-retro-green underline' : 'text-gray-400'}`}
                onClick={() => setLang('ja')}
              >JP</button>
              <span className="text-gray-500">|</span>
              <button
                className={`font-bold text-xs ${lang === 'ko' ? 'text-retro-green underline' : 'text-gray-400'}`}
                onClick={() => setLang('ko')}
              >KR</button>
            </div>
          </div>
        </div>
      </div>

      {/* 主导航栏 */}
      <nav className="px-2 sm:px-6 py-2 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              {/* 像素化游戏控制器图标 */}
              <div className="w-10 h-8 bg-retro-green relative animate-glow">
                <div className="absolute top-1 left-1 w-2 h-1 bg-black"></div>
                <div className="absolute top-1 right-1 w-2 h-1 bg-black"></div>
                <div className="absolute bottom-1 left-2 w-1 h-1 bg-black"></div>
                <div className="absolute bottom-1 right-2 w-1 h-1 bg-black"></div>
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-retro-green font-retro" style={{ textShadow: '0 0 10px currentColor' }}>
                GAME PUMP
              </h1>
              <p className="text-xs text-retro-cyan font-pixel">
                {logoSubtitleMap[lang]}
              </p>
            </div>
          </motion.div>

          {/* 主导航 */}
          <div className="hidden md:flex items-center space-x-4 sm:space-x-8">
            {navMenuMap[lang].map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => handleNavigation(item.sectionId)}
                onMouseEnter={() => handleMouseEnter(item.sectionId)}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className="relative group text-white hover:text-retro-green transition-colors duration-300 font-retro text-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-retro-green group-hover:w-full transition-all duration-300"></div>
              </motion.button>
            ))}
          </div>

          {/* 钱包连接按钮 */}
          <WalletButton lang={lang} />

          {/* 移动端菜单按钮 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-retro-green text-2xl"
          >
            ☰
          </motion.button>
        </div>
      </nav>
    </motion.header>
  )
}