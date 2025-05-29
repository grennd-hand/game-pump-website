 'use client'

import { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useWalletConnect } from '@/hooks/useWalletConnect'

interface SolanaWalletIntegrationProps {
  onVote: (gameIds: number[], walletAddress: string) => Promise<void>
  selectedGames: number[]
  hasVoted: boolean
  minSOLBalance?: number
}

export default function SolanaWalletIntegration({ 
  onVote, 
  selectedGames, 
  hasVoted,
  minSOLBalance = 0.1 // 主网真实SOL最低门槛
}: SolanaWalletIntegrationProps) {
  const { publicKey, connected, disconnect } = useWallet()
  const { connection } = useConnection()
  const { lang } = useLanguage()
  const { user, loading: userLoading, connectUser, refreshUser } = useWalletConnect()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // 从用户数据获取余额和投票权限
  const balance = user?.solBalance || 0
  const votesLeft = user?.availableVotes || 0

  // 刷新用户数据（包括余额）
  const handleRefreshBalance = async () => {
    if (!publicKey || !connected) return
    
    try {
      console.log('🔄 刷新用户数据...')
      await refreshUser()
    } catch (err) {
      console.error('❌ 刷新用户数据失败:', err)
      setError('无法刷新用户数据')
    }
  }

  // 处理投票
  const handleVote = async () => {
    if (!publicKey || !connected || selectedGames.length === 0) return
    
    if (balance < minSOLBalance) {
      setError(`投票需要至少 ${minSOLBalance} SOL`)
      return
    }

    if (selectedGames.length > votesLeft) {
      setError(`最多只能选择 ${votesLeft} 个游戏`)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await onVote(selectedGames, publicKey.toString())
      // 投票后刷新用户数据以更新剩余投票数
      await refreshUser()
    } catch (err: any) {
      setError(err.message || '投票失败')
    } finally {
      setIsLoading(false)
    }
  }

  // 监听钱包连接状态，自动连接用户
  useEffect(() => {
    console.log('🔍 钱包状态检查:', { 
      connected, 
      publicKey: publicKey?.toString(), 
      user: !!user,
      userBalance: user?.solBalance,
      userVotes: user?.availableVotes
    })
    if (connected && publicKey && !user) {
      console.log('🔗 钱包已连接，自动连接用户...')
      connectUser()
    } else if (!connected) {
      console.log('🔌 钱包未连接')
      setError('')
    }
  }, [connected, publicKey, user])

  // 检查余额并设置错误信息
  useEffect(() => {
    if (user) {
      console.log('💰 用户数据:', JSON.stringify(user, null, 2))
      console.log('💰 用户余额:', user.solBalance, 'SOL，可用投票:', user.availableVotes)
      if (user.solBalance < minSOLBalance) {
        setError(`钱包余额不足 ${minSOLBalance} SOL，当前余额: ${user.solBalance.toFixed(4)} SOL`)
      } else if (user.availableVotes === 0) {
        setError('暂无可用投票权')
      } else {
        setError('')
      }
    } else {
      console.log('❌ 没有用户数据')
    }
  }, [user, minSOLBalance])

  // 定期刷新用户数据
  useEffect(() => {
    if (!connected || !publicKey || !user) return

    const interval = setInterval(handleRefreshBalance, 30000) // 每30秒刷新一次
    return () => clearInterval(interval)
  }, [connected, publicKey, user])

  const translations = {
    en: {
      connectWallet: 'Connect Wallet to Vote',
      balance: 'Balance',
      votesLeft: 'Votes Left',
      vote: 'Vote Now',
      voting: 'Voting...',
      minBalance: `Minimum ${minSOLBalance} SOL required`,
      selectGames: 'Select games to vote',
      alreadyVoted: 'Already Voted',
      disconnect: 'Disconnect'
    },
    zh: {
      connectWallet: '连接钱包进行投票',
      balance: '余额',
      votesLeft: '剩余投票',
      vote: '立即投票',
      voting: '投票中...',
      minBalance: `最少需要 ${minSOLBalance} SOL`,
      selectGames: '选择要投票的游戏',
      alreadyVoted: '已投票',
      disconnect: '断开连接'
    },
    ja: {
      connectWallet: 'ウォレットを接続して投票',
      balance: '残高',
      votesLeft: '残り投票数',
      vote: '今すぐ投票',
      voting: '投票中...',
      minBalance: `最低 ${minSOLBalance} SOL が必要`,
      selectGames: '投票するゲームを選択',
      alreadyVoted: '投票済み',
      disconnect: '切断'
    },
    ko: {
      connectWallet: '지갑 연결하여 투표',
      balance: '잔액',
      votesLeft: '남은 투표',
      vote: '지금 투표',
      voting: '투표 중...',
      minBalance: `최소 ${minSOLBalance} SOL 필요`,
      selectGames: '투표할 게임 선택',
      alreadyVoted: '투표 완료',
      disconnect: '연결 해제'
    }
  }

  const t = translations[lang]

  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="pixel-card p-6 max-w-md mx-auto">
          <h3 className="text-xl font-retro text-retro-yellow mb-4">
            {t.connectWallet}
          </h3>
          <p className="text-gray-400 mb-6 font-pixel">
            {t.minBalance}
          </p>
          <WalletMultiButton className="neon-button !bg-retro-green !border-retro-green" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pixel-card p-6"
    >
      {/* 钱包信息 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
          <div className="text-sm text-gray-400 font-pixel mb-1">
            {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
          </div>
          <div className="flex items-center space-x-4 text-sm font-pixel">
            <span className="text-retro-cyan">
              {t.balance}: {balance.toFixed(4)} SOL
            </span>
            <span className="text-retro-yellow">
              {t.votesLeft}: {votesLeft}
            </span>
          </div>
          {/* 调试按钮 */}
          <button
            onClick={handleRefreshBalance}
            className="text-xs text-blue-400 hover:text-blue-300 mt-2 font-pixel"
          >
            🔄 刷新余额
          </button>
        </div>
        <button
          onClick={disconnect}
          className="text-xs text-gray-500 hover:text-retro-red transition-colors font-pixel"
        >
          {t.disconnect}
        </button>
      </div>

      {/* 错误信息 */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-900/20 border border-red-500 rounded p-3 mb-4"
        >
          <span className="text-red-400 text-sm font-pixel">{error}</span>
        </motion.div>
      )}

      {/* 投票按钮 */}
      <div className="text-center">
        {hasVoted ? (
          <div className="inline-block px-6 py-3 bg-retro-green/20 border-2 border-retro-green rounded-lg">
            <span className="text-retro-green font-pixel">{t.alreadyVoted}</span>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVote}
            disabled={isLoading || selectedGames.length === 0 || balance < minSOLBalance}
            className={`neon-button px-8 py-3 ${
              isLoading || selectedGames.length === 0 || balance < minSOLBalance
                ? 'opacity-50 cursor-not-allowed'
                : 'text-retro-green border-retro-green'
            }`}
          >
            {isLoading ? t.voting : selectedGames.length === 0 ? t.selectGames : t.vote}
          </motion.button>
        )}
      </div>

      {/* 投票规则提示 */}
      <div className="mt-4 text-xs text-gray-500 text-center font-pixel">
        • 每个钱包最多投票 3 个游戏<br/>
        • 需要至少 {minSOLBalance} SOL 余额<br/>
        • 投票后无法撤回
      </div>
    </motion.div>
  )
}