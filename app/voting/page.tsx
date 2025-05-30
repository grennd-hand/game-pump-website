"use client"

import Header from '@/components/layout/Header'
import VotingSection from '@/components/sections/VotingSection'
import PageTransition from '@/components/utils/PageTransition'
import BackToTop from '@/components/ui/BackToTop'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { footerTranslations } from '@/utils/footerTranslations'

export default function VotingPage() {
  const { lang, setLang } = useLanguage()
  
  useEffect(() => {
    document.body.style.opacity = '1'
    document.body.style.transition = 'opacity 0.3s ease-in'
  }, [])

  const pageInfoMap = {
    en: {
      title: '🗳️ Voting System',
      description: 'Participate in community governance and vote for your favorite classic games'
    },
    zh: {
      title: '🗳️ 投票系统',
      description: '参与社区治理，为你喜爱的经典游戏投票'
    },
    ja: {
      title: '🗳️ 投票システム',
      description: 'コミュニティガバナンスに参加し、お気に入りのクラシックゲームに投票しましょう'
    },
    ko: {
      title: '🗳️ 투표 시스템',
      description: '커뮤니티 거버넌스에 참여하고 좋아하는 클래식 게임에 투표하세요'
    }
  }

  return (
    <PageTransition pageKey="voting-page">
        <Header lang={lang} setLang={setLang} />
        
        {/* 页面间距 */}
        <div className="pt-24"></div>

        {/* 投票内容 */}
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 180 }}
        >
          <VotingSection />
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