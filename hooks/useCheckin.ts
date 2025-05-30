'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletConnect } from './useWalletConnect';

interface User {
  _id: string;
  walletAddress: string;
  username?: string;
  avatar?: string;
  totalVotes: number;
  totalTokens: number;
  availableVotes: number;
  solBalance?: number;
  level: number;
  achievements: string[];
  joinedAt: string;
  lastActive: string;
  dailyCheckin: {
    lastCheckinDate?: string;
    consecutiveDays: number;
    totalCheckins: number;
  };
  inviteRewards: {
    totalInvites: number;
    totalRewards: number;
  };
}

interface CheckinStatus {
  canCheckin: boolean;
  dailyCheckin: {
    lastCheckinDate?: string;
    consecutiveDays: number;
    totalCheckins: number;
  };
  nextReward: {
    votes: number;
    daysUntilBonus: number;
  };
}

interface CheckinReward {
  votes: number;
  consecutiveDays: number;
  totalCheckins: number;
}

// 导入全局事件发射器
const USER_DATA_UPDATE_EVENT = 'userDataUpdate';
const emitUserDataUpdate = (user: any) => {
  const event = new CustomEvent(USER_DATA_UPDATE_EVENT, { detail: user });
  window.dispatchEvent(event);
  console.log('📢 useCheckin发射用户数据更新事件:', user.availableVotes, '票');
};

export function useCheckin() {
  const { publicKey, connected } = useWallet();
  const { user, refreshUser } = useWalletConnect();
  const [checkinStatus, setCheckinStatus] = useState<CheckinStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [lastReward, setLastReward] = useState<CheckinReward | null>(null);

  // 计算签到奖励票数
  const calculateCheckinReward = useCallback((consecutiveDays: number) => {
    if (consecutiveDays >= 7) {
      return 3; // 连续7天及以上：3票
    } else if (consecutiveDays >= 3) {
      return 2; // 连续3-6天：2票
    } else {
      // 前3天随机获得1-3票
      return Math.floor(Math.random() * 3) + 1; // 随机1-3票
    }
  }, []);

  // 计算下次奖励信息（显示用）
  const calculateNextReward = useCallback((consecutiveDays: number) => {
    let currentReward: number;
    let daysUntilBonus = 0;
    
    if (consecutiveDays + 1 >= 7) {
      currentReward = 3; // 连续7天及以上：3票
    } else if (consecutiveDays + 1 >= 3) {
      currentReward = 2; // 连续3-6天：2票
      if (consecutiveDays < 6) {
        daysUntilBonus = 7 - (consecutiveDays + 1); // 距离7天奖励的天数
      }
    } else {
      // 前3天显示随机范围，使用特殊值表示随机
      currentReward = -1; // 特殊值表示随机1-3票
      daysUntilBonus = 3 - (consecutiveDays + 1); // 距离3天奖励的天数
    }
    
    return {
      votes: currentReward,
      daysUntilBonus: Math.max(0, daysUntilBonus)
    };
  }, []);

  // 检查是否可以签到
  const canCheckinToday = useCallback(() => {
    if (!user || !(user as any).dailyCheckin) return true;
    
    const today = new Date();
    const lastCheckin = (user as any).dailyCheckin.lastCheckinDate ? 
      new Date((user as any).dailyCheckin.lastCheckinDate) : null;
    
    if (!lastCheckin) return true;
    
    return today.toDateString() !== lastCheckin.toDateString();
  }, [user]);

  // 获取签到状态
  const fetchCheckinStatus = useCallback(async () => {
    if (!publicKey || !connected) {
      setCheckinStatus(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/checkin?wallet=${publicKey.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCheckinStatus(data);
      } else {
        // API失败时使用用户数据创建默认状态
        if (user && (user as any).dailyCheckin) {
          const dailyCheckin = (user as any).dailyCheckin;
          const canCheckin = canCheckinToday();
          const nextReward = calculateNextReward(dailyCheckin.consecutiveDays || 0);
          
          setCheckinStatus({
            canCheckin,
            dailyCheckin: {
              lastCheckinDate: dailyCheckin.lastCheckinDate,
              consecutiveDays: dailyCheckin.consecutiveDays || 0,
              totalCheckins: dailyCheckin.totalCheckins || 0
            },
            nextReward
          });
        }
      }
    } catch (error) {
      console.error('获取签到状态失败:', error);
      // 错误时使用用户数据创建默认状态
      if (user && (user as any).dailyCheckin) {
        const dailyCheckin = (user as any).dailyCheckin;
        const canCheckin = canCheckinToday();
        const nextReward = calculateNextReward(dailyCheckin.consecutiveDays || 0);
        
        setCheckinStatus({
          canCheckin,
          dailyCheckin: {
            lastCheckinDate: dailyCheckin.lastCheckinDate,
            consecutiveDays: dailyCheckin.consecutiveDays || 0,
            totalCheckins: dailyCheckin.totalCheckins || 0
          },
          nextReward
        });
      }
    } finally {
      setLoading(false);
    }
  }, [publicKey, connected, user, calculateNextReward]);

  // 执行签到
  const handleCheckin = useCallback(async () => {
    if (!publicKey || !connected || checking) return { success: false, error: '钱包未连接' };

    setChecking(true);
    try {
      const response = await fetch('/api/users/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLastReward({
          votes: data.rewardVotes,
          consecutiveDays: data.consecutiveDays,
          totalCheckins: data.totalCheckins
        });
        
        // 更新签到状态
        setCheckinStatus(prev => prev ? {
          ...prev,
          canCheckin: false,
          dailyCheckin: {
            lastCheckinDate: new Date().toISOString(),
            consecutiveDays: data.consecutiveDays,
            totalCheckins: data.totalCheckins
          }
        } : null);
        
        // 刷新用户数据
        if (refreshUser) {
          const refreshResult = await refreshUser();
          if (refreshResult && refreshResult.user) {
            // 发射用户数据更新事件
            emitUserDataUpdate(refreshResult.user);
          }
        }
        
        // 显示奖励动画
        setTimeout(() => setLastReward(null), 5000);
        
        return { 
          success: true, 
          data: {
            rewardVotes: data.rewardVotes,
            consecutiveDays: data.consecutiveDays
          }
        };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('签到请求失败:', error);
      return { success: false, error: '网络错误，请重试' };
    } finally {
      setChecking(false);
    }
  }, [publicKey, connected, checking, refreshUser]);

  // 监听钱包连接状态和用户数据变化
  useEffect(() => {
    if (connected && publicKey) {
      fetchCheckinStatus();
    } else {
      setCheckinStatus(null);
    }
  }, [connected, publicKey, user, fetchCheckinStatus]);

  return {
    checkinStatus,
    loading,
    checking,
    lastReward,
    canCheckinToday,
    handleCheckin,
    fetchCheckinStatus
  };
} 