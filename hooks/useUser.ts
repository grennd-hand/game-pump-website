import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

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

export function useUser() {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取或创建用户
  const fetchUser = async (walletAddress: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        setError(data.error || '获取用户信息失败');
      }
    } catch (err) {
      setError('网络错误');
      console.error('获取用户信息错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 更新用户信息
  const updateUser = async (updateData: Partial<User>) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.walletAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        return data.user;
      } else {
        setError(data.error || '更新用户信息失败');
      }
    } catch (err) {
      setError('网络错误');
      console.error('更新用户信息错误:', err);
    }
  };

  // 当钱包连接状态改变时
  useEffect(() => {
    if (connected && publicKey) {
      fetchUser(publicKey.toString());
    } else {
      setUser(null);
    }
  }, [connected, publicKey]);

  return {
    user,
    loading,
    error,
    updateUser,
    refetch: () => {
      if (publicKey) {
        fetchUser(publicKey.toString());
      }
    }
  };
}