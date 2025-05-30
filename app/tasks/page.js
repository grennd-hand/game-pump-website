'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTasks } from '@/hooks/useTasks'
import { useWallet } from '@solana/wallet-adapter-react'
import { useUser } from '@/contexts/UserContext'
import ClientOnlyHeader from '@/components/layout/ClientOnlyHeader'
import BackToTop from '@/components/ui/BackToTop'
import { FaXTwitter, FaTelegram } from 'react-icons/fa6'
import analytics from '@/lib/analytics'

export default function TasksPage() {
  const { lang } = useLanguage()
  const { tasks, loading, completeTask } = useTasks()
  const { connected, publicKey } = useWallet()
  const { user } = useUser()
  const [completingTask, setCompletingTask] = useState(null)

  // 国际化文本
  const translations = {
    en: {
      title: "Social Tasks",
      subtitle: "Complete tasks to earn rewards",
      loading: "Loading...",
      taskStatus: {
        notStarted: "Start",
        completed: "Complete",
        verified: "Verified",
        pending: "Pending"
      },
      rewards: "Rewards",
      points: "Points",
      votes: "Votes",
      connectWallet: "Connect Wallet",
      connectWalletDescription: "Connect your wallet to start completing tasks",
      taskCompleted: "Task completed!",
      earnedRewards: "Earned",
      currentPoints: "Current",
      newPoints: "New",
      socialBinding: "Account Binding",
      bindTwitter: "Bind Twitter Account",
      bindTelegram: "Bind Telegram Account",
      verified: "Verified",
      waitingVerification: "Waiting for verification...",
      playerStats: "Your Stats",
      totalXP: "Total Points",
      availablePower: "Available Votes",
      completedMissions: "Completed Tasks",
      powerMultiplier: "Multiplier",
      processing: "Processing...",
      noActiveTasks: "No Active Tasks",
      newTasksPreparing: "New tasks coming soon...",
      bindingSuccess: "✓ Binding Successful",
      bindingFailed: "✗ Binding Failed",
      taskFailed: "✗ Task Failed",
      inputTwitterUsername: "Enter your Twitter username (without @):",
      inputTelegramUsername: "Enter your Telegram username (without @):",
      categories: {
        twitter: "TWITTER",
        telegram: "TELEGRAM",
        general: "GENERAL"
      }
    },
    zh: {
      title: "社交任务",
      subtitle: "完成任务获得奖励",
      loading: "加载中...",
      taskStatus: {
        notStarted: "开始",
        completed: "已完成",
        verified: "已验证",
        pending: "等待中"
      },
      rewards: "奖励",
      points: "积分",
      votes: "投票权",
      connectWallet: "连接钱包",
      connectWalletDescription: "连接钱包开始完成任务",
      taskCompleted: "任务完成！",
      earnedRewards: "获得",
      currentPoints: "当前",
      newPoints: "新积分",
      socialBinding: "账号绑定",
      bindTwitter: "绑定Twitter账号",
      bindTelegram: "绑定Telegram账号",
      verified: "已验证",
      waitingVerification: "等待验证中...",
      playerStats: "你的统计",
      totalXP: "总积分",
      availablePower: "可用投票",
      completedMissions: "完成任务",
      powerMultiplier: "倍数",
      processing: "处理中...",
      noActiveTasks: "暂无活跃任务",
      newTasksPreparing: "新任务即将推出...",
      bindingSuccess: "✓ 绑定成功",
      bindingFailed: "✗ 绑定失败",
      taskFailed: "✗ 任务失败",
      inputTwitterUsername: "请输入您的Twitter用户名（不包含@符号）:",
      inputTelegramUsername: "请输入您的Telegram用户名（不包含@符号）:",
      categories: {
        twitter: "TWITTER",
        telegram: "TELEGRAM",
        general: "GENERAL"
      }
    },
    ja: {
      title: "ソーシャルタスク",
      subtitle: "タスクを完了して報酬を獲得",
      loading: "読み込み中...",
      taskStatus: {
        notStarted: "開始",
        completed: "完了",
        verified: "検証済み",
        pending: "保留中"
      },
      rewards: "報酬",
      points: "ポイント",
      votes: "投票権",
      connectWallet: "ウォレット接続",
      connectWalletDescription: "ウォレットを接続してタスクを開始",
      taskCompleted: "タスク完了！",
      earnedRewards: "獲得",
      currentPoints: "現在",
      newPoints: "新ポイント",
      socialBinding: "アカウント連携",
      bindTwitter: "Twitterアカウント連携",
      bindTelegram: "Telegramアカウント連携",
      verified: "検証済み",
      waitingVerification: "検証待ち...",
      playerStats: "あなたの統計",
      totalXP: "総ポイント",
      availablePower: "利用可能投票",
      completedMissions: "完了タスク",
      powerMultiplier: "倍率",
      processing: "処理中...",
      noActiveTasks: "アクティブなタスクなし",
      newTasksPreparing: "新しいタスクを準備中...",
      bindingSuccess: "✓ 連携成功",
      bindingFailed: "✗ 連携失敗",
      taskFailed: "✗ タスク失敗",
      inputTwitterUsername: "Twitterユーザー名を入力してください（@なし）:",
      inputTelegramUsername: "Telegramユーザー名を入力してください（@なし）:",
      categories: {
        twitter: "TWITTER",
        telegram: "TELEGRAM",
        general: "GENERAL"
      }
    },
    ko: {
      title: "소셜 작업",
      subtitle: "작업을 완료하여 보상 획득",
      loading: "로딩 중...",
      taskStatus: {
        notStarted: "시작",
        completed: "완료",
        verified: "검증됨",
        pending: "대기 중"
      },
      rewards: "보상",
      points: "포인트",
      votes: "투표권",
      connectWallet: "지갑 연결",
      connectWalletDescription: "지갑을 연결하여 작업 시작",
      taskCompleted: "작업 완료!",
      earnedRewards: "획득",
      currentPoints: "현재",
      newPoints: "새 포인트",
      socialBinding: "계정 연결",
      bindTwitter: "Twitter 계정 연결",
      bindTelegram: "Telegram 계정 연결",
      verified: "검증됨",
      waitingVerification: "검증 대기 중...",
      playerStats: "당신의 통계",
      totalXP: "총 포인트",
      availablePower: "사용 가능 투표",
      completedMissions: "완료된 작업",
      powerMultiplier: "배수",
      processing: "처리 중...",
      noActiveTasks: "활성 작업 없음",
      newTasksPreparing: "새로운 작업 준비 중...",
      bindingSuccess: "✓ 연결 성공",
      bindingFailed: "✗ 연결 실패",
      taskFailed: "✗ 작업 실패",
      inputTwitterUsername: "Twitter 사용자명을 입력하세요（@ 없이）:",
      inputTelegramUsername: "Telegram 사용자명을 입력하세요（@ 없이）:",
      categories: {
        twitter: "TWITTER",
        telegram: "TELEGRAM",
        general: "GENERAL"
      }
    }
  }

  const t = translations[lang]

  // 处理授权结果
  useEffect(() => {
    // 追踪页面访问
    analytics.pageView('/tasks')
    
    const urlParams = new URLSearchParams(window.location.search)
    const authSuccess = urlParams.get('auth_success')
    const authError = urlParams.get('auth_error')
    
    if (authSuccess === 'twitter_bound') {
      // 追踪Twitter绑定成功
      analytics.socialBind('twitter', true)
      
      if (window.addToast) {
        window.addToast({
          type: 'success',
          title: t.bindingSuccess,
          message: 'Twitter账号绑定成功！',
          duration: 3000
        });
      }
      // 清理URL参数
      window.history.replaceState({}, '', '/tasks')
    } else if (authError) {
      // 追踪Twitter绑定失败
      analytics.socialBind('twitter', false)
      analytics.trackError(new Error(`Twitter授权失败: ${authError}`), {
        context: 'twitter_oauth_callback'
      })
      
      if (window.addToast) {
        window.addToast({
          type: 'error',
          title: t.bindingFailed,
          message: `授权失败: ${authError}`,
          duration: 3000
        });
      }
      // 清理URL参数
      window.history.replaceState({}, '', '/tasks')
    }
  }, [])

  // 追踪钱包连接状态
  useEffect(() => {
    if (connected && publicKey) {
      analytics.walletConnected('solana', publicKey.toString())
      analytics.setUserId(publicKey.toString())
    }
  }, [connected, publicKey])

  // 任务图标映射
  const getTaskIcon = (task) => {
    const iconMap = {
      twitter: <FaXTwitter className="w-4 h-4 text-retro-cyan" />,
      telegram: <FaTelegram className="w-4 h-4 text-retro-magenta" />,
      general: '🎮',
      follow_twitter: <FaXTwitter className="w-4 h-4 text-retro-cyan" />,
      retweet: <FaXTwitter className="w-4 h-4 text-retro-cyan" />,
      like_tweet: <FaXTwitter className="w-4 h-4 text-retro-cyan" />,
      comment_tweet: <FaXTwitter className="w-4 h-4 text-retro-cyan" />,
      join_telegram: <FaTelegram className="w-4 h-4 text-retro-magenta" />
    }
    
    return iconMap[task.type] || iconMap[task.category] || '🎮'
  }

  // 获取任务状态
  const getTaskStatus = (task) => {
    if (!task.userCompletion) return 'notStarted'
    return task.userCompletion.status
  }

  // 处理任务完成
  const handleCompleteTask = async (task) => {
    if (!connected) {
      alert(t.connectWallet)
      return
    }

    // 追踪任务开始事件
    analytics.track('task_started', {
      taskId: task.id,
      taskType: task.type,
      taskCategory: task.category
    })

    // 如果是社交任务，使用特殊处理
    if (task.category === 'twitter' || task.category === 'telegram') {
      return handleSocialTask(task)
    }

    try {
      setCompletingTask(task.id)
      const result = await completeTask(task.id, {})
      
      // 追踪任务完成事件
      analytics.taskCompleted(task.id, task.type, result.rewards)
      
      if (window.addToast) {
        window.addToast({
          type: 'success',
          title: t.taskCompleted,
          message: `${t.earnedRewards}: +${result.rewards.actualPoints} ${t.points}${result.rewards.votes > 0 ? `, +${result.rewards.votes} ${t.votes}` : ''}`,
          duration: 3000
        });
      }
      
    } catch (error) {
      console.error('任务完成失败:', error)
      
      // 追踪任务失败事件
      analytics.trackError(error, {
        context: 'task_completion',
        taskId: task.id,
        taskType: task.type
      })
      
      if (window.addToast) {
        window.addToast({
          type: 'error',
          title: t.taskFailed,
          message: error.message,
          duration: 3000
        });
      }
    } finally {
      setCompletingTask(null)
    }
  }

  // 处理社交任务
  const handleSocialTask = async (task) => {
    try {
      setCompletingTask(task.id)
      
      // 获取要跳转的页面URL
      const response = await fetch('/api/auth/social-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          platform: task.category,
          action: 'init',
          taskType: task.type
        }),
      })

      const data = await response.json()
      
      if (data.success && data.authUrl) {
        // 跳转到社交平台页面
        window.open(data.authUrl, '_blank')
        
        // 提示用户完成任务后输入用户名
        setTimeout(() => {
          const username = prompt(
            `请完成${task.translations?.[lang]?.title || task.title}任务后，输入您的用户名：`
          )
          
          if (username) {
            verifySocialTask(task, username)
          } else {
            setCompletingTask(null)
          }
        }, 2000)
        
      } else {
        throw new Error(data.error || '获取任务链接失败')
      }
    } catch (error) {
      if (window.addToast) {
        window.addToast({
          type: 'error',
          title: t.taskFailed,
          message: error.message,
          duration: 3000
        });
      }
      setCompletingTask(null)
    }
  }

  // 验证社交任务完成
  const verifySocialTask = async (task, username) => {
    try {
      // 先验证社交账号
      const verifyResponse = await fetch('/api/auth/social-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          platform: task.category,
          action: 'verify',
          username
        }),
      })

      const verifyData = await verifyResponse.json()
      
      if (!verifyData.success) {
        throw new Error(verifyData.error)
      }

      // 然后完成任务获得奖励
      const result = await completeTask(task.id, { socialUsername: username })
      
      if (window.addToast) {
        window.addToast({
          type: 'success',
          title: t.taskCompleted,
          message: `${t.earnedRewards}: +${result.rewards.actualPoints} ${t.points}${result.rewards.votes > 0 ? `, +${result.rewards.votes} ${t.votes}` : ''}`,
          duration: 3000
        });
      }
      
    } catch (error) {
      if (window.addToast) {
        window.addToast({
          type: 'error',
          title: t.taskFailed,
          message: error.message,
          duration: 3000
        });
      }
    } finally {
      setCompletingTask(null)
    }
  }

  // 绑定社交账号
  const handleBindSocialAccount = async (platform) => {
    if (!connected) {
      alert(t.connectWallet)
      return
    }

    try {
      if (platform === 'twitter') {
        // 追踪Twitter绑定开始事件
        analytics.track('social_bind_started', {
          platform: 'twitter',
          walletAddress: publicKey.toString().slice(0, 8) + '...'
        })
        
        // 检查Twitter API配置
        if (!process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID) {
          if (window.addToast) {
            window.addToast({
              type: 'error',
              title: '配置错误',
              message: 'Twitter API未配置，请联系管理员',
              duration: 5000
            });
          }
          return
        }
        
        // 显示加载状态
        if (window.addToast) {
          window.addToast({
            type: 'info',
            title: '正在跳转...',
            message: '即将跳转到Twitter授权页面',
            duration: 2000
          });
        }

        // 直接构建Twitter OAuth URL（真实的Twitter API）
        const state = `${publicKey.toString()}_${Date.now()}`
        const redirectUri = `${window.location.origin}/api/auth/twitter-callback`
        
        // 使用真实的Twitter OAuth 2.0 API
        const authUrl = `https://twitter.com/i/oauth2/authorize?` +
          `response_type=code&` +
          `client_id=${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=${encodeURIComponent('tweet.read users.read offline.access')}&` +
          `state=${state}&` +
          `code_challenge=${btoa(state).replace(/[+/]/g, '-_').replace(/=/g, '')}&` +
          `code_challenge_method=S256`
        
        // 保存状态到localStorage（临时方案）
        localStorage.setItem('twitter_auth_state', state)
        
        // 追踪重定向事件
        analytics.track('twitter_redirect', {
          authUrl: authUrl.substring(0, 100) + '...',
          state: state.substring(0, 20) + '...'
        })
        
        // 直接跳转，不用window.open
        window.location.href = authUrl
        
      } else if (platform === 'telegram') {
        // Telegram跳转
        window.open('https://t.me/GamePumpChannel', '_blank')
        
        // 延迟询问用户名
        setTimeout(() => {
          const username = prompt('请输入您的Telegram用户名（不带@）:')
          if (username) {
            handleTelegramBind(username)
          }
        }, 3000)
      }
    } catch (error) {
      if (window.addToast) {
        window.addToast({
          type: 'error',
          title: t.bindingFailed,
          message: error.message,
          duration: 3000
        });
      }
    }
  }

  // Telegram绑定处理
  const handleTelegramBind = async (username) => {
    try {
      // 更新用户社交账号信息
      const response = await fetch('/api/user/update-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          platform: 'telegram',
          username: username.replace('@', '')
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        if (window.addToast) {
          window.addToast({
            type: 'success',
            title: t.bindingSuccess,
            message: 'Telegram账号绑定成功！',
            duration: 3000
          });
        }
        // 刷新用户数据
        window.location.reload()
      } else {
        throw new Error(data.error || '绑定失败')
      }
    } catch (error) {
      if (window.addToast) {
        window.addToast({
          type: 'error',
          title: t.bindingFailed,
          message: error.message,
          duration: 3000
        });
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-retro-green text-2xl font-pixel mb-4">⚙</div>
          <div className="text-retro-green font-pixel">{t.loading}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <ClientOnlyHeader />
      <div className="min-h-screen bg-black text-white pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-retro text-retro-green mb-4 text-glow">
              {t.title}
            </h1>
            <p className="text-gray-400 font-pixel">{t.subtitle}</p>
            <div className="w-32 h-0.5 bg-retro-green mx-auto mt-4"></div>
          </div>

          {/* 用户统计 */}
          {user && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: t.totalXP, value: user.totalPoints || 0, icon: "⭐" },
                { label: t.availablePower, value: user.availableVotes || 0, icon: "⚡" },
                { label: t.completedMissions, value: user.completedTasks || 0, icon: "✓" },
                { label: t.powerMultiplier, value: `${(user.taskMultiplier || 1).toFixed(1)}x`, icon: "×" }
              ].map((stat, i) => (
                <div key={i} className="pixel-card p-3 text-center">
                  <div className="text-base mb-1">{stat.icon}</div>
                  <div className="text-lg font-pixel text-retro-green mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400 font-pixel">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* 社交账号绑定 */}
          {connected && user && (
            <div className="mb-8">
              <h2 className="text-lg font-retro text-retro-green mb-4">{t.socialBinding}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Twitter */}
                <div className="pixel-card p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 bg-black flex items-center justify-center text-white font-bold mr-2 text-xs rounded">
                      <FaXTwitter className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-pixel text-sm text-white">Twitter</span>
                  </div>
                  
                  {user.socialAccounts?.twitter?.username ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-pixel text-xs">@{user.socialAccounts.twitter.username}</span>
                        {user.socialAccounts.twitter.verified && (
                          <span className="text-retro-green text-xs">✓ {t.verified}</span>
                        )}
                      </div>
                      {!user.socialAccounts.twitter.verified && (
                        <div className="text-yellow-400 text-xs font-pixel">{t.waitingVerification}</div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBindSocialAccount('twitter')}
                      className="neon-button text-white border-white w-full text-xs py-1"
                    >
                      {t.bindTwitter}
                    </button>
                  )}
                </div>

                {/* Telegram */}
                <div className="pixel-card p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 bg-[#0088cc] flex items-center justify-center text-white font-bold mr-2 text-xs rounded">
                      <FaTelegram className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-pixel text-sm text-[#0088cc]">Telegram</span>
                  </div>
                  
                  {user.socialAccounts?.telegram?.username ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-pixel text-xs">@{user.socialAccounts.telegram.username}</span>
                        {user.socialAccounts.telegram.verified && (
                          <span className="text-retro-green text-xs">✓ {t.verified}</span>
                        )}
                      </div>
                      {!user.socialAccounts.telegram.verified && (
                        <div className="text-yellow-400 text-xs font-pixel">{t.waitingVerification}</div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBindSocialAccount('telegram')}
                      className="neon-button text-[#0088cc] border-[#0088cc] w-full text-xs py-1"
                    >
                      {t.bindTelegram}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 任务列表 */}
          <div className="space-y-4">
            {tasks.map((task) => {
              const status = getTaskStatus(task)
              const isCompleting = completingTask === task.id

              return (
                <div key={task.id} className="pixel-card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">{getTaskIcon(task)}</div>
                      <div>
                        <h3 className="font-pixel text-base text-white mb-1">
                          {task.translations?.[lang]?.title || task.title}
                        </h3>
                        <span className="text-xs font-pixel text-gray-400 border border-gray-600 px-2 py-0.5 rounded">
                          {t.categories[task.category] || task.category.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'completed' || status === 'verified' ? 'bg-retro-green' :
                      status === 'pending' ? 'bg-yellow-400' : 'bg-gray-600'
                    }`} />
                  </div>

                  <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                    {task.translations?.[lang]?.description || task.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs font-pixel">
                      <span className="text-retro-green">+{Math.floor(task.rewards.basePoints * 1.1)} {t.points}</span>
                      {task.rewards.votes > 0 && (
                        <span className="text-retro-cyan">+{task.rewards.votes} {t.votes}</span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleCompleteTask(task)}
                      disabled={!connected || status !== 'notStarted' || isCompleting}
                      className={`px-4 py-1 font-pixel text-xs border transition-all ${
                        !connected 
                          ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                          : status === 'notStarted'
                            ? 'neon-button text-retro-green border-retro-green'
                            : status === 'completed' || status === 'verified'
                              ? 'border-retro-green text-retro-green bg-retro-green/10'
                              : 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                      } ${isCompleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {!connected ? t.connectWallet :
                       isCompleting ? t.processing :
                       t.taskStatus[status].toUpperCase()}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 连接钱包提示 */}
          {!connected && (
            <div className="text-center py-12">
              <div className="pixel-card p-8 max-w-md mx-auto">
                <div className="text-4xl mb-4">🔗</div>
                <h3 className="text-xl font-retro text-retro-green mb-4">{t.connectWallet}</h3>
                <p className="text-gray-400 font-pixel text-sm">{t.connectWalletDescription}</p>
              </div>
            </div>
          )}

          {/* 无任务提示 */}
          {tasks.length === 0 && connected && (
            <div className="text-center py-12">
              <div className="pixel-card p-8 max-w-md mx-auto">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-retro text-retro-green mb-2">{t.noActiveTasks}</h3>
                <p className="text-gray-400 font-pixel text-sm">{t.newTasksPreparing}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <BackToTop />
    </>
  )
}