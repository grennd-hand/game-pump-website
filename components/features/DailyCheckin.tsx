'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCheckin } from '@/hooks/useCheckin';

export default function DailyCheckin() {
  const { connected } = useWallet();
  const { 
    checkinStatus, 
    loading, 
    checking, 
    lastReward, 
    canCheckinToday, 
    handleCheckin 
  } = useCheckin();

  // 处理签到按钮点击
  const onCheckinClick = async () => {
    if (!connected) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'warning',
          title: '需要连接钱包',
          message: '请先连接钱包以进行每日签到',
          duration: 3000
        });
      } else {
        alert('请先连接钱包以进行每日签到');
      }
      return;
    }

    const result = await handleCheckin();
    
    if (result.success) {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'success',
          title: '🎉 签到成功！',
          message: `获得 ${result.data?.rewardVotes} 票！连续签到 ${result.data?.consecutiveDays} 天`,
          duration: 4000
        });
      }
    } else {
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '❌ 签到失败',
          message: result.error || '签到失败，请重试',
          duration: 3000
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pixel-card p-6"
    >
      <h3 className="text-xl font-retro text-retro-cyan mb-4 flex items-center">
        <span className="mr-2">📅</span>
        每日签到
      </h3>

      <div className="text-center mb-6">
        {connected && loading ? (
          <div className="text-gray-400 font-pixel mb-4">
            加载签到状态中...
          </div>
        ) : connected && checkinStatus ? (
          <>
            {/* 签到统计 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-yellow game-score">{checkinStatus.dailyCheckin.consecutiveDays}</div>
                <div className="text-sm text-gray-400 font-pixel">连续天数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-cyan game-score">{checkinStatus.dailyCheckin.totalCheckins}</div>
                <div className="text-sm text-gray-400 font-pixel">总签到数</div>
              </div>
            </div>
            
            {/* 奖励预览 */}
            <div className="bg-gray-800 border border-gray-600 rounded px-4 py-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-retro-cyan font-pixel text-sm">今日奖励</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-pixel text-retro-yellow">
                    {checkinStatus.nextReward.votes === -1 ? '1-3' : checkinStatus.nextReward.votes} 票
                  </span>
                </div>
              </div>
              
              {checkinStatus.nextReward.daysUntilBonus > 0 && (
                <div className="mt-2 text-xs text-gray-400 font-pixel">
                  再签到 {checkinStatus.nextReward.daysUntilBonus} 天获得额外奖励
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* 默认显示 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-yellow game-score">0</div>
                <div className="text-sm text-gray-400 font-pixel">连续天数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-cyan game-score">0</div>
                <div className="text-sm text-gray-400 font-pixel">总签到数</div>
              </div>
            </div>
            
            {/* 默认奖励预览 */}
            <div className="bg-gray-800 border border-gray-600 rounded px-4 py-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-retro-cyan font-pixel text-sm">今日奖励</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-pixel text-retro-yellow">
                    1-3 票
                  </span>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-400 font-pixel">
                {connected ? '前3天随机获得 1-3 票' : '连续签到获得更多奖励'}
              </div>
            </div>
          </>
        )}
        
        {/* 签到按钮 */}
        <div className="mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCheckinClick}
            disabled={connected && checkinStatus ? (!checkinStatus.canCheckin || checking) : false}
            className={`w-full neon-button-sm px-4 py-3 text-sm ${
              connected && checkinStatus && checkinStatus.canCheckin && !checking
                ? 'text-retro-cyan border-retro-cyan'
                : connected && checkinStatus && !checkinStatus.canCheckin
                ? 'text-gray-500 border-gray-500 opacity-50 cursor-not-allowed'
                : 'text-retro-cyan border-retro-cyan'
            }`}
          >
            {connected && checking ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-retro-cyan border-t-transparent rounded-full animate-spin"></div>
                签到中...
              </div>
            ) : connected && checkinStatus && !checkinStatus.canCheckin ? (
              '今日已签到'
            ) : (
              '立即签到'
            )}
          </motion.button>
        </div>
        
        {/* 签到奖励说明 */}
        <div className="text-left">
          <h4 className="text-sm font-retro text-retro-cyan mb-2">📅 签到奖励</h4>
          <ul className="text-xs text-gray-400 font-pixel space-y-1">
            <li>• 前3天随机获得 1-3 票</li>
            <li>• 连续 3 天：固定 2 票</li>
            <li>• 连续 7 天：固定 3 票</li>
          </ul>
        </div>
      </div>

      {/* 奖励动画 */}
      {lastReward && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -20 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="pixel-card bg-green-900/90 border-green-400 p-6 text-center">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <div className="text-xl font-pixel text-green-400 mb-2">签到成功！</div>
            <div className="space-y-2">
              <div className="text-blue-400">+{lastReward.votes} 票</div>
              <div className="text-gray-400">连续 {lastReward.consecutiveDays} 天</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 