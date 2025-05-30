import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { publicKey } = useWallet()

  const fetchTasks = async (category = null) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (category) {
        params.append('category', category)
      }
      
      if (publicKey) {
        params.append('walletAddress', publicKey.toString())
      }
      
      const response = await fetch(`/api/tasks?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setTasks(data.tasks)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('获取任务失败')
      console.error('获取任务失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const completeTask = async (taskId, verificationData = {}) => {
    try {
      if (!publicKey) {
        throw new Error('请先连接钱包')
      }

      const response = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          walletAddress: publicKey.toString(),
          verificationData
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        // 刷新任务列表
        await fetchTasks()
        return data
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      throw new Error(err.message || '完成任务失败')
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    if (publicKey) {
      fetchTasks()
    }
  }, [publicKey])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    completeTask,
    refetch: fetchTasks
  }
} 