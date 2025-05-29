'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PageProgressBarProps {
  isLoading: boolean
}

export default function PageProgressBar({ isLoading }: PageProgressBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(timer)
            return 90
          }
          return prev + Math.random() * 30
        })
      }, 100)

      return () => clearInterval(timer)
    } else {
      setProgress(100)
      const timer = setTimeout(() => setProgress(0), 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {(isLoading || progress > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/20"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-retro-green via-retro-cyan to-retro-green"
            style={{
              background: 'linear-gradient(90deg, #00FF00, #00FFFF, #00FF00)',
              boxShadow: '0 0 10px currentColor'
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          
          {/* 像素化装饰 */}
          <div className="absolute top-0 right-0 w-2 h-1 bg-retro-yellow animate-blink" />
        </motion.div>
      )}
    </AnimatePresence>
  )
} 