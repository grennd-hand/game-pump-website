'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface User {
  _id: string;
  walletAddress: string;
  connectedAt: string;
  totalVotes: number;
  lastVoteTime?: string;
  isActive: boolean;
}

interface UserVoteHistory {
  userId: string;
  gameId: string;
  gameName: string;
  gameIcon: string;
  votedAt: string;
}

interface UserStats {
  summary: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    totalVotes: number;
    avgVotesPerUser: number;
    avgVotesPerActiveUser: number;
  };
  voteDistribution: {
    noVotes: number;
    oneVote: number;
    twoToFive: number;
    sixToTen: number;
    moreThanTen: number;
  };
  topGames: Array<[string, number]>;
  topUsers: Array<{
    walletAddress: string;
    totalVotes: number;
    gamesVoted: number;
    displayAddress: string;
  }>;
  userRetention: {
    activeRate: number;
    inactiveRate: number;
  };
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [voteHistory, setVoteHistory] = useState<UserVoteHistory[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  // 获取用户数据
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('获取用户数据失败:', error);
    }
  };

  // 获取投票历史
  const fetchVoteHistory = async () => {
    try {
      const response = await fetch('/api/admin/vote-history');
      const data = await response.json();
      setVoteHistory(data.history || []);
    } catch (error) {
      console.error('获取投票历史失败:', error);
    }
  };

  // 获取用户统计报告
  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/admin/user-stats');
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('获取用户统计失败:', error);
    }
  };

  // 删除单个用户
  const deleteUser = async (walletAddress: string) => {
    if (!confirm(`确定要删除用户 ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} 吗？`)) {
      return;
    }
    
    setOperationLoading(walletAddress);
    try {
      const response = await fetch('/api/admin/users/single', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        fetchUsers();
        fetchVoteHistory();
      } else {
        alert(`删除失败: ${result.error}`);
      }
    } catch (error) {
      alert('删除操作失败');
    } finally {
      setOperationLoading(null);
    }
  };

  // 重置用户投票
  const resetUserVotes = async (walletAddress: string) => {
    if (!confirm(`确定要重置用户 ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} 的投票记录吗？`)) {
      return;
    }
    
    setOperationLoading(walletAddress);
    try {
      const response = await fetch('/api/admin/users/reset-votes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        fetchUsers();
        fetchVoteHistory();
      } else {
        alert(`重置失败: ${result.error}`);
      }
    } catch (error) {
      alert('重置操作失败');
    } finally {
      setOperationLoading(null);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchVoteHistory(), fetchUserStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-white text-xl">加载用户数据中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计控制面板 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">📊 用户数据分析</h3>
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-medium transition-all"
          >
            {showStats ? '隐藏详细统计' : '显示详细统计'}
          </button>
        </div>
      </motion.div>

      {/* 详细统计报告 */}
      {showStats && userStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 用户留存率 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h4 className="text-lg font-bold mb-4">📈 用户留存分析</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{userStats.userRetention.activeRate}%</div>
                <div className="text-sm text-gray-300">活跃用户率</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{userStats.userRetention.inactiveRate}%</div>
                <div className="text-sm text-gray-300">非活跃用户率</div>
              </div>
            </div>
          </div>

          {/* 投票分布 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h4 className="text-lg font-bold mb-4">🗳️ 投票行为分布</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-gray-400">{userStats.voteDistribution.noVotes}</div>
                <div className="text-xs">未投票</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{userStats.voteDistribution.oneVote}</div>
                <div className="text-xs">1票</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{userStats.voteDistribution.twoToFive}</div>
                <div className="text-xs">2-5票</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">{userStats.voteDistribution.sixToTen}</div>
                <div className="text-xs">6-10票</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{userStats.voteDistribution.moreThanTen}</div>
                <div className="text-xs">10票以上</div>
              </div>
            </div>
          </div>

          {/* 热门游戏和活跃用户 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 热门游戏 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-bold mb-4">🎮 热门游戏排行</h4>
              <div className="space-y-3">
                {userStats.topGames.map(([game, voters], index) => (
                  <div key={game} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400 font-bold">#{index + 1}</span>
                      <span>{game}</span>
                    </div>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded">
                      {voters} 人投票
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 活跃用户 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-lg font-bold mb-4">⭐ 最活跃用户</h4>
              <div className="space-y-3">
                {userStats.topUsers.map((user, index) => (
                  <div key={user.walletAddress} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400 font-bold">#{index + 1}</span>
                      <span className="font-mono text-sm">{user.displayAddress}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{user.totalVotes} 票</div>
                      <div className="text-xs text-gray-400">{user.gamesVoted} 游戏</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 用户统计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-cyan-400">{users.length}</div>
          <div className="text-sm text-gray-300">总用户数</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-400">
            {users.filter(u => u.isActive).length}
          </div>
          <div className="text-sm text-gray-300">活跃用户</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400">
            {users.reduce((sum, u) => sum + u.totalVotes, 0)}
          </div>
          <div className="text-sm text-gray-300">总投票数</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-400">
            {Math.round(users.reduce((sum, u) => sum + u.totalVotes, 0) / users.length || 0)}
          </div>
          <div className="text-sm text-gray-300">平均投票数</div>
        </div>
      </motion.div>

      {/* 用户列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
      >
        <h3 className="text-xl font-bold mb-4">👥 用户列表</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/20">
                <th className="pb-3 text-gray-300">钱包地址</th>
                <th className="pb-3 text-gray-300">投票数</th>
                <th className="pb-3 text-gray-300">连接时间</th>
                <th className="pb-3 text-gray-300">最后投票</th>
                <th className="pb-3 text-gray-300">状态</th>
                <th className="pb-3 text-gray-300">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="py-3">
                    <div className="font-mono text-sm">
                      {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-cyan-400 font-bold">{user.totalVotes}</span>
                  </td>
                  <td className="py-3 text-sm text-gray-400">
                    {new Date(user.connectedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-sm text-gray-400">
                    {user.lastVoteTime 
                      ? new Date(user.lastVoteTime).toLocaleDateString()
                      : '未投票'
                    }
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.isActive ? '活跃' : '非活跃'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedUser(
                          selectedUser === user._id ? null : user._id
                        )}
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        {selectedUser === user._id ? '收起' : '详情'}
                      </button>
                      
                      {user.totalVotes > 0 && (
                        <button
                          onClick={() => resetUserVotes(user.walletAddress)}
                          disabled={operationLoading === user.walletAddress}
                          className="text-yellow-400 hover:text-yellow-300 text-sm disabled:opacity-50"
                        >
                          {operationLoading === user.walletAddress ? '处理中...' : '重置投票'}
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteUser(user.walletAddress)}
                        disabled={operationLoading === user.walletAddress}
                        className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
                      >
                        {operationLoading === user.walletAddress ? '处理中...' : '删除'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* 最近投票记录 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
      >
        <h3 className="text-xl font-bold mb-4">🗳️ 最近投票记录</h3>
        <div className="space-y-3">
          {voteHistory.slice(0, 10).map((vote, index) => (
            <motion.div
              key={`${vote.userId}-${vote.gameId}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center justify-between bg-white/10 rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{vote.gameIcon}</span>
                <div>
                  <div className="font-medium">{vote.gameName}</div>
                  <div className="text-sm text-gray-400 font-mono">
                    {vote.userId.slice(0, 6)}...{vote.userId.slice(-4)}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(vote.votedAt).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 