'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

// 动态导入排行榜内容，禁用 SSR
const SimpleLeaderboard = dynamic(() => import('./SimpleLeaderboard'), {
  ssr: false,
  loading: () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="py-20 bg-gradient-to-b from-gray-900 to-black"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-700 rounded mb-4 w-64 mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded mb-8 w-96 mx-auto"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-gray-800 rounded-lg p-6 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-gray-700 rounded"></div>
                  <div className="h-8 w-8 bg-gray-700 rounded"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded mb-2 w-32"></div>
                    <div className="h-3 bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-700 rounded w-20"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
})

export default function ClientOnlyLeaderboard() {
  const { lang } = useLanguage()
  const [isClient, setIsClient] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // 确保在客户端环境
    setIsClient(true)
    setIsMounted(true)
  }, [])

  const loadingTextMap = {
    en: 'Loading Leaderboard...',
    zh: '加载排行榜...',
    ja: 'リーダーボードを読み込み中...',
    ko: '리더보드 로딩 중...'
  }

  // 在客户端挂载之前显示加载状态
  if (!isClient || !isMounted) {
    return (
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-retro-green font-pixel">{loadingTextMap[lang]}</p>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="leaderboard-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <SimpleLeaderboard />
      </motion.div>
    </AnimatePresence>
  )
} 