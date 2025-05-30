"use client"

import Header from '@/components/layout/Header'
import CommunitySection from '@/components/sections/CommunitySection'
import PageTransition from '@/components/utils/PageTransition'
import BackToTop from '@/components/ui/BackToTop'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { footerTranslations } from '@/utils/footerTranslations'

export default function CommunityPage() {
  const { lang, setLang } = useLanguage()
  
  useEffect(() => {
    document.body.style.opacity = '1'
    document.body.style.transition = 'opacity 0.3s ease-in'
  }, [])

  const pageInfoMap = {
    en: {
      title: '👥 Community Governance',
      description: 'Join the GAME PUMP community and build the future of classic games together'
    },
    zh: {
      title: '👥 社区治理',
      description: '加入 GAME PUMP 社区，共同建设经典游戏的未来'
    },
    ja: {
      title: '👥 コミュニティガバナンス',
      description: 'GAME PUMP コミュニティに参加し、クラシックゲームの未来を一緒に築きましょう'
    },
    ko: {
      title: '👥 커뮤니티 거버넌스',
      description: 'GAME PUMP 커뮤니티에 참여하여 클래식 게임의 미래를 함께 만들어가세요'
    }
  }

  return (
    <PageTransition pageKey="community-page">
        <Header lang={lang} setLang={setLang} />
        
        {/* 页面头部 */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.7, rotateZ: 8 }}
          animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
          transition={{ duration: 0.9, delay: 0.3, type: "spring", stiffness: 220 }}
          className="pt-32 pb-8"
        >
          <div className="max-w-6xl mx-auto px-6">
            {/* 页面标题 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.6, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 250 }}
              className="text-center"
            >
              <motion.h1 
                key={`community-title-${lang}`}
                initial={{ opacity: 0, rotateZ: 15, scale: 0.5 }}
                animate={{ opacity: 1, rotateZ: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.7, type: "spring", stiffness: 300 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold font-retro text-retro-magenta mb-4" 
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {pageInfoMap[lang].title}
              </motion.h1>
              <motion.p 
                key={`community-desc-${lang}`}
                initial={{ opacity: 0, scale: 0.7, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-lg text-gray-300 max-w-2xl mx-auto"
              >
                {pageInfoMap[lang].description}
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* 社区内容 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 80, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.6, type: "spring", stiffness: 170 }}
        >
          <CommunitySection />
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