'use client'

import { useEffect } from 'react'
import WalletContextProvider from '@/components/wallet/WalletProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { UserProvider } from '@/contexts/UserContext'
import { setupWalletErrorHandler } from '@/utils/walletErrorHandler'
import { suppressAllErrors } from '@/utils/errorSuppressor'

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  // 设置全局钱包错误处理器和错误抑制器
  useEffect(() => {
    setupWalletErrorHandler();
    console.log('🔌 钱包错误处理器已启动');
    
    // 启动错误抑制器
    const stopSuppressor = suppressAllErrors();
    console.log('🔇 错误抑制器已启动');
    
    // 清理函数
    return () => {
      if (stopSuppressor) {
        stopSuppressor();
      }
    };
  }, []);

  return (
    <LanguageProvider>
      <WalletContextProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </WalletContextProvider>
    </LanguageProvider>
  )
}