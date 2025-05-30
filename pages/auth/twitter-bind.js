import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function TwitterBind() {
  const router = useRouter()
  const { wallet } = router.query
  const [status, setStatus] = useState('input')

  const handleSubmit = () => {
    const username = prompt('请输入您的Twitter用户名（不包含@符号）:')
    if (username) {
      setStatus('success')
      
      // 发送用户信息给父窗口
      window.opener?.postMessage({
        type: 'TWITTER_USER_INFO',
        userInfo: { username: username.replace('@', ''), source: 'manual_input' }
      }, window.location.origin)
      
      // 延迟关闭窗口
      setTimeout(() => {
        window.close()
      }, 1000)
    }
  }

  const handleTwitterLogin = () => {
    // 跳转到Twitter，用户登录后可以看到自己的用户名
    window.open('https://twitter.com/home', '_blank')
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        {status === 'input' && (
          <>
            <div className="text-6xl mb-6">🐦</div>
            <h2 className="text-2xl mb-4 font-bold">绑定Twitter账号</h2>
            <p className="text-gray-400 mb-6">
              请输入您的Twitter用户名以完成账号绑定
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={handleSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                输入Twitter用户名
              </button>
              
              <p className="text-sm text-gray-500">或者</p>
              
              <button 
                onClick={handleTwitterLogin}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                打开Twitter查看我的用户名
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              提示：您的Twitter用户名是@符号后面的部分
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl mb-4">绑定成功！</h2>
            <p className="text-gray-400">正在返回主页面...</p>
          </>
        )}
      </div>
    </div>
  )
} 