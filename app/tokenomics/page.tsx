"use client"

import Header from '@/components/layout/Header'
import TokenomicsSection from '@/components/sections/TokenomicsSection'
import PageTransition from '@/components/utils/PageTransition'
import BackToTop from '@/components/ui/BackToTop'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { footerTranslations } from '@/utils/footerTranslations'

export default function TokenomicsPage() {
  const { lang, setLang } = useLanguage()
  
  useEffect(() => {
    document.body.style.opacity = '1'
    document.body.style.transition = 'opacity 0.3s ease-in'
  }, [])

  const pageInfoMap = {
    en: {
      title: '🪙 Tokenomics',
      description: 'Learn about GAME PUMP token distribution mechanism and economic model'
    },
    zh: {
      title: '🪙 代币经济学',
      description: '了解 GAME PUMP 代币的分配机制和经济模型'
    },
    ja: {
      title: '🪙 トークノミクス',
      description: 'GAME PUMP トークンの配布メカニズムと経済モデルについて学ぶ'
    },
    ko: {
      title: '🪙 토크노믹스',
      description: 'GAME PUMP 토큰 배포 메커니즘과 경제 모델에 대해 알아보세요'
    }
  }

  return (
    <PageTransition pageKey="tokenomics-page">
        <Header lang={lang} setLang={setLang} />
        
        {/* 页面头部 */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.8, rotateZ: -3 }}
          animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
          transition={{ duration: 0.9, delay: 0.3, type: "spring", stiffness: 250 }}
          className="pt-32 pb-8"
        >
          <div className="max-w-6xl mx-auto px-6">
            {/* 页面标题 */}
            <motion.div 
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <motion.h1 
                key={`tokenomics-title-${lang}`}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold font-retro text-retro-cyan mb-4" 
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {pageInfoMap[lang].title}
              </motion.h1>
              <motion.p 
                key={`tokenomics-desc-${lang}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-lg text-gray-300 max-w-2xl mx-auto"
              >
                {pageInfoMap[lang].description}
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* 代币内容 */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.6, type: "spring", stiffness: 160 }}
        >
          <TokenomicsSection />
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