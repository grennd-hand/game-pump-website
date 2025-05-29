'use client'

import { useState } from 'react'

export default function ClearDatabasePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [comparison, setComparison] = useState<any>(null)

  const clearData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/clear-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setResult(data)
    } catch (error: unknown) {
      setResult({ error: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const checkConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug-connection')
      const data = await response.json()
      setResult(data)
    } catch (error: unknown) {
      setResult({ error: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const checkData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug-data-detail')
      const data = await response.json()
      setResult(data)
    } catch (error: unknown) {
      setResult({ error: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const clearCache = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setResult(data)
    } catch (error: unknown) {
      setResult({ error: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const compareData = async () => {
    setLoading(true)
    try {
      // 并行获取缓存和强制数据
      const [cachedResponse, forceResponse] = await Promise.all([
        fetch('/api/stats'),
        fetch(`/api/stats-force?t=${Date.now()}`)
      ])
      
      const cachedData = await cachedResponse.json()
      const forceData = await forceResponse.json()
      
      setComparison({
        cached: cachedData.stats || {},
        force: forceData.stats || {},
        timestamp: new Date().toISOString()
      })
      
      setResult({
        message: '数据对比完成',
        cached: `缓存API用户数: ${cachedData.stats?.totalUsers || 0}`,
        force: `强制API用户数: ${forceData.stats?.totalUsers || 0}`,
        match: cachedData.stats?.totalUsers === forceData.stats?.totalUsers
      })
    } catch (error: unknown) {
      setResult({ error: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const clearAllAndRefresh = async () => {
    setLoading(true)
    try {
      // 1. 清空数据
      await fetch('/api/clear-data', { method: 'POST' })
      
      // 2. 清空缓存
      await fetch('/api/clear-cache', { method: 'POST' })
      
      // 3. 强制清除SWR缓存
      if (typeof window !== 'undefined' && (window as any).swrCache) {
        (window as any).swrCache.clear()
      }
      
      // 4. 检查结果
      const response = await fetch('/api/debug-data-detail')
      const data = await response.json()
      setResult({
        ...data,
        message: '数据和缓存已全部清空，请硬刷新页面'
      })
    } catch (error: unknown) {
      setResult({ error: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  const forceRefreshPage = () => {
    // 强制刷新页面
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">数据库管理</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 左侧：基本操作 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">基本操作</h2>
            <div className="space-y-4">
              <button
                onClick={checkConnection}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? '检查中...' : '检查数据库连接'}
              </button>
              
              <button
                onClick={checkData}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? '检查中...' : '检查当前数据'}
              </button>
              
              <button
                onClick={clearData}
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? '清空中...' : '清空所有数据'}
              </button>

              <button
                onClick={clearCache}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? '清除中...' : '清除应用缓存'}
              </button>

              <button
                onClick={clearAllAndRefresh}
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? '处理中...' : '清空数据+缓存'}
              </button>

              <button
                onClick={forceRefreshPage}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                🔄 强制刷新页面
              </button>
            </div>
          </div>

          {/* 右侧：缓存诊断 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">缓存诊断</h2>
            <div className="space-y-4">
              <button
                onClick={compareData}
                disabled={loading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? '对比中...' : '🔍 对比缓存vs实时数据'}
              </button>
              
              <div className="text-sm text-gray-600">
                <p>这个功能会同时调用：</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><code>/api/stats</code> (有缓存)</li>
                  <li><code>/api/stats-force</code> (无缓存)</li>
                </ul>
                <p className="mt-2">对比两个API返回的数据是否一致</p>
              </div>
            </div>
          </div>
        </div>

        {/* 数据对比结果 */}
        {comparison && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📊 数据对比结果</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">🗄️ 缓存API (/api/stats)</h3>
                <div className="bg-blue-50 p-3 rounded text-sm">
                  <p>用户数: <span className="font-bold">{comparison.cached.totalUsers || 0}</span></p>
                  <p>代币数: <span className="font-bold">{comparison.cached.totalTokens || 0}</span></p>
                  <p>投票数: <span className="font-bold">{comparison.cached.totalVotes || 0}</span></p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-green-600 mb-2">⚡ 强制API (/api/stats-force)</h3>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <p>用户数: <span className="font-bold">{comparison.force.totalUsers || 0}</span></p>
                  <p>代币数: <span className="font-bold">{comparison.force.totalTokens || 0}</span></p>
                  <p>投票数: <span className="font-bold">{comparison.force.totalVotes || 0}</span></p>
                </div>
              </div>
            </div>
            <div className={`mt-4 p-3 rounded text-center font-bold ${
              comparison.cached.totalUsers === comparison.force.totalUsers 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {comparison.cached.totalUsers === comparison.force.totalUsers 
                ? '✅ 数据一致' 
                : '❌ 数据不一致 - 存在缓存问题'}
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">操作结果</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">解决同步问题：</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>点击"对比缓存vs实时数据"诊断问题</li>
            <li>如果数据不一致，点击"清空数据+缓存"</li>
            <li>点击"强制刷新页面"</li>
            <li>返回主页检查是否同步</li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold text-blue-800 mb-2">问题分析：</h3>
          <p className="text-blue-700 text-sm">
            前端使用SWR缓存，Vercel有CDN缓存，Next.js也有缓存。强制API绕过所有缓存直接查询数据库，
            可以对比找出具体是哪一层缓存导致的数据不同步。
          </p>
        </div>
      </div>
    </div>
  )
} 