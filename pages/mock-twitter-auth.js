import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FaXTwitter } from 'react-icons/fa6'

export default function MockTwitterAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: 'GamePump User',
    username: 'gamepump_user_' + Math.random().toString(36).substr(2, 6),
    avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'
  })

  const { state, redirect_uri } = router.query

  const handleAuthorize = async () => {
    setLoading(true)
    
    // 模拟授权延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 生成模拟的授权码
    const code = 'mock_code_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    
    // 构建回调URL
    const callbackUrl = `${redirect_uri}?code=${code}&state=${state}`
    
    // 跳转回应用
    window.location.href = callbackUrl
  }

  const handleDeny = () => {
    const callbackUrl = `${redirect_uri}?error=access_denied&state=${state}`
    window.location.href = callbackUrl
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white text-black rounded-2xl p-8 text-center">
          {/* Twitter Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <FaXTwitter className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">授权应用</h1>
          
          {/* App Info */}
          <div className="bg-purple-100 rounded-lg p-4 mb-6">
            <div className="w-16 h-16 bg-purple-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <span className="text-white font-bold text-xl">GP</span>
            </div>
            <h2 className="font-bold text-lg">GamePump</h2>
            <p className="text-gray-600 text-sm">gamepump.io</p>
          </div>
          
          {/* User Info */}
          <div className="flex items-center mb-6 p-3 bg-gray-50 rounded-lg">
            <img 
              src={userInfo.avatar} 
              alt="avatar" 
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="text-left">
              <div className="font-semibold">{userInfo.name}</div>
              <div className="text-gray-600 text-sm">@{userInfo.username}</div>
            </div>
          </div>
          
          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            <strong>GamePump</strong> 想访问您的 X 账号。
            <br /><br />
            该应用可以：
            <br />• 查看您的个人资料信息
            <br />• 查看您关注的人和粉丝
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAuthorize}
              disabled={loading}
              className="w-full bg-black text-white py-3 px-6 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? '授权中...' : '授权应用'}
            </button>
            
            <button
              onClick={handleDeny}
              disabled={loading}
              className="w-full bg-gray-200 text-gray-800 py-2 px-6 rounded-full font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              取消
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-6">
            点击"授权应用"，即表示您同意 GamePump 的服务条款和隐私政策。
          </p>
          
          {/* Mock Notice */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              🎭 这是一个演示页面，用于展示Twitter OAuth流程
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 