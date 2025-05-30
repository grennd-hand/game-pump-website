'use client'

import React, { ReactNode } from 'react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { clusterApiUrl } from '@solana/web3.js'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { UserProvider } from '@/contexts/UserContext'

// 导入钱包适配器UI样式
require('@solana/wallet-adapter-react-ui/styles.css')

// 错误边界组件
class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo)
    
    // 如果是DOM删除错误，尝试强制刷新
    if (error.message?.includes('removeChild') || error.message?.includes('Node')) {
      console.log('🚨 检测到DOM删除错误，将在3秒后自动刷新页面')
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">⚠️ 应用出现错误</h1>
            <p className="text-gray-400 mb-4">页面将在3秒后自动刷新...</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
            >
              立即刷新
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 网络配置 - 使用主网以确保钱包兼容性
const network = WalletAdapterNetwork.Mainnet
const endpoint = clusterApiUrl(network)

// 钱包适配器
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
]

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
    <LanguageProvider>
        <UserProvider>
                <ErrorBoundary>
          {children}
                </ErrorBoundary>
        </UserProvider>
    </LanguageProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ErrorBoundary>
  )
}