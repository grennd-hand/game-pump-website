import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export default async function handler(req, res) {
  try {
    await dbConnect()
  } catch (error) {
    console.error('数据库连接失败:', error)
    return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/tasks?auth_error=database_error`)
  }

  if (req.method === 'GET') {
    const { code, state, error } = req.query

    if (error) {
      return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/tasks?auth_error=${encodeURIComponent(error)}`)
    }

    if (!code || !state) {
      return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/tasks?auth_error=missing_params`)
    }

    try {
      // 解析state获取钱包地址和平台
      const [walletAddress, platform] = state.split('_')
      
      if (!walletAddress || !platform) {
        return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/tasks?auth_error=invalid_state`)
      }

      // 验证state
      const user = await User.findOne({ 
        walletAddress,
        [`pendingAuth.${platform}.state`]: state 
      })

      if (!user) {
        return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/tasks?auth_error=invalid_request`)
      }

      if (platform === 'twitter') {
        // 使用授权码换取访问令牌
        const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`
          },
          body: new URLSearchParams({
            code,
            grant_type: 'authorization_code',
            client_id: process.env.TWITTER_CLIENT_ID,
            redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/social-callback`,
            code_verifier: 'challenge'
          })
        })

        const tokenData = await tokenResponse.json()

        if (!tokenData.access_token) {
          throw new Error('获取访问令牌失败')
        }

        // 获取用户信息
        const userResponse = await fetch('https://api.twitter.com/2/users/me', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        })

        const userData = await userResponse.json()

        if (!userData.data) {
          throw new Error('获取用户信息失败')
        }

        // 更新用户数据
        await User.findOneAndUpdate(
          { walletAddress },
          {
            $set: {
              'socialAccounts.twitter': {
                id: userData.data.id,
                username: userData.data.username,
                verified: true,
                connectedAt: new Date()
              },
              [`pendingAuth.${platform}.completed`]: true
            }
          }
        )

      } else if (platform === 'telegram') {
        // Telegram 的处理逻辑会通过 Bot Webhook 处理
        // 这里只是标记为等待状态
        await User.findOneAndUpdate(
          { walletAddress },
          {
            $set: {
              [`pendingAuth.${platform}.awaitingBot`]: true
            }
          }
        )
      }

      // 关闭弹窗并返回主页面
      return res.send(`
        <html>
          <head><title>授权成功</title></head>
          <body>
            <script>
              window.opener?.postMessage({ type: 'AUTH_SUCCESS', platform: '${platform}' }, '*');
              window.close();
            </script>
            <div style="text-align: center; padding: 50px; font-family: Arial;">
              <h2>✅ 授权成功</h2>
              <p>正在返回主页面...</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 2000);
              </script>
            </div>
          </body>
        </html>
      `)

    } catch (error) {
      console.error('OAuth回调错误:', error)
      return res.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/tasks?auth_error=${encodeURIComponent(error.message)}`)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 