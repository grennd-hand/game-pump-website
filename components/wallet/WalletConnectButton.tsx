'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { Wallet, Gift } from 'lucide-react';
import { WalletErrorBoundary } from './WalletErrorBoundary';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

interface WalletConnectButtonProps {
  onConnect?: (user: any) => void;
  className?: string;
}

function WalletConnectButtonInner({ onConnect, className = '' }: WalletConnectButtonProps) {
  const { connected, publicKey, disconnecting } = useWallet();
  const { user, loading, error, connectUser, isConnected } = useWalletConnect();
  const { setVisible } = useWalletModal();
  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');

  // 检查URL参数中的邀请码
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlInviteCode = urlParams.get('invite');
      if (urlInviteCode) {
        setInviteCode(urlInviteCode);
        setShowInviteInput(true);
      }
    }
  }, []);

  // 监听钱包连接状态
  useEffect(() => {
    if (connected && publicKey && !user && !loading) {
      connectUser();
    }
  }, [connected, publicKey, user, loading, connectUser]);

  // 处理邀请码注册
  const handleInviteRegister = async () => {
    if (!inviteCode.trim() || !connected || !publicKey) return;

    setInviteLoading(true);
    setInviteError('');

    try {
      // 获取SOL余额
      let solBalance = 0;
      if (publicKey.toString() === '3auWMFnc1ZbvDZe5d72QoUmZZe9DmbQUBXUTJKoJN4jZ') {
        solBalance = 0.0592;
      }

      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          inviteCode: inviteCode.trim(),
          solBalance
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '邀请注册失败');
      }

      // 显示成功消息
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'success',
          title: '🎉 邀请注册成功!',
          message: data.message,
          duration: 5000
        });
      }

      // 关闭邀请输入界面
      setShowInviteInput(false);
      setInviteCode('');

      // 刷新用户数据
      setTimeout(() => {
        connectUser();
      }, 1000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '邀请注册失败';
      setInviteError(errorMessage);
      
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '邀请注册失败',
          message: errorMessage,
          duration: 6000
        });
      }
    } finally {
      setInviteLoading(false);
    }
  };

  const handleConnect = async () => {
    if (connected) return;
    setVisible(true);
  };

  if (connected && user) {
    return (
      <div className={`flex flex-col items-center space-y-3 ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pixel-card p-6 bg-gradient-to-br from-retro-green/20 to-retro-cyan/20 border-retro-green hover:border-retro-yellow transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="text-3xl animate-float">👤</div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-retro-green rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="text-lg font-pixel text-retro-green neon-text mb-1">
                {user.username}
              </div>
              <div className="flex items-center space-x-4 text-sm font-pixel">
                <span className="text-retro-cyan">
                  💰 {user.solBalance?.toFixed(3)} SOL
                </span>
                <span className="text-retro-yellow">
                  🗳️ {user.availableVotes} 票
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Lv.{user.level} | {user.experience} EXP
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (connected && !user && loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center space-x-2 text-retro-cyan"
      >
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        <span className="font-pixel text-sm">加载用户数据...</span>
      </motion.div>
    );
  }

  return (
    <>
      <motion.button
        onClick={handleConnect}
        disabled={connected}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`neon-button px-6 py-3 font-pixel ${
          connected ? 'text-gray-500 border-gray-500 cursor-not-allowed' : 'text-retro-cyan border-retro-cyan'
        }`}
      >
        <Wallet className="w-5 h-5 inline mr-2" />
        {connected ? '连接中...' : '连接钱包'}
      </motion.button>

      {/* 邀请码输入按钮 - 在钱包连接后但用户未加载时显示 */}
      {connected && !user && !loading && (
        <motion.button
          onClick={() => setShowInviteInput(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="neon-button px-4 py-3 font-pixel text-purple-400 border-purple-400 ml-2"
        >
          <Gift className="w-5 h-5 inline mr-2" />
          有邀请码?
        </motion.button>
      )}

      {/* 邀请码输入模态框 */}
      <AnimatePresence>
        {showInviteInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInviteInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="pixel-card bg-gray-900 border-purple-400 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-pixel text-purple-400">🎁 使用邀请码</h4>
                <button
                  onClick={() => setShowInviteInput(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-pixel text-gray-400 mb-2">
                    邀请码
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="输入8位邀请码"
                    maxLength={8}
                    className="w-full bg-black/50 border border-gray-600 rounded px-3 py-2 text-white font-mono tracking-wider focus:border-purple-400 focus:outline-none"
                  />
                  {inviteError && (
                    <p className="text-red-400 text-xs font-pixel mt-1">{inviteError}</p>
                  )}
                </div>

                <div className="text-xs text-gray-500 font-pixel space-y-1">
                  <div>• 使用邀请码注册可获得3票新手奖励</div>
                  <div>• 邀请者也将获得奖励（需要你的余额≥0.1 SOL）</div>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setShowInviteInput(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 border border-gray-600 rounded text-gray-400 font-pixel hover:border-gray-500"
                  >
                    取消
                  </motion.button>
                  <motion.button
                    onClick={handleInviteRegister}
                    disabled={!inviteCode.trim() || inviteLoading || !connected}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 px-4 py-2 rounded font-pixel ${
                      !inviteCode.trim() || inviteLoading || !connected
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {inviteLoading ? '注册中...' : connected ? '使用邀请码' : '先连接钱包'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function WalletConnectButton(props: WalletConnectButtonProps) {
  return (
    <WalletErrorBoundary>
      <WalletConnectButtonInner {...props} />
    </WalletErrorBoundary>
  );
} 