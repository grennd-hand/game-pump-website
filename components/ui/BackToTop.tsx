'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function BackToTop() {
  const { lang } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  const tooltipMap = {
    en: "Back to top",
    zh: "回到顶部",
    ja: "トップに戻る",
    ko: "맨 위로"
  }

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="group relative overflow-hidden bg-retro-green hover:bg-retro-cyan transition-colors duration-300 text-black font-retro text-sm px-4 py-3 border-2 border-black"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
            }}
          >
            {/* 像素化背景动画 */}
            <motion.div
              className="absolute inset-0 bg-retro-yellow"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3 }}
            />
            
            {/* 按钮内容 */}
            <div className="relative z-10 flex items-center space-x-2">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-lg"
              >
                ⬆️
              </motion.div>
              <span className="hidden sm:block font-pixel">
                {tooltipMap[lang]}
              </span>
            </div>
            
            {/* 边框发光效果 */}
            <div className="absolute inset-0 border-2 border-retro-green opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
                 style={{
                   clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                 }}
            />
          </motion.button>
          
          {/* 小装饰粒子 */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-retro-cyan animate-blink"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-retro-yellow animate-blink" style={{ animationDelay: '0.5s' }}></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 