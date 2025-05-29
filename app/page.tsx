"use client"

import ClientOnlyHeader from '@/components/layout/ClientOnlyHeader'
import HeroSection from '@/components/sections/HeroSection'
import BackToTop from '@/components/ui/BackToTop'
import PageTransition from '@/components/utils/PageTransition'
import PagePreloader from '@/components/utils/PagePreloader'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { lang } = useLanguage()
  
  useEffect(() => {
    // 重置页面透明度，确保过渡效果正常
    document.body.style.opacity = '1'
    document.body.style.transition = 'opacity 0.3s ease-in'
  }, [])

  const footerMap = {
    en: {
      product: "Product",
      voting: "Voting System",
      tokenomics: "Tokenomics", 
      roadmap: "Project Roadmap",
      leaderboard: "Leaderboard",
      community: "Community Governance",
      communityTitle: "Community",
      discord: "Discord",
      telegram: "Telegram",
      twitter: "Twitter",
      reddit: "Reddit",
      developer: "Developer",
      github: "GitHub",
      docs: "Documentation",
      api: "API",
      sdk: "SDK",
      resources: "Resources",
      whitepaper: "Whitepaper",
      audit: "Audit Report",
      media: "Media Kit",
      partners: "Partners",
      copyright: "© 2025 GAME PUMP. Make Classic Games Great Again | Built on Solana Blockchain",
      disclaimer: "GAME PUMP is not just a game project, but a movement to make classic games great again in Web3. Investment involves risks, please make decisions carefully"
    },
    zh: {
      product: "产品",
      voting: "投票系统",
      tokenomics: "代币经济学",
      roadmap: "项目路线图",
      leaderboard: "积分排行榜", 
      community: "社区治理",
      communityTitle: "社区",
      discord: "Discord",
      telegram: "Telegram",
      twitter: "Twitter",
      reddit: "Reddit",
      developer: "开发者",
      github: "GitHub",
      docs: "文档",
      api: "API",
      sdk: "SDK",
      resources: "资源",
      whitepaper: "白皮书",
      audit: "审计报告",
      media: "媒体资料",
      partners: "合作伙伴",
      copyright: "© 2025 GAME PUMP. 让经典游戏再次伟大 | 基于 Solana 区块链构建",
      disclaimer: "GAME PUMP 不仅仅是一个游戏项目，更是一个让经典游戏在 Web3 中再次伟大的运动。投资有风险，请谨慎决策"
    },
    ja: {
      product: "プロダクト",
      voting: "投票システム",
      tokenomics: "トークノミクス",
      roadmap: "プロジェクトロードマップ",
      leaderboard: "リーダーボード",
      community: "コミュニティガバナンス",
      communityTitle: "コミュニティ",
      discord: "Discord",
      telegram: "Telegram",
      twitter: "Twitter",
      reddit: "Reddit",
      developer: "開発者",
      github: "GitHub",
      docs: "ドキュメント",
      api: "API",
      sdk: "SDK",
      resources: "リソース",
      whitepaper: "ホワイトペーパー",
      audit: "監査レポート",
      media: "メディアキット",
      partners: "パートナー",
      copyright: "© 2025 GAME PUMP. Make Classic Games Great Again | Solana ブロックチェーン上に構築",
      disclaimer: "GAME PUMP は単なるゲームプロジェクトではなく、Web3でクラシックゲームを再び偉大にする運動です。投資にはリスクが伴います。慎重に判断してください"
    },
    ko: {
      product: "제품",
      voting: "투표 시스템",
      tokenomics: "토크노믹스",
      roadmap: "프로젝트 로드맵",
      leaderboard: "리더보드",
      community: "커뮤니티 거버넌스",
      communityTitle: "커뮤니티",
      discord: "Discord",
      telegram: "Telegram",
      twitter: "Twitter",
      reddit: "Reddit",
      developer: "개발자",
      github: "GitHub",
      docs: "문서",
      api: "API",
      sdk: "SDK",
      resources: "리소스",
      whitepaper: "백서",
      audit: "감사 보고서",
      media: "미디어 키트",
      partners: "파트너",
      copyright: "© 2025 GAME PUMP. Make Classic Games Great Again | Solana 블록체인 기반",
      disclaimer: "GAME PUMP는 단순한 게임 프로젝트가 아니라 Web3에서 클래식 게임을 다시 위대하게 만드는 운동입니다. 투자에는 위험이 따르므로 신중하게 결정하시기 바랍니다"
    }
  }

  return (
    <PageTransition pageKey="home-page">
      <PagePreloader routes={['/voting', '/tokenomics', '/roadmap', '/community', '/leaderboard']} />
      <ClientOnlyHeader />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 300 }}
      >
        <HeroSection />
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
              <h4 className="font-retro text-retro-cyan mb-3">{footerMap[lang].product}</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-pixel">
                <li><a href="/voting" className="hover:text-retro-green transition-colors">{footerMap[lang].voting}</a></li>
                <li><a href="/tokenomics" className="hover:text-retro-green transition-colors">{footerMap[lang].tokenomics}</a></li>
                <li><a href="/roadmap" className="hover:text-retro-green transition-colors">{footerMap[lang].roadmap}</a></li>
                <li><a href="/leaderboard" className="hover:text-retro-green transition-colors">{footerMap[lang].leaderboard}</a></li>
                <li><a href="/community" className="hover:text-retro-green transition-colors">{footerMap[lang].community}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-retro text-retro-cyan mb-3">{footerMap[lang].communityTitle}</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-pixel">
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerMap[lang].discord}</a></li>
                <li><a href="https://t.me/+hTX4-8gYcVo5M2Fl" target="_blank" rel="noopener noreferrer" className="hover:text-retro-green transition-colors">{footerMap[lang].telegram}</a></li>
                <li><a href="https://x.com/lawblock?s=09" target="_blank" rel="noopener noreferrer" className="hover:text-retro-green transition-colors">{footerMap[lang].twitter}</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerMap[lang].reddit}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-retro text-retro-cyan mb-3">{footerMap[lang].developer}</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-pixel">
                <li><a href="https://github.com/grennd-hand/game-pump-website" target="_blank" rel="noopener noreferrer" className="hover:text-retro-green transition-colors">{footerMap[lang].github}</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerMap[lang].docs}</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerMap[lang].api}</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerMap[lang].sdk}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-retro text-retro-cyan mb-3">{footerMap[lang].resources}</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-pixel">
                <li><a href="https://bitdong.gitbook.io/untitled/" target="_blank" rel="noopener noreferrer" className="hover:text-retro-green transition-colors">{footerMap[lang].whitepaper}</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerMap[lang].audit}</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerMap[lang].media}</a></li>
                <li><a href="#" className="hover:text-retro-green transition-colors">{footerMap[lang].partners}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 font-pixel mb-4">
              {footerMap[lang].copyright}
            </p>
            <p className="text-xs text-gray-500 font-pixel">
              {footerMap[lang].disclaimer}
            </p>
          </div>
        </div>
      </motion.footer>
      
      <BackToTop />
    </PageTransition>
  )
} 