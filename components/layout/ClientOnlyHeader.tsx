'use client'

import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ClientOnlyHeader() {
  const { lang, setLang } = useLanguage()
  
  // 动态导入 Header 组件，禁用 SSR
  const Header = dynamic(() => import('./Header'), {
    ssr: false,
    loading: () => (
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b-2 border-retro-green">
        {/* 游戏状态栏风格的顶部条 */}
        <div className="bg-black border-b border-retro-green/50 px-2 sm:px-4 py-1">
          <div className="flex justify-between items-center text-xs font-pixel">
            <div className="flex items-center space-x-4">
              <span className="text-retro-green">STATUS: ONLINE</span>
              <span className="text-retro-yellow">PLAYERS: 1,337</span>
              <span className="text-retro-cyan">NETWORK: SOLANA</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-retro-magenta">TIME: 00:00:00</span>
              <div className="w-2 h-2 bg-retro-green rounded animate-blink"></div>
              {/* 语言切换按钮 */}
              <div className="ml-4 flex items-center space-x-1">
                <button
                  className={`font-bold text-xs ${lang === 'en' ? 'text-retro-green underline' : 'text-gray-400'}`}
                  onClick={() => setLang('en')}
                >EN</button>
                <span className="text-gray-500">|</span>
                <button
                  className={`font-bold text-xs ${lang === 'zh' ? 'text-retro-green underline' : 'text-gray-400'}`}
                  onClick={() => setLang('zh')}
                >CN</button>
                <span className="text-gray-500">|</span>
                <button
                  className={`font-bold text-xs ${lang === 'ja' ? 'text-retro-green underline' : 'text-gray-400'}`}
                  onClick={() => setLang('ja')}
                >JP</button>
                <span className="text-gray-500">|</span>
                <button
                  className={`font-bold text-xs ${lang === 'ko' ? 'text-retro-green underline' : 'text-gray-400'}`}
                  onClick={() => setLang('ko')}
                >KR</button>
              </div>
            </div>
          </div>
        </div>

        {/* 主导航栏 */}
        <nav className="px-2 sm:px-6 py-2 sm:py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-8 bg-retro-green relative">
                  <div className="absolute top-1 left-1 w-2 h-1 bg-black"></div>
                  <div className="absolute top-1 right-1 w-2 h-1 bg-black"></div>
                  <div className="absolute bottom-1 left-2 w-1 h-1 bg-black"></div>
                  <div className="absolute bottom-1 right-2 w-1 h-1 bg-black"></div>
                </div>
                <div className="absolute -top-1 -left-1 w-12 h-10 border-2 border-retro-green animate-glow"></div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-retro-green font-retro animate-glow">
                  GAME PUMP
                </h1>
                <p className="text-xs text-retro-cyan font-pixel">
                  {lang === 'en' ? 'Make Classic Games Great Again' : 
                   lang === 'zh' ? 'Make Classic Games Great Again' : 
                   lang === 'ja' ? 'Make Classic Games Great Again' : 
                   'Make Classic Games Great Again'}
                </p>
              </div>
            </div>

            {/* 主导航 */}
            <div className="hidden md:flex items-center space-x-4 sm:space-x-8">
              <button className="relative group text-white hover:text-retro-green transition-colors duration-300 font-retro text-sm">
                <span className="mr-2">🏠</span>
                {lang === 'en' ? 'Home' : lang === 'zh' ? '首页' : lang === 'ja' ? 'ホーム' : '홈'}
              </button>
              <button className="relative group text-white hover:text-retro-green transition-colors duration-300 font-retro text-sm">
                <span className="mr-2">🗳️</span>
                {lang === 'en' ? 'Voting' : lang === 'zh' ? '投票' : lang === 'ja' ? '投票' : '투표'}
              </button>
              <button className="relative group text-white hover:text-retro-green transition-colors duration-300 font-retro text-sm">
                <span className="mr-2">🪙</span>
                {lang === 'en' ? 'Tokens' : lang === 'zh' ? '代币' : lang === 'ja' ? 'トークン' : '토큰'}
              </button>
              <button className="relative group text-white hover:text-retro-green transition-colors duration-300 font-retro text-sm">
                <span className="mr-2">🗺️</span>
                {lang === 'en' ? 'Roadmap' : lang === 'zh' ? '路线图' : lang === 'ja' ? 'ロードマップ' : '로드맵'}
              </button>
              <button className="relative group text-white hover:text-retro-green transition-colors duration-300 font-retro text-sm">
                <span className="mr-2">🏆</span>
                {lang === 'en' ? 'Leaderboard' : lang === 'zh' ? '排行榜' : lang === 'ja' ? 'リーダーボード' : '리더보드'}
              </button>
              <button className="relative group text-white hover:text-retro-green transition-colors duration-300 font-retro text-sm">
                <span className="mr-2">👥</span>
                {lang === 'en' ? 'Community' : lang === 'zh' ? '社区' : lang === 'ja' ? 'コミュニティ' : '커뮤니티'}
              </button>
            </div>

            {/* 钱包连接按钮占位 */}
            <div className="bg-retro-green text-black px-4 py-2 rounded font-pixel text-sm">
              {lang === 'en' ? 'Connect Wallet' : lang === 'zh' ? '连接钱包' : lang === 'ja' ? 'ウォレット接続' : '지갑 연결'}
            </div>

            {/* 移动端菜单按钮 */}
            <button className="md:hidden text-retro-green text-2xl">☰</button>
          </div>
        </nav>
      </header>
    )
  })

  return <Header lang={lang} setLang={setLang} />
} 