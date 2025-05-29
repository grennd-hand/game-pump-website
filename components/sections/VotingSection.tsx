'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useVotingRounds, useVote } from '@/hooks/useVotingRounds'
import { useWalletConnect, useUserDataSync } from '@/hooks/useWalletConnect'
import WalletConnectButton from '@/components/wallet/WalletConnectButton'
import DailyCheckin from '@/components/features/DailyCheckin'
import InviteSystem from '@/components/features/InviteSystem'

interface Game {
  id: string
  name: string
  icon: string
  description: string
  votes: number
  percentage: number
  color: string
  released: string
  platform?: string
  developer?: string
}

export default function VotingSection() {
  const { lang } = useLanguage()
  const { currentRound, loading: roundsLoading, error: roundsError, refetch } = useVotingRounds()
  const { submitVote, checkVoteStatus, loading: voteLoading, error: voteError } = useVote()
  const { user, isConnected, connectUser, loading: userLoading, refreshUser } = useWalletConnect()
  const { connected } = useWallet() // 直接使用钱包的连接状态
  const syncedUser = useUserDataSync() // 监听全局用户数据更新
  
  // 获取最新的用户数据，优先使用同步的数据
  const currentUser = syncedUser || user;
  
  const [gameVotes, setGameVotes] = useState<{[gameId: string]: number}>({}) // 每个游戏的投票数
  const [hasVoted, setHasVoted] = useState(false)
  const [votedGames, setVotedGames] = useState<string[]>([])
  const [games, setGames] = useState<Game[]>([])
  
  // 倒计时状态
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // 计算倒计时
  useEffect(() => {
    if (!currentRound) return

    const calculateTimeLeft = () => {
      const endTime = new Date(currentRound.endDate).getTime()
      const now = new Date().getTime()
      const difference = endTime - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [currentRound])

  // 监听钱包连接状态变化
  useEffect(() => {
    try {
      if (connected && !currentUser && !userLoading) {
        connectUser()
      }
      // 移除自动刷新逻辑，避免连接过程中的误触发
    } catch (error) {
      console.warn('🔌 钱包状态变化处理出错:', error);
      // 只在严重错误时刷新页面
    }
  }, [connected, currentUser, userLoading, connectUser])
  
  // 检查用户投票状态
  useEffect(() => {
    if (currentRound && connected && currentUser) {
      checkVoteStatus(currentRound._id).then(status => {
        if (status) {
          setHasVoted(status.hasVoted)
          setVotedGames(status.votedGames || [])
        }
      })
    }
  }, [currentRound, connected, currentUser, checkVoteStatus])

  // 处理游戏数据
  useEffect(() => {
    if (currentRound) {
      const totalVotes = currentRound.totalVotes || 1
      const processedGames = currentRound.games
        .map((game: any) => ({
          ...game,
          // 使用多语言翻译，如果没有则使用默认值
          name: game.nameTranslations?.[lang] || game.name,
          description: game.descriptionTranslations?.[lang] || game.description,
          percentage: totalVotes > 0 ? (game.votes / totalVotes) * 100 : 0
        }))
        .sort((a, b) => b.votes - a.votes) // 按票数降序排序
        .map((game, index) => ({
          ...game,
          color: getGameColor(index) // 重新分配颜色
        }))
      setGames(processedGames)
    }
  }, [currentRound, lang]) // 添加 lang 依赖

  // 获取游戏颜色
  const getGameColor = (index: number) => {
    const colors = [
      'text-red-400',
      'text-blue-400', 
      'text-green-400',
      'text-yellow-400',
      'text-purple-400',
      'text-cyan-400',
      'text-orange-400',
      'text-pink-400',
      'text-indigo-400',
      'text-emerald-400'
    ]
    return colors[index % colors.length]
  }

  // 处理游戏投票数变化
  const handleGameVoteChange = (gameId: string, change: number) => {
    if (!connected || !currentUser) return
    
    setGameVotes(prev => {
      const currentVotes = prev[gameId] || 0
      const newVotes = Math.max(0, currentVotes + change)
      
      // 计算总票数
      const totalUsedVotes = Object.values({...prev, [gameId]: newVotes}).reduce((sum, votes) => sum + votes, 0)
      
      // 检查是否超过可用票数
      if (totalUsedVotes > (currentUser?.availableVotes || 0)) {
        return prev // 不允许超过可用票数
      }
      
      if (newVotes === 0) {
        const { [gameId]: removed, ...rest } = prev
        return rest
      }
      
      return { ...prev, [gameId]: newVotes }
    })
  }

  // 处理投票提交
  const handleVoteSubmit = async () => {
    if (!currentRound || !connected || !currentUser) return
    
    const totalVotes = Object.values(gameVotes).reduce((sum, votes) => sum + votes, 0)
    if (totalVotes === 0) return
    
    try {
      const result = await submitVote(currentRound._id, gameVotes)
      if (result) {
        // 显示成功通知
        if ((window as any).addToast) {
          (window as any).addToast({
            type: 'success',
            title: '🎉 投票成功!',
            message: `共投出 ${totalVotes} 票`,
            duration: 4000
          })
        }
        
        // 更新已投票游戏列表
        setVotedGames(prev => [...prev, ...Object.keys(gameVotes)])
        setGameVotes({}) // 清空投票选择
        
        // 更新本地游戏数据，增加投票数并重新排序
        setGames(prevGames => {
          const updatedGames = prevGames.map(game => {
            const votesToAdd = gameVotes[game.id] || 0
            if (votesToAdd > 0) {
              const newVotes = game.votes + votesToAdd
              const newTotalVotes = currentRound.totalVotes + totalVotes
              return {
                ...game,
                votes: newVotes,
                percentage: newTotalVotes > 0 ? (newVotes / newTotalVotes) * 100 : 0
              }
            }
            // 重新计算其他游戏的百分比
            const newTotalVotes = currentRound.totalVotes + totalVotes
            return {
              ...game,
              percentage: newTotalVotes > 0 ? (game.votes / newTotalVotes) * 100 : 0
            }
          })
          
          // 按票数降序排序，并重新分配颜色
          return updatedGames
            .sort((a, b) => b.votes - a.votes)
            .map((game, index) => ({
              ...game,
              color: getGameColor(index)
            }))
        })
        
        // 更新当前轮次的总投票数（本地状态）
        if (currentRound) {
          currentRound.totalVotes += totalVotes
        }
        
        // 刷新用户数据（更新可用票数等）
        if (refreshUser) {
          refreshUser()
        }
      }
    } catch (error) {
      console.error('投票失败:', error)
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '投票失败',
          message: voteError || '请重试',
          duration: 6000
        })
    }
    }
  }

  // 国际化文本
  const titleMap = {
    en: '🗳️ Game Voting System',
    zh: '🗳️ 游戏投票系统',
    ja: '🗳️ ゲーム投票システム',
    ko: '🗳️ 게임 투표 시스템'
  }
  
  const descMap = {
    en: 'Connect your Solana wallet and vote for your favorite classic game. The winning game will get an exclusive meme token launch!',
    zh: '连接你的 Solana 钱包，为你最喜爱的经典游戏投票。获胜游戏将获得专属 meme 代币发射！',
    ja: 'Solanaウォレットを接続して、お気に入りのクラシックゲームに投票しましょう。勝利したゲームは専用のミームトークンを獲得します！',
    ko: 'Solana 지갑을 연결하고 좋아하는 클래식 게임에 투표하세요. 승리한 게임은 전용 밈 토큰을 얻게 됩니다!'
  }

  const totalVotesMap = { en: 'Total Votes', zh: '总投票数', ja: '総投票数', ko: '총 투표수' }
  const countdownMap = { en: 'Voting Ends In', zh: '投票结束倒计时', ja: '投票終了まで', ko: '투표 종료까지' }
  const playersMap = { en: 'Players', zh: '参与玩家', ja: 'プレイヤー', ko: '플레이어' }
  const votedMap = { en: 'Voted', zh: '已投票', ja: '投票済み', ko: '투표 완료' }
  const successMap = { en: '✅ Vote Success! Thanks for participating', zh: '✅ 投票成功！感谢你的参与', ja: '✅ 投票成功！参加ありがとうございます', ko: '✅ 투표 성공! 참여해 주셔서 감사합니다' }
  const releasedMap = { en: 'Released:', zh: '发布年份:', ja: 'リリース:', ko: '출시:' }
  const rankMap = { en: 'Rank:', zh: '排名:', ja: 'ランク:', ko: '순위:' }

  // 投票规则国际化
  const rulesMap = {
    en: {
      title: '📋 Voting Rules',
      votingMechanism: '🎯 Voting Mechanism',
      rewardMechanism: '🏆 Reward Mechanism',
      votingRules: [
        '• Connect Solana wallet to participate in voting',
        '• Get voting tickets through daily check-in and inviting friends',
        '• Can allocate multiple votes to the same game',
        '• Voting countdown ends, highest voted game enters token launch stage',
        '• Votes take effect immediately and cannot be withdrawn'
      ],
      rewardRules: [
        '• Selected game will launch exclusive meme token (e.g. $MARIO)',
        '• Voters receive 10% token airdrop allocation',
        '• Token holders participate in DAO governance decisions',
        '• Future play-to-earn development voting rights'
      ]
    },
    zh: {
      title: '📋 投票规则',
      votingMechanism: '🎯 投票机制',
      rewardMechanism: '🏆 奖励机制',
      votingRules: [
        '• 连接 Solana 钱包即可参与投票',
        '• 通过每日签到和邀请好友获得投票票数',
        '• 可以对同一个游戏分配多张票',
        '• 投票倒计时结束后，得票最高的游戏进入代币发射阶段',
        '• 投票即时生效，无法撤回'
      ],
      rewardRules: [
        '• 选定游戏将发射专属 meme 代币（如 $MARIO）',
        '• 投票者获得 10% 代币空投分配',
        '• 代币持有者参与 DAO 治理决策',
        '• 未来 play-to-earn 开发投票权'
      ]
    },
    ja: {
      title: '📋 投票ルール',
      votingMechanism: '🎯 投票メカニズム',
      rewardMechanism: '🏆 報酬メカニズム',
      votingRules: [
        '• Solanaウォレットを接続して投票に参加',
        '• 毎日のチェックインと友達招待で投票チケットを獲得',
        '• 同じゲームに複数票を割り当て可能',
        '• 投票カウントダウン終了後、最高得票ゲームがトークン発行段階に進む',
        '• 投票は即座に有効になり、取り消しできません'
      ],
      rewardRules: [
        '• 選択されたゲームは専用ミームトークンを発行（例：$MARIO）',
        '• 投票者は10%のトークンエアドロップ配分を受け取り',
        '• トークン保有者はDAOガバナンス決定に参加',
        '• 将来のplay-to-earn開発投票権'
      ]
    },
    ko: {
      title: '📋 투표 규칙',
      votingMechanism: '🎯 투표 메커니즘',
      rewardMechanism: '🏆 보상 메커니즘',
      votingRules: [
        '• Solana 지갑을 연결하여 투표에 참여',
        '• 매일 체크인과 친구 초대를 통해 투표 티켓 획득',
        '• 같은 게임에 여러 표를 할당 가능',
        '• 투표 카운트다운 종료 후, 최고 득표 게임이 토큰 발행 단계로 진입',
        '• 투표는 즉시 효력이 발생하며 취소 불가'
      ],
      rewardRules: [
        '• 선택된 게임은 전용 밈 토큰 발행 (예: $MARIO)',
        '• 투표자는 10% 토큰 에어드롭 배분 수령',
        '• 토큰 보유자는 DAO 거버넌스 결정에 참여',
        '• 향후 play-to-earn 개발 투표권'
      ]
    }
  }

  if (roundsLoading) {
    return (
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-retro-cyan font-pixel">加载投票数据中...</div>
        </div>
      </section>
    )
  }

  if (roundsError || !currentRound) {
    return (
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-red-400 font-pixel">
            {roundsError || '暂无活跃的投票轮次'}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="voting" className="py-20 relative">
      {/* 动态像素背景 */}
      <div className="absolute inset-0 bg-pixel-pattern opacity-5"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-retro text-retro-green mb-4" style={{ textShadow: '0 0 10px currentColor' }}>
            {titleMap[lang]}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {descMap[lang]}
          </p>
        </motion.div>

        {/* 投票规则说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12 text-center"
        >
          <div className="pixel-card p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-retro text-retro-yellow mb-4">{rulesMap[lang].title}</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-pixel text-retro-green mb-2">{rulesMap[lang].votingMechanism}</h4>
                <ul className="text-sm text-gray-400 space-y-1 font-pixel">
                  {rulesMap[lang].votingRules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-pixel text-retro-cyan mb-2">{rulesMap[lang].rewardMechanism}</h4>
                <ul className="text-sm text-gray-400 space-y-1 font-pixel">
                  {rulesMap[lang].rewardRules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 钱包连接和投票提交区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="pixel-card p-8 max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-retro text-retro-yellow mb-6">
              {lang === 'zh' ? '🗳️ 提交投票' : '🗳️ Submit Vote'}
            </h3>
            
            {isConnected && currentUser && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-400 font-pixel">
                  {lang === 'zh' ? '投票分配:' : 'Vote Allocation:'}
                </p>
                  <p className="text-retro-cyan font-pixel text-sm">
                    {(() => {
                      const totalAllocated = Object.values(gameVotes).reduce((sum, votes) => sum + votes, 0);
                      const totalUsed = (currentUser.totalVotes || 0);
                      const available = (currentUser.availableVotes || 0);
                      return lang === 'zh' 
                        ? `已用: ${totalUsed} | 待投: ${totalAllocated} | 剩余: ${available - totalAllocated} 票`
                        : `Used: ${totalUsed} | Pending: ${totalAllocated} | Remaining: ${available - totalAllocated} votes`;
                    })()}
                  </p>
                </div>
                {Object.keys(gameVotes).length > 0 ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {Object.entries(gameVotes).map(([gameId, voteCount]) => {
                    const game = games.find(g => g.id === gameId)
                    return game ? (
                      <span key={gameId} className="px-3 py-1 bg-retro-yellow/20 border border-retro-yellow rounded text-retro-yellow font-pixel text-sm">
                        {game.icon} {game.name} × {voteCount}
                      </span>
                    ) : null
                  })}
                </div>
                ) : (
                  <div className="text-center text-gray-500 font-pixel text-sm py-4">
                    {lang === 'zh' ? '请为游戏分配票数' : 'Please allocate votes to games'}
                  </div>
                )}
              </div>
            )}

            {!connected ? (
              <div className="space-y-4">
            <div className="text-gray-400 font-pixel text-sm mb-6">
              {lang === 'zh' ? (
                <>
                  • 连接 Solana 钱包进行投票<br/>
                  • 通过每日签到获得投票票数<br/>
                  • 可以对同一个游戏投多票<br/>
                  • 投票后无法撤回
                </>
              ) : (
                <>
                  • Connect Solana wallet to vote<br/>
                  • Get voting tickets through daily check-in<br/>
                  • Can vote multiple times for the same game<br/>
                  • Votes cannot be withdrawn
                </>
              )}
            </div>
                <WalletConnectButton />
              </div>
            ) : userLoading ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 text-retro-cyan">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-pixel">
                      {lang === 'zh' ? '加载用户数据中...' : 'Loading user data...'}
                    </span>
                  </div>
                </div>
              </div>
            ) : !hasVoted ? (
              <div className="space-y-4">
                {currentUser && (
              <div className="mb-6 px-4 py-2 bg-retro-cyan/20 border border-retro-cyan rounded">
                <span className="text-retro-cyan font-pixel text-sm">
                      {lang === 'zh' ? `余额: ${currentUser.solBalance?.toFixed(3)} SOL | 可用投票: ${currentUser.availableVotes}` 
                        : `Balance: ${currentUser.solBalance?.toFixed(3)} SOL | Votes: ${currentUser.availableVotes}`}
                </span>
              </div>
            )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleVoteSubmit}
                  disabled={Object.keys(gameVotes).length === 0 || voteLoading || (currentUser?.availableVotes || 0) === 0}
                    className={`neon-button px-8 py-4 text-lg ${
                    Object.keys(gameVotes).length === 0 || voteLoading || (currentUser?.availableVotes || 0) === 0
                        ? 'opacity-50 cursor-not-allowed text-gray-500 border-gray-500'
                        : 'text-retro-green border-retro-green'
                    }`}
                  >
                  {(() => {
                    const totalVotes = Object.values(gameVotes).reduce((sum, votes) => sum + votes, 0);
                    if (voteLoading) {
                      return lang === 'zh' ? '投票中...' : 'Voting...';
                    }
                    if (totalVotes === 0) {
                      return lang === 'zh' ? '请分配票数' : 'Allocate Votes';
                    }
                    if ((currentUser?.availableVotes || 0) === 0) {
                      return lang === 'zh' ? '投票数不足' : 'No Votes Left';
                    }
                    return lang === 'zh' ? `🗳️ 投票 (${totalVotes} 票)` : `🗳️ Vote (${totalVotes} votes)`;
                  })()}
                  </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
              <div className="inline-block px-8 py-4 bg-retro-green/20 border-2 border-retro-green rounded-lg">
                <span className="text-retro-green font-pixel text-lg">
                  {lang === 'zh' ? '✅ 投票成功！' : '✅ Vote Successful!'}
                </span>
                </div>
                {votedGames.length > 0 && (
                  <div className="text-gray-400 font-pixel text-sm">
                    {lang === 'zh' ? '已投票游戏: ' : 'Voted for: '}
                    {votedGames.map(gameId => {
                      const game = games.find(g => g.id === gameId)
                      return game?.name
                    }).join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* 投票统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="pixel-card p-4 text-center">
              <div className="text-2xl font-bold text-retro-cyan game-score">
                {currentRound.totalVotes.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400 font-pixel">{totalVotesMap[lang]}</div>
            </div>
            <div className="pixel-card p-4 text-center">
              <div className="text-2xl font-bold text-retro-yellow game-score">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-400 font-pixel">{countdownMap[lang]}</div>
            </div>
            <div className="pixel-card p-4 text-center">
              <div className="text-2xl font-bold text-retro-magenta game-score">
                {(() => {
                  // 计算实际参与者数量
                  const allVoters = new Set();
                  currentRound.games.forEach((game: any) => {
                    if (game.voters && Array.isArray(game.voters)) {
                      game.voters.forEach((voter: string) => allVoters.add(voter));
                    }
                  });
                  return allVoters.size.toLocaleString();
                })()}
              </div>
              <div className="text-sm text-gray-400 font-pixel">{playersMap[lang]}</div>
            </div>
          </div>
        </motion.div>

        {/* 获取票数方式 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-retro text-retro-yellow mb-2">
              {lang === 'zh' ? '🎁 获取更多票数' : '🎁 Get More Votes'}
            </h3>
            <p className="text-gray-400 font-pixel">
              {lang === 'zh' ? '通过每日签到和邀请好友获得额外投票权' : 'Get extra voting power through daily check-in and inviting friends'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyCheckin />
            <InviteSystem />
          </div>
        </motion.div>

        {/* 游戏投票列表 */}
        <div className="grid gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`pixel-card p-6 transition-all duration-300 ${
                gameVotes[game.id] > 0 ? 'border-retro-yellow scale-105' : ''
              } ${
                votedGames.includes(game.id) ? 'border-retro-green' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 justify-between">
                {/* 游戏信息 */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="text-6xl animate-float">{game.icon}</div>
                  <div>
                    <h3 className={`text-2xl font-bold font-retro ${game.color}`}>
                      {game.name}
                    </h3>
                    <p className="text-gray-400 mt-1 max-w-md">{game.description}</p>
                    <div className="flex flex-col space-y-1 mt-2 text-sm font-pixel">
                      <div className="flex items-center space-x-4">
                      <span className="text-retro-cyan">{releasedMap[lang]} {game.released}</span>
                      <span className="text-retro-yellow">{rankMap[lang]} #{index + 1}</span>
                      </div>
                      {game.platform && (
                        <div className="flex items-center space-x-4">
                          <span className="text-retro-magenta">
                            {lang === 'zh' ? '平台' : lang === 'ja' ? 'プラットフォーム' : lang === 'ko' ? '플랫폼' : 'Platform'}: {game.platform}
                          </span>
                          <span className="text-retro-green">
                            {lang === 'zh' ? '开发商' : lang === 'ja' ? '開発者' : lang === 'ko' ? '개발자' : 'Developer'}: {game.developer}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 投票区域 */}
                <div className="text-right flex-shrink-0 w-full sm:w-auto">
                  {connected && currentUser ? (
                    <div className="space-y-3">
                      {/* 票数控制器 */}
                      <div className="flex items-center justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleGameVoteChange(game.id, -1)}
                          disabled={!gameVotes[game.id] || gameVotes[game.id] === 0}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                            gameVotes[game.id] > 0
                              ? 'border-retro-red text-retro-red hover:bg-retro-red/20'
                              : 'border-gray-500 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          -
                        </motion.button>
                        
                        <div className="w-12 text-center">
                          <span className="text-lg font-bold text-retro-yellow">
                            {gameVotes[game.id] || 0}
                          </span>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleGameVoteChange(game.id, 1)}
                          disabled={(() => {
                            const totalUsed = Object.values(gameVotes).reduce((sum, votes) => sum + votes, 0);
                            return totalUsed >= (currentUser?.availableVotes || 0);
                          })()}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                            (() => {
                              const totalUsed = Object.values(gameVotes).reduce((sum, votes) => sum + votes, 0);
                              return totalUsed < (currentUser?.availableVotes || 0)
                                ? 'border-retro-green text-retro-green hover:bg-retro-green/20'
                                : 'border-gray-500 text-gray-500 cursor-not-allowed';
                            })()
                          }`}
                        >
                          +
                        </motion.button>
                      </div>
                      
                      {/* 投票状态显示 */}
                      {gameVotes[game.id] > 0 && (
                        <div className="text-center">
                          <span className="px-2 py-1 bg-retro-yellow/20 border border-retro-yellow rounded text-retro-yellow font-pixel text-xs">
                            {lang === 'zh' ? `将投 ${gameVotes[game.id]} 票` : `${gameVotes[game.id]} votes`}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 font-pixel text-sm">
                      {lang === 'zh' ? '连接钱包投票' : 'Connect wallet to vote'}
                    </div>
                  )}
                  
                  <div className="space-y-2 mt-4">
                    <div className={`text-2xl font-bold game-score ${game.color}`}>
                      {game.votes.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400 font-pixel">
                      {game.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 投票进度条 */}
              <div className="mt-4">
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${game.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${
                      game.color.includes('red') ? 'from-red-400 to-red-600' :
                      game.color.includes('blue') ? 'from-blue-400 to-blue-600' :
                      game.color.includes('green') ? 'from-green-400 to-green-600' :
                      game.color.includes('yellow') ? 'from-yellow-400 to-yellow-600' :
                      'from-emerald-400 to-emerald-600'
                    } animate-glow`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 