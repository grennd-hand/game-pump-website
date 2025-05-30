import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import crypto from 'crypto'

// 生成代码验证器 (Code Verifier)
function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url')
}

// 生成代码挑战 (Code Challenge)
async function generateCodeChallenge(verifier) {
  const hash = crypto.createHash('sha256').update(verifier).digest()
  return hash.toString('base64url')
}

export default async function handler(req, res) {
  console.log('social-auth API called:', { method: req.method, body: req.body, query: req.query })
  
  try {
    await dbConnect()
    console.log('数据库连接成功')
  } catch (error) {
    console.error('数据库连接失败:', error)
    return res.status(500).json({ 
      success: false, 
      error: '数据库连接失败: ' + error.message
    })
  }

  if (req.method === 'POST') {
    const { walletAddress, platform, action, username, taskType } = req.body

    if (!walletAddress || !platform) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必要参数' 
      })
    }

    try {
      if (action === 'init') {
        console.log('初始化Twitter OAuth授权:', { walletAddress, platform })
        
        if (platform === 'twitter') {
          // 生成Twitter OAuth 2.0 PKCE授权URL
          const state = `${walletAddress}_${Date.now()}`
          const codeVerifier = generateCodeVerifier()
          const codeChallenge = await generateCodeChallenge(codeVerifier)
          
          const protocol = req.headers['x-forwarded-proto'] || 'http'
          const host = req.headers.host || 'localhost:3002'
          const redirectUri = `${protocol}://${host}/api/auth/twitter-callback`
          
          // Twitter OAuth 2.0授权URL（使用应用专用的客户端ID）
          const clientId = process.env.TWITTER_CLIENT_ID || 'dUJhbkUzTVRGMkxqSTNNVEE2MTpjaQ' // 临时测试用
          const scopes = 'tweet.read users.read offline.access'
          
          console.log('Twitter OAuth 配置:', {
            clientId: clientId ? '已设置' : '未设置',
            redirectUri,
            protocol,
            host
          })
          
          const authUrl = `https://twitter.com/i/oauth2/authorize?` +
            `response_type=code&` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `scope=${encodeURIComponent(scopes)}&` +
            `state=${state}&` +
            `code_challenge=${codeChallenge}&` +
            `code_challenge_method=S256`
          
          // 保存授权状态和code verifier
          await User.findOneAndUpdate(
            { walletAddress },
            {
              $set: {
                'pendingAuth.twitter': {
                  state,
                  codeVerifier,
                  initiated: new Date(),
                  completed: false
                }
              }
            },
            { upsert: true }
          )
          
          console.log('生成Twitter授权URL:', authUrl)
          
          return res.json({ 
            success: true, 
            authUrl,
            message: '请在Twitter页面完成授权'
          })
        } else if (platform === 'telegram') {
          // Telegram简化处理
          return res.json({ 
            success: true, 
            authUrl: 'https://t.me/GamePumpChannel',
            message: '请加入Telegram频道'
          })
        }
      } else if (action === 'verify') {
        // 验证用户完成任务
        console.log('验证任务完成:', { walletAddress, platform, username })
        
        if (!username) {
          return res.status(400).json({ 
            success: false, 
            error: '请输入用户名' 
          })
        }
        
        // 更新用户社交账号信息
        const updateData = {}
        if (platform === 'twitter') {
          updateData['socialAccounts.twitter'] = {
            username: username.replace('@', ''),
            verified: true,
            verifiedAt: new Date()
          }
        } else if (platform === 'telegram') {
          updateData['socialAccounts.telegram'] = {
            username: username.replace('@', ''),
            verified: true,
            verifiedAt: new Date()
          }
        }
        
        await User.findOneAndUpdate(
          { walletAddress },
          { $set: updateData },
          { upsert: true }
        )
        
        return res.json({ 
          success: true, 
          message: `${platform === 'twitter' ? 'Twitter' : 'Telegram'}账号绑定成功！`
        })
      }
    } catch (error) {
      console.error('处理错误:', error)
      return res.status(500).json({ 
        success: false, 
        error: '服务器错误: ' + error.message
      })
    }
  } else if (req.method === 'GET') {
    // 检查授权状态
    const { walletAddress, platform } = req.query
    console.log('检查授权状态:', { walletAddress, platform })

    try {
      const user = await User.findOne({ walletAddress })
      const isCompleted = user?.socialAccounts?.[platform]?.verified || false
      
      return res.json({ 
        success: true, 
        completed: isCompleted,
        username: user?.socialAccounts?.[platform]?.username || null
      })
    } catch (error) {
      return res.json({ 
        success: true, 
        completed: false 
      })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 