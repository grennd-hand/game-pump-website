"use client"

import Header from '@/components/layout/Header'
import RoadmapSection from '@/components/sections/RoadmapSection'
import PageTransition from '@/components/utils/PageTransition'
import BackToTop from '@/components/ui/BackToTop'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { footerTranslations } from '@/utils/footerTranslations'

export default function RoadmapPage() {
  const { lang, setLang } = useLanguage()
  
  useEffect(() => {
    document.body.style.opacity = '1'
    document.body.style.transition = 'opacity 0.3s ease-in'
  }, [])

  const pageInfoMap = {
    en: {
      title: '🗺️ Project Roadmap',
      description: 'Explore GAME PUMP development journey and future plans'
    },
    zh: {
      title: '🗺️ 项目路线图',
      description: '探索 GAME PUMP 的发展历程和未来规划'
    },
    ja: {
      title: '🗺️ プロジェクトロードマップ',
      description: 'GAME PUMP の開発の歩みと将来の計画を探る'
    },
    ko: {
      title: '🗺️ 프로젝트 로드맵',
      description: 'GAME PUMP의 개발 여정과 미래 계획을 탐색하세요'
    }
  }

  return (
    <PageTransition pageKey="roadmap-page">
        <Header lang={lang} setLang={setLang} />
        
        {/* 页面头部 */}
        <motion.section 
          initial={{ opacity: 0, y: 120, skewY: 3 }}
          animate={{ opacity: 1, y: 0, skewY: 0 }}
          transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 180 }}
          className="pt-32 pb-8"
        >
          <div className="max-w-6xl mx-auto px-6">
            {/* 页面标题 */}
            <motion.div 
              initial={{ opacity: 0, y: 60, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <motion.h1 
                key={`roadmap-title-${lang}`}
                initial={{ opacity: 0, x: -100, skewX: 10 }}
                animate={{ opacity: 1, x: 0, skewX: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold font-retro text-retro-yellow mb-4" 
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {pageInfoMap[lang].title}
              </motion.h1>
              <motion.p 
                key={`roadmap-desc-${lang}`}
                initial={{ opacity: 0, y: 40, rotateZ: 2 }}
                animate={{ opacity: 1, y: 0, rotateZ: 0 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="text-lg text-gray-300 max-w-2xl mx-auto"
              >
                {pageInfoMap[lang].description}
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* 路线图内容 */}
        <motion.div
          initial={{ opacity: 0, y: 80, rotateX: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.6, type: "spring", stiffness: 150 }}
        >
          <RoadmapSection />
        </motion.div>

        {/* 页脚 */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-black border-t border-retro-green/30 py-12"
        >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-6">
            <div className="w-8 h-6 bg-retro-green relative">
              <div className="absolute top-1 left-1 w-1 h-1 bg-black"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-black"></div>
              <div className="absolute bottom-1 left-2 w-1 h-1 bg-black"></div>
              <div className="absolute bottom-1 right-2 w-1 h-1 bg-black"></div>
            </div>
            <h3 className="text-lg sm:text-xl font-retro text-retro-green">GAME PUMP</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-retro text-retro-cyan mb-3">{footerTranslations[lang].products}</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-pixel">
                <li><a href="/voting" className="hover:text-retro-green transition-colors">{footerTranslations[lang].links.voting}</a></li>
                <li><a href="/tokenomics" className="hover:text-retro-green transition-colors">{footerTranslations[lang].links.tokenomics}</a></li>
                <li><a href="/roadmap" className="hover:text-retro-green transition-colors">{footerTranslations[lang].links.roadmap}</a></li>
                <li><a href="/leaderboard" className="hover:text-retro-green transition-colors">{footerTranslations[lang].links.leaderboard}</a></li>
                <li><a href="/community" className="hover:text-retro-green transition-colors">{footerTranslations[lang].links.community}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-retro text-retro-cyan mb-3">{footerTranslations[lang].community}</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-pixel">
                <li><a href="#" className="hover:text-retro-green transition-colors">Discord</a></li>
                <li><a href="https://t.me/+hTX4-8gYcVo5M2Fl" target="_blank" rel="noopener noreferrer" className="hover:text-retro-green transition-colors">Telegram</a></li>
                <li><a href="https://x.com/lawblock?s=09" target="_blank" rel="noopener noreferrer" className="hover:text-retro-green transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">Reddit</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-retro text-retro-cyan mb-3">{footerTranslations[lang].developers}</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-pixel">
                <li><a href="https://github.com/grennd-hand/game-pump-website" target="_blank" rel="noopener noreferrer" className="hover:text-retro-green transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerTranslations[lang].links.documentation}</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">API</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">SDK</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-retro text-retro-cyan mb-3">{footerTranslations[lang].resources}</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-pixel">
                <li><a href="https://bitdong.gitbook.io/untitled/" target="_blank" rel="noopener noreferrer" className="hover:text-retro-green transition-colors">{footerTranslations[lang].links.whitepaper}</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerTranslations[lang].links.auditReport}</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerTranslations[lang].links.mediaKit}</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerTranslations[lang].links.partners}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 font-pixel mb-4">
              {footerTranslations[lang].copyright}
            </p>
            <p className="text-xs text-gray-500 font-pixel">
              {footerTranslations[lang].disclaimer}
            </p>
          </div>
        </div>
        </motion.footer>
        <BackToTop />
    </PageTransition>
  )
} 