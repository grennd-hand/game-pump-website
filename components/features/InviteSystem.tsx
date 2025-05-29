'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Share2, Copy, Gift, ExternalLink, UserPlus } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { createPortal } from 'react-dom';

interface InviteInfo {
  inviteCode: string;
  inviteStats: {
    totalInvites: number;
    totalRewards: number;
    invitedUsers: Array<{
      walletAddress: string;
      username: string;
      joinedAt: string;
      level: number;
    }>;
  };
  shareUrl: string;
}

export default function InviteSystem() {
  const { publicKey, connected } = useWallet();
  const { user, refreshUser } = useWalletConnect();
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPyramidView, setShowPyramidView] = useState(false);

  // 获取邀请信息
  useEffect(() => {
    if (connected && publicKey) {
      fetchInviteInfo();
    } else {
      // 未连接钱包时显示默认信息
      setInviteInfo({
        inviteCode: 'CONNECT_WALLET',
        inviteStats: {
          totalInvites: 0,
          totalRewards: 0,
          invitedUsers: []
        },
        shareUrl: `${window.location.origin}?invite=CONNECT_WALLET`
      });
    }
  }, [connected, publicKey]);

  const fetchInviteInfo = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/users/invite?wallet=${publicKey.toString()}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInviteInfo({
            inviteCode: data.inviteCode,
            inviteStats: data.inviteStats,
            shareUrl: data.shareUrl
          });
        } else {
          throw new Error(data.error || 'API调用失败');
        }
      } else {
        // API失败时使用默认数据
        setInviteInfo({
          inviteCode: publicKey.toString().slice(0, 8).toUpperCase(),
          inviteStats: {
            totalInvites: 0,
            totalRewards: 0,
            invitedUsers: []
          },
          shareUrl: `${window.location.origin}?invite=${publicKey.toString().slice(0, 8).toUpperCase()}`
        });
      }
    } catch (error) {
      console.error('获取邀请信息失败:', error);
      // 错误时使用默认数据
      setInviteInfo({
        inviteCode: publicKey.toString().slice(0, 8).toUpperCase(),
        inviteStats: {
          totalInvites: 0,
          totalRewards: 0,
          invitedUsers: []
        },
        shareUrl: `${window.location.origin}?invite=${publicKey.toString().slice(0, 8).toUpperCase()}`
      });
    } finally {
      setLoading(false);
    }
  };

  // 复制邀请链接
  const copyInviteLink = async () => {
    const shareUrl = inviteInfo?.shareUrl || `${window.location.origin}?invite=CONNECT_WALLET`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  // 渲染邀请金字塔
  const renderPyramid = () => {
    if (!inviteInfo) return null;

    const { invitedUsers } = inviteInfo.inviteStats;
    
    // 按层级分组用户（目前只有一级邀请）
    const usersByLevel = invitedUsers.reduce((acc, user) => {
      const level = 0; // 目前只支持直接邀请，都是第0层
      if (!acc[level]) acc[level] = [];
      acc[level].push(user);
      return acc;
    }, {} as Record<number, typeof invitedUsers>);

    const maxLevel = Math.max(...Object.keys(usersByLevel).map(Number), -1);

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm">你的邀请网络层级结构</p>
        </div>

        {maxLevel === -1 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏔️</div>
            <p className="text-gray-400">还没有邀请用户</p>
            <p className="text-sm text-gray-500 mt-2">分享你的邀请链接开始建立你的金字塔！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from({ length: maxLevel + 1 }, (_, level) => (
              <div key={level} className="text-center">
                <div className="text-sm text-gray-400 mb-2">第 {level + 1} 层 (直接邀请)</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {usersByLevel[level]?.map((user, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="pixel-card bg-gray-800 border-yellow-400 p-3 text-xs"
                    >
                      <div className="text-yellow-400 font-pixel">
                        {user.walletAddress ? 
                          `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` :
                          user.username || '未知用户'
                        }
                      </div>
                      <div className="text-gray-400 mt-1">
                        等级: Lv.{user.level || 1}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '未知时间'}
                      </div>
                    </motion.div>
                  )) || (
                    <div className="text-gray-500 text-sm py-4">
                      此层级暂无用户
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-yellow-400/30">
          <h4 className="text-yellow-400 font-pixel mb-2">奖励规则</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <div>• 直接邀请: 每人奖励 3 票 (需要被邀请者余额≥0.1 SOL)</div>
            <div>• 邀请奖励: 立即到账，可用于投票</div>
            <div>• 经验奖励: 有效邀请+30 EXP，无效邀请+10 EXP</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="pixel-card bg-gray-900 border-purple-400 p-6">
        <div className="text-center">
          <div className="animate-spin text-2xl mb-2">⚡</div>
          <p className="text-purple-400">加载邀请信息中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-card bg-gray-900 border-purple-400 p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-pixel text-purple-400 mb-2">🎯 邀请系统</h3>
        <p className="text-gray-400 text-sm">邀请朋友，获得奖励票数</p>
      </div>

      {/* 邀请统计 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="pixel-card bg-gray-800 border-cyan-400 p-4 text-center">
          <div className="text-2xl font-pixel text-cyan-400">
            {inviteInfo?.inviteStats.totalInvites || 0}
          </div>
          <div className="text-sm text-gray-400">邀请人数</div>
        </div>
        <div className="pixel-card bg-gray-800 border-green-400 p-4 text-center">
          <div className="text-2xl font-pixel text-green-400">
            {inviteInfo?.inviteStats.totalRewards || 0}
          </div>
          <div className="text-sm text-gray-400">获得票数</div>
        </div>
      </div>

      {/* 邀请码显示 */}
      <div className="pixel-card bg-gray-800 border-yellow-400 p-4 mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">你的邀请码</div>
          <div className="text-lg font-pixel text-yellow-400">
            {connected ? (inviteInfo?.inviteCode || 'LOADING...') : '连接钱包后生成'}
          </div>
        </div>
      </div>

      {/* 按钮 */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyInviteLink}
          className="neon-button-sm text-retro-cyan border-retro-cyan px-4 py-2 text-sm"
        >
          {copied ? '✅ 已复制' : '🔗 分享邀请链接'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPyramidView(true)}
          className="neon-button-sm text-yellow-400 border-yellow-400 px-4 py-2 text-sm"
        >
          🏔️ 查看邀请金字塔
        </motion.button>
      </div>

      {/* 邀请金字塔悬浮模态框 */}
      {showPyramidView && typeof window !== 'undefined' && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowPyramidView(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="pixel-card bg-gray-900 border-yellow-400 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
            style={{
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none', /* IE and Edge */
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-pixel text-yellow-400">🏆 邀请金字塔</h4>
              <button
                onClick={() => setShowPyramidView(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            {renderPyramid()}
          </motion.div>
        </motion.div>,
        document.body
      )}

      {/* 邀请奖励说明 */}
      <div className="text-center text-sm text-gray-500">
        <p>💡 邀请朋友参与投票，获得额外票数奖励</p>
        <p className="mt-1">分享链接: {inviteInfo?.shareUrl || '连接钱包后生成'}</p>
      </div>
    </div>
  );
} 