'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
// 直接导入单个钱包适配器，避免依赖问题
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import TokenPocketWalletAdapter from './TokenPocketWalletAdapter';
import OKXWalletAdapter from './OKXWalletAdapter';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// 默认样式需要引入
require('@solana/wallet-adapter-react-ui/styles.css');
// 自定义钱包样式覆盖
require('../../styles/wallet-override.css');

interface WalletContextProviderProps {
  children: React.ReactNode;
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
  // 使用主网，配合后端的模拟余额逻辑
  const network = WalletAdapterNetwork.Mainnet;

  // 可以设置自定义RPC端点
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // 支持的钱包列表
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TokenPocketWalletAdapter(),
      new OKXWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default WalletContextProvider;