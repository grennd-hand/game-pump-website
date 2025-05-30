'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ChartData {
  time: string;
  votes: number;
  participants: number;
}

interface GameVote {
  id: string;
  name: string;
  icon: string;
  votes: number;
  change: number;
}

export default function RealTimeChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [gameVotes, setGameVotes] = useState<GameVote[]>([]);
  const [isLive, setIsLive] = useState(false);

  // 获取投票数据
  const fetchVotingData = async () => {
    try {
      const [statsResponse, roundsResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/voting-rounds')
      ]);
      
      const stats = await statsResponse.json();
      const rounds = await roundsResponse.json();
      
      // 更新图表数据
      const newDataPoint: ChartData = {
        time: new Date().toLocaleTimeString(),
        votes: stats.votingStats.totalVotes,
        participants: stats.votingStats.totalParticipants
      };
      
      setChartData(prev => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-20); // 只保留最近20个数据点
      });
      
      // 更新游戏投票数据
      if (rounds.rounds?.[0]?.games) {
        const games = rounds.rounds[0].games.slice(0, 10).map((game: any, index: number) => ({
          id: game.id,
          name: game.name,
          icon: game.icon,
          votes: game.votes,
          change: Math.floor(Math.random() * 10) - 5 // 模拟变化
        }));
        setGameVotes(games);
      }
      
    } catch (error) {
      console.error('获取投票数据失败:', error);
    }
  };

  // 实时数据更新
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLive) {
      interval = setInterval(fetchVotingData, 3000); // 每3秒更新
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  // 初始加载
  useEffect(() => {
    fetchVotingData();
  }, []);

  const maxVotes = Math.max(...chartData.map(d => d.votes), 1);

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">📈 实时数据监控</h3>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isLive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isLive ? '🛑 停止监控' : '▶️ 开始监控'}
          </button>
        </div>
        
        {/* 实时状态指示器 */}
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${isLive ? 'text-green-400' : 'text-gray-400'}`}>
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm">{isLive ? '实时监控中' : '监控已暂停'}</span>
          </div>
          <div className="text-sm text-gray-400">
            数据点: {chartData.length}/20
          </div>
        </div>
      </motion.div>

      {/* 简化图表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
      >
        <h4 className="text-lg font-bold mb-4">投票趋势</h4>
        <div className="relative h-64 bg-black/20 rounded-lg p-4">
          {chartData.length > 0 && (
            <svg className="w-full h-full">
              {/* 绘制投票数线条 */}
              <polyline
                fill="none"
                stroke="#06D6A0"
                strokeWidth="2"
                points={chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const y = 100 - (point.votes / maxVotes) * 80;
                  return `${x}%,${y}%`;
                }).join(' ')}
              />
              
              {/* 数据点 */}
              {chartData.map((point, index) => {
                const x = (index / (chartData.length - 1)) * 100;
                const y = 100 - (point.votes / maxVotes) * 80;
                return (
                  <circle
                    key={index}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="3"
                    fill="#06D6A0"
                  />
                );
              })}
            </svg>
          )}
          
          {/* Y轴标签 */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
            <span>{maxVotes}</span>
            <span>{Math.floor(maxVotes / 2)}</span>
            <span>0</span>
          </div>
        </div>
        
        {/* 时间轴 */}
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          {chartData.length > 0 && (
            <>
              <span>{chartData[0]?.time}</span>
              <span>{chartData[chartData.length - 1]?.time}</span>
            </>
          )}
        </div>
      </motion.div>

      {/* 游戏投票排行 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
      >
        <h4 className="text-lg font-bold mb-4">🎮 游戏投票实时排行</h4>
        <div className="space-y-3">
          {gameVotes.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between bg-white/10 rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-cyan-400">#{index + 1}</span>
                <span className="text-xl">{game.icon}</span>
                <span className="font-medium">{game.name}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold">{game.votes}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  game.change > 0 
                    ? 'bg-green-500/20 text-green-400' 
                    : game.change < 0 
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {game.change > 0 ? '+' : ''}{game.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 