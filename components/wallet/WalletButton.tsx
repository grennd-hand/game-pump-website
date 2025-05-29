 'use client';

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Trophy, Vote } from 'lucide-react';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { quickHideErrors, suppressAllErrors } from '@/utils/errorSuppressor';

interface WalletButtonProps {
  lang: 'en' | 'zh' | 'ja' | 'ko'
}

export function WalletButton({ lang }: WalletButtonProps) {
  const { wallet, connect, disconnect, publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { user, loading: userLoading, refreshUser, connectUser } = useWalletConnect();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  // 监听钱包连接状态，自动获取用户数据
  React.useEffect(() => {
    console.log('🔍 WalletButton状态检查:', {
      connected,
      publicKey: publicKey?.toString(),
      hasUser: !!user,
      userLoading,
      userBalance: user?.solBalance,
      walletName: wallet?.adapter.name
    });
    
    // 只在钱包刚连接且没有用户数据时尝试一次
    if (connected && publicKey && !user && !userLoading) {
      console.log('🔗 钱包已连接，自动获取用户数据...');
      connectUser();
    }
  }, [connected, publicKey]); // 移除依赖，避免无限循环

  // 监听钱包选择状态，自动连接
  React.useEffect(() => {
    if (wallet && !connected && wallet.readyState === 'Installed' && !isDisconnecting) {
      console.log('🔗 钱包已选择，自动连接:', wallet.adapter.name);
      connect().catch(error => {
        console.error('自动连接失败:', error);
      });
    }
  }, [wallet, connected, connect, isDisconnecting]);

  // 重置断开连接状态
  React.useEffect(() => {
    if (!connected) {
      setIsDisconnecting(false);
    }
  }, [connected]);

  // 多语言文案
  const textMap = {
    en: {
      connectWallet: "Connect Wallet",
      copyAddress: "Copy Address", 
      viewOnExplorer: "View on Explorer",
      disconnect: "Disconnect"
    },
    zh: {
      connectWallet: "连接钱包",
      copyAddress: "复制地址",
      viewOnExplorer: "在浏览器中查看", 
      disconnect: "断开连接"
    },
    ja: {
      connectWallet: "ウォレット接続",
      copyAddress: "アドレスをコピー",
      viewOnExplorer: "エクスプローラーで表示",
      disconnect: "切断"
    },
    ko: {
      connectWallet: "지갑 연결",
      copyAddress: "주소 복사",
      viewOnExplorer: "탐색기에서 보기",
      disconnect: "연결 해제"
    }
  }

  const t = textMap[lang]

  // 格式化钱包地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // 复制地址到剪贴板
  const copyAddress = async () => {
    try {
      if (publicKey) {
        await navigator.clipboard.writeText(publicKey.toString());
        console.log('地址已复制到剪贴板');
        // 可以添加toast提示
      }
    } catch (error) {
      console.error('复制地址失败:', error);
      // 备用方案：选择文本
      const textArea = document.createElement('textarea');
      textArea.value = publicKey?.toString() || '';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  // 在Solana浏览器中查看地址
  const viewOnExplorer = () => {
    if (publicKey) {
      window.open(`https://explorer.solana.com/address/${publicKey.toString()}`, '_blank');
    }
  };

  // 更新用户名
  const updateUsername = async () => {
    if (!publicKey || !newUsername.trim()) {
      return;
    }

    setIsUpdatingUsername(true);
    try {
      const response = await fetch('/api/user/update-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          username: newUsername.trim()
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // 刷新用户数据
        await refreshUser();
        setIsEditingUsername(false);
        setNewUsername('');
        console.log('✅ 用户名更新成功:', result.message);
      } else {
        console.error('❌ 用户名更新失败:', result.error);
        alert(result.error);
      }
    } catch (error) {
      console.error('❌ 更新用户名请求失败:', error);
      alert('更新失败，请重试');
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  // 开始编辑用户名
  const startEditUsername = () => {
    setIsEditingUsername(true);
    setNewUsername(user?.username || '');
  };

  // 取消编辑用户名
  const cancelEditUsername = () => {
    setIsEditingUsername(false);
    setNewUsername('');
  };

  const handleConnect = async () => {
    // 始终打开钱包选择模态框，让用户选择要连接的钱包
    setVisible(true);
  };

  if (connected && publicKey) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="pixel-btn bg-transparent border-2 border-retro-green text-retro-green hover:bg-retro-green hover:text-black px-4 py-2 flex items-center gap-2 text-sm font-mono transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-2 h-2 bg-retro-green rounded-full animate-pulse"></div>
          {formatAddress(publicKey.toString())}
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border-2 border-green-400 rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                {wallet?.adapter.icon && (
                  <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-6 h-6" />
                )}
                <span className="font-mono text-green-400">{wallet?.adapter.name}</span>
              </div>
              <div className="text-xs text-gray-400 font-mono break-all mb-3">
                {publicKey.toString()}
              </div>
              
              {/* 刷新按钮 */}
              <button
                onClick={() => {
                  console.log('🔄 手动刷新用户数据')
                  refreshUser()
                }}
                className="text-xs text-blue-400 hover:text-blue-300 mb-2 flex items-center gap-1"
              >
                🔄 刷新余额
              </button>
              
              {/* 用户统计信息 */}
              {user && !userLoading && (
                <div className="space-y-1 text-xs">
                  {/* 用户名显示和编辑 */}
                  <div className="mb-3 p-2 bg-gray-800 rounded">
                    {isEditingUsername ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="输入新用户名..."
                          className="w-full bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600 focus:border-blue-400 focus:outline-none"
                          disabled={isUpdatingUsername}
                          maxLength={20}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              updateUsername();
                            } else if (e.key === 'Escape') {
                              cancelEditUsername();
                            }
                          }}
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={updateUsername}
                            disabled={isUpdatingUsername || !newUsername.trim()}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded transition-colors"
                          >
                            {isUpdatingUsername ? '更新中...' : '确认'}
                          </button>
                          <button
                            onClick={cancelEditUsername}
                            disabled={isUpdatingUsername}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white text-xs py-1 px-2 rounded transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-400">用户名</div>
                          <div className="text-white font-mono">
                            {user.username || `Player_${publicKey.toString().slice(-6)}`}
                          </div>
                        </div>
                        <button
                          onClick={startEditUsername}
                          className="text-blue-400 hover:text-blue-300 text-xs"
                          title="编辑用户名"
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-green-400">余额</span>
                    <span className="text-green-400 font-mono">{user.solBalance?.toFixed(4) || '0.0000'} SOL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400">可用投票</span>
                    <span className="text-blue-400">{user.availableVotes || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400">等级</span>
                    <span className="text-yellow-400">Lv.{user.level}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors"
              >
                <Copy className="w-4 h-4" />
                {t.copyAddress}
              </button>
              
              <button
                onClick={viewOnExplorer}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {t.viewOnExplorer}
              </button>
              
              <hr className="my-2 border-gray-700" />
              
              <button
                onClick={async () => {
                  console.log('🔌 手动断开钱包连接');
                  setIsDisconnecting(true);
                  setIsDropdownOpen(false);
                  
                  // 立即启动错误抑制器
                  const stopSuppressor = suppressAllErrors();
                  
                  // 快速隐藏现有错误
                  quickHideErrors();
                  
                  try {
                    // 断开钱包连接
                    await disconnect();
                    
                    // 清除本地存储中的钱包状态
                    localStorage.removeItem('walletName');
                    localStorage.removeItem('wallet-adapter');
                    
                    // 清除可能的其他钱包相关存储
                    const keysToRemove = [];
                    for (let i = 0; i < localStorage.length; i++) {
                      const key = localStorage.key(i);
                      if (key && (key.includes('wallet') || key.includes('solana'))) {
                        keysToRemove.push(key);
                      }
                    }
                    keysToRemove.forEach(key => localStorage.removeItem(key));
                    
                    // 再次快速隐藏错误提示
                    quickHideErrors();
                    
                    console.log('✅ 钱包连接已完全断开，刷新页面');
                    
                    // 断开连接后立即刷新页面
                    setTimeout(() => {
                      if (stopSuppressor) stopSuppressor();
                      window.location.reload();
                    }, 100);
                  } catch (error) {
                    console.error('❌ 断开连接失败:', error);
                    // 隐藏错误提示
                    quickHideErrors();
                    // 即使断开失败也刷新页面
                    setTimeout(() => {
                      if (stopSuppressor) stopSuppressor();
                      window.location.reload();
                    }, 100);
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t.disconnect}
              </button>
            </div>
          </motion.div>
        )}

        {/* 点击外部关闭下拉菜单 */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <motion.button
      onClick={handleConnect}
      className="pixel-btn bg-transparent border-2 border-retro-green text-retro-green hover:bg-retro-green hover:text-black px-4 py-2 flex items-center gap-2 text-sm font-mono transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Wallet className="w-4 h-4" />
      {t.connectWallet}
    </motion.button>
  );
}

export default WalletButton;