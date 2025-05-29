'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

// 动态导入所有组件，禁用 SSR
const ClientOnlyHeader = dynamic(() => import('../layout/ClientOnlyHeader'), { 
  ssr: false,
  loading: () => <div className="h-20 bg-black"></div>
})
const ClientOnlyLeaderboard = dynamic(() => import('../ui/ClientOnlyLeaderboard'), { 
  ssr: false,
  loading: () => <LeaderboardSkeleton />
})
const BackToTop = dynamic(() => import('../ui/BackToTop'), { 
  ssr: false,
  loading: () => null
})

// 骨架屏组件
function LeaderboardSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-20 bg-gradient-to-b from-gray-900 to-black"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题骨架 */}
        <div className="text-center mb-12">
          <motion.div 
            className="h-12 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded mb-4 w-64 mx-auto"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
          <motion.div 
            className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded mb-8 w-96 mx-auto"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear",
              delay: 0.2
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>

        {/* 标签导航骨架 */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-black/50 p-1 rounded-lg border border-retro-green/30">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-8 w-20 bg-gray-700 rounded"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
              />
            ))}
          </div>
        </div>

        {/* 排行榜列表骨架 */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-black/60 border-2 border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="h-8 w-8 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: i * 0.1
                    }}
                    style={{ backgroundSize: '200% 100%' }}
                  />
                  <motion.div 
                    className="h-8 w-8 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: i * 0.1 + 0.2
                    }}
                    style={{ backgroundSize: '200% 100%' }}
                  />
                  <div>
                    <motion.div 
                      className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded mb-2 w-32"
                      animate={{ 
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: i * 0.1 + 0.4
                      }}
                      style={{ backgroundSize: '200% 100%' }}
                    />
                    <motion.div 
                      className="h-3 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-24"
                      animate={{ 
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: i * 0.1 + 0.6
                      }}
                      style={{ backgroundSize: '200% 100%' }}
                    />
                  </div>
                </div>
                <motion.div 
                  className="h-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-20"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: i * 0.1 + 0.8
                  }}
                  style={{ backgroundSize: '200% 100%' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function ClientOnlyLeaderboardPage() {
  const { lang, setLang } = useLanguage()
  const [isClient, setIsClient] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // 确保在客户端环境
    setIsClient(true)
    setIsMounted(true)
    
    // 重置页面透明度，确保过渡效果正常
    if (typeof document !== 'undefined') {
      document.body.style.opacity = '1'
      document.body.style.transition = 'opacity 0.3s ease-in'
    }
  }, [])

  const loadingTextMap = {
    en: 'Loading...',
    zh: '加载中...',
    ja: '読み込み中...',
    ko: '로딩 중...'
  }

  // 在客户端挂载之前不渲染任何内容
  if (!isClient || !isMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-retro-green font-pixel">{loadingTextMap[lang]}</p>
        </div>
      </div>
    )
  }

  const pageInfoMap = {
    en: {
      title: 'Leaderboard - GAME PUMP',
      description: 'View the top players and their scores in the GAME PUMP community',
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'Leaderboard',
      pageTitle: 'Leaderboard'
    },
    zh: {
      title: '积分排行榜 - GAME PUMP',
      description: '查看 GAME PUMP 社区中的顶级玩家和他们的积分',
      breadcrumbHome: '首页',
      breadcrumbCurrent: '积分排行榜',
      pageTitle: '积分排行榜'
    },
    ja: {
      title: 'リーダーボード - GAME PUMP',
      description: 'GAME PUMP コミュニティのトッププレイヤーとスコアを表示',
      breadcrumbHome: 'ホーム',
      breadcrumbCurrent: 'リーダーボード',
      pageTitle: 'リーダーボード'
    },
    ko: {
      title: '리더보드 - GAME PUMP',
      description: 'GAME PUMP 커뮤니티의 최상위 플레이어와 점수 보기',
      breadcrumbHome: '홈',
      breadcrumbCurrent: '리더보드',
      pageTitle: '리더보드'
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main 
        key="leaderboard-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="min-h-screen"
      >
        <ClientOnlyHeader />
        
        {/* 页面头部 */}
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pt-32 pb-8 bg-gradient-to-b from-black to-gray-900"
        >
          <div className="max-w-6xl mx-auto px-6">
            {/* 面包屑导航 */}
            <motion.nav 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-6"
            >
              <div className="flex items-center space-x-2 text-sm font-pixel">
                <a href="/" className="text-retro-green hover:text-retro-cyan transition-colors duration-300">
                  {pageInfoMap[lang].breadcrumbHome}
                </a>
                <span className="text-gray-500">/</span>
                <span className="text-gray-400">{pageInfoMap[lang].breadcrumbCurrent}</span>
              </div>
            </motion.nav>

            {/* 页面标题 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-retro text-retro-green mb-4 animate-glow">
                🏆 {pageInfoMap[lang].pageTitle}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {pageInfoMap[lang].description}
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* 积分排行榜内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <ClientOnlyLeaderboard />
        </motion.div>

        {/* 页脚 */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-black border-t border-retro-green/30 py-8"
        >
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-8 h-6 bg-retro-green relative">
                <div className="absolute top-1 left-1 w-1 h-1 bg-black"></div>
                <div className="absolute top-1 right-1 w-1 h-1 bg-black"></div>
                <div className="absolute bottom-1 left-2 w-1 h-1 bg-black"></div>
                <div className="absolute bottom-1 right-2 w-1 h-1 bg-black"></div>
              </div>
              <h3 className="text-lg font-retro text-retro-green">GAME PUMP</h3>
            </div>
            <p className="text-gray-400 font-pixel text-sm">
              © 2025 GAME PUMP. Make Classic Games Great Again | Built on Solana Blockchain
            </p>
          </div>
        </motion.footer>

        <BackToTop />
      </motion.main>
    </AnimatePresence>
  )
} 