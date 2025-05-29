'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'
import PageProgressBar from '../ui/PageProgressBar'
import PageSoundEffects from './PageSoundEffects'
import { useLanguage } from '@/contexts/LanguageContext'

interface PageTransitionProps {
  children: ReactNode
  pageKey: string
}

// 根据页面类型定义不同的动画效果
const getPageAnimations = (pageKey: string) => {
  switch (pageKey) {
    case 'home-page':
      return {
        variants: {
          initial: { opacity: 0, scale: 0.95, y: 30 },
          in: { opacity: 1, scale: 1, y: 0 },
          out: { opacity: 0, scale: 1.05, y: -30 }
        },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
          duration: 0.6
        },
        contentVariants: {
          initial: { opacity: 0, y: 50 },
          in: { opacity: 1, y: 0 },
          out: { opacity: 0, y: -50 }
        }
      }
    
    case 'voting-page':
      return {
        variants: {
          initial: { opacity: 0, x: -100, rotateY: -15 },
          in: { opacity: 1, x: 0, rotateY: 0 },
          out: { opacity: 0, x: 100, rotateY: 15 }
        },
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 25,
          duration: 0.7
        },
        contentVariants: {
          initial: { opacity: 0, x: -50, scale: 0.9 },
          in: { opacity: 1, x: 0, scale: 1 },
          out: { opacity: 0, x: 50, scale: 0.9 }
        }
      }
    
    case 'tokenomics-page':
      return {
        variants: {
          initial: { opacity: 0, scale: 0.8, rotateZ: -5 },
          in: { opacity: 1, scale: 1, rotateZ: 0 },
          out: { opacity: 0, scale: 1.2, rotateZ: 5 }
        },
        transition: {
          type: 'spring',
          stiffness: 250,
          damping: 20,
          duration: 0.8
        },
        contentVariants: {
          initial: { opacity: 0, y: 100, scale: 0.8 },
          in: { opacity: 1, y: 0, scale: 1 },
          out: { opacity: 0, y: -100, scale: 1.2 }
        }
      }
    
    case 'roadmap-page':
      return {
        variants: {
          initial: { opacity: 0, y: 100, skewY: 5 },
          in: { opacity: 1, y: 0, skewY: 0 },
          out: { opacity: 0, y: -100, skewY: -5 }
        },
        transition: {
          type: 'spring',
          stiffness: 180,
          damping: 22,
          duration: 0.9
        },
        contentVariants: {
          initial: { opacity: 0, y: 80, rotateX: 15 },
          in: { opacity: 1, y: 0, rotateX: 0 },
          out: { opacity: 0, y: -80, rotateX: -15 }
        }
      }
    
    case 'community-page':
      return {
        variants: {
          initial: { opacity: 0, scale: 0.7, rotateZ: 10 },
          in: { opacity: 1, scale: 1, rotateZ: 0 },
          out: { opacity: 0, scale: 0.7, rotateZ: -10 }
        },
        transition: {
          type: 'spring',
          stiffness: 220,
          damping: 18,
          duration: 0.75
        },
        contentVariants: {
          initial: { opacity: 0, scale: 0.5, y: 60 },
          in: { opacity: 1, scale: 1, y: 0 },
          out: { opacity: 0, scale: 0.5, y: -60 }
        }
      }
    
    case 'leaderboard-page':
      return {
        variants: {
          initial: { opacity: 0, x: 200, rotateY: 20 },
          in: { opacity: 1, x: 0, rotateY: 0 },
          out: { opacity: 0, x: -200, rotateY: -20 }
        },
        transition: {
          type: 'spring',
          stiffness: 160,
          damping: 24,
          duration: 0.85
        },
        contentVariants: {
          initial: { opacity: 0, x: 150, scale: 0.9 },
          in: { opacity: 1, x: 0, scale: 1 },
          out: { opacity: 0, x: -150, scale: 0.9 }
        }
      }
    
    default:
      return {
        variants: {
          initial: { opacity: 0, y: 20, scale: 0.98 },
          in: { opacity: 1, y: 0, scale: 1 },
          out: { opacity: 0, y: -20, scale: 1.02 }
        },
        transition: {
          type: 'tween',
          ease: 'anticipate',
          duration: 0.5
        },
        contentVariants: {
          initial: { opacity: 0, y: 30 },
          in: { opacity: 1, y: 0 },
          out: { opacity: 0, y: -30 }
        }
      }
  }
}

// 加载动画组件 - 根据页面类型显示不同的加载效果
function PageLoader({ pageKey }: { pageKey: string }) {
  const { lang } = useLanguage()
  
  const getLoadingContent = () => {
    const loadingTextMap = {
      en: {
        'voting-page': 'LOADING VOTING...',
        'tokenomics-page': 'LOADING TOKENS...',
        'roadmap-page': 'LOADING ROADMAP...',
        'community-page': 'LOADING COMMUNITY...',
        'leaderboard-page': 'LOADING LEADERBOARD...',
        'default': 'LOADING...'
      },
      zh: {
        'voting-page': '加载投票中...',
        'tokenomics-page': '加载代币中...',
        'roadmap-page': '加载路线图中...',
        'community-page': '加载社区中...',
        'leaderboard-page': '加载排行榜中...',
        'default': '加载中...'
      },
      ja: {
        'voting-page': '投票を読み込み中...',
        'tokenomics-page': 'トークンを読み込み中...',
        'roadmap-page': 'ロードマップを読み込み中...',
        'community-page': 'コミュニティを読み込み中...',
        'leaderboard-page': 'リーダーボードを読み込み中...',
        'default': '読み込み中...'
      },
      ko: {
        'voting-page': '투표 로딩 중...',
        'tokenomics-page': '토큰 로딩 중...',
        'roadmap-page': '로드맵 로딩 중...',
        'community-page': '커뮤니티 로딩 중...',
        'leaderboard-page': '리더보드 로딩 중...',
        'default': '로딩 중...'
      }
    }

    switch (pageKey) {
      case 'voting-page':
        return {
          icon: '🗳️',
          text: loadingTextMap[lang]['voting-page'],
          color: 'text-retro-green'
        }
      case 'tokenomics-page':
        return {
          icon: '🪙',
          text: loadingTextMap[lang]['tokenomics-page'],
          color: 'text-retro-cyan'
        }
      case 'roadmap-page':
        return {
          icon: '🗺️',
          text: loadingTextMap[lang]['roadmap-page'],
          color: 'text-retro-yellow'
        }
      case 'community-page':
        return {
          icon: '👥',
          text: loadingTextMap[lang]['community-page'],
          color: 'text-retro-magenta'
        }
      case 'leaderboard-page':
        return {
          icon: '🏆',
          text: loadingTextMap[lang]['leaderboard-page'],
          color: 'text-retro-green'
        }
      default:
        return {
          icon: '🎮',
          text: loadingTextMap[lang]['default'],
          color: 'text-retro-green'
        }
    }
  }

  const loadingContent = getLoadingContent()

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="page-loader"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-4"
        >
          {loadingContent.icon}
        </motion.div>
        <div className="loading-pixels mb-4">
          <div className="loading-pixel"></div>
          <div className="loading-pixel"></div>
          <div className="loading-pixel"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className={`font-pixel text-sm ${loadingContent.color}`}
        >
          {loadingContent.text}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function PageTransition({ children, pageKey }: PageTransitionProps) {
  const { lang } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const animations = getPageAnimations(pageKey)

  useEffect(() => {
    // 根据页面类型调整加载时间
    const loadingTime = pageKey === 'home-page' ? 200 : 400
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, loadingTime)

    return () => clearTimeout(timer)
  }, [pageKey])

  // 语言变化时重新触发加载动画
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300) // 语言切换时使用较短的加载时间

    return () => clearTimeout(timer)
  }, [lang])

  useEffect(() => {
    // 页面切换时添加body类和特殊效果
    document.body.classList.add('page-transitioning')
    
    // 根据页面类型添加特殊的body类
    const pageClass = `transitioning-${pageKey.replace('-page', '')}`
    document.body.classList.add(pageClass)
    
    const timer = setTimeout(() => {
      document.body.classList.remove('page-transitioning')
      document.body.classList.remove(pageClass)
    }, animations.transition.duration * 1000)

    return () => {
      clearTimeout(timer)
      document.body.classList.remove('page-transitioning')
      document.body.classList.remove(pageClass)
    }
  }, [pageKey, animations.transition.duration])

  return (
    <>
      <PageProgressBar isLoading={isLoading} />
      <PageSoundEffects isLoading={isLoading} pageKey={pageKey} />
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <PageLoader key={`loader-${pageKey}-${lang}`} pageKey={pageKey} />
        ) : (
          <motion.div
            key={pageKey}
            initial="initial"
            animate="in"
            exit="out"
            variants={animations.variants}
            transition={animations.transition}
            className="min-h-screen"
            style={{ perspective: '1000px' }}
          >
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={animations.contentVariants}
              transition={{
                ...animations.transition,
                delay: 0.1
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// 导出页面过渡钩子
export const usePageTransition = () => {
  const navigateWithTransition = (url: string, delay: number = 150) => {
    // 添加页面退出动画
    document.body.style.opacity = '0.8'
    document.body.style.transform = 'scale(0.98)'
    document.body.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    document.body.classList.add('page-transitioning')
    
    setTimeout(() => {
      window.location.href = url
    }, delay)
  }

  return { navigateWithTransition }
} 