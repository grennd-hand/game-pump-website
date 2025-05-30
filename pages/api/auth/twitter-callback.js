import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'GET') {
    const { code, state, error } = req.query

    console.log('Twitter回调:', { code: !!code, state, error })

    if (error) {
      return res.redirect(`/tasks?auth_error=${encodeURIComponent(error)}`)
    }

    if (!code || !state) {
      return res.redirect(`/tasks?auth_error=missing_params`)
    }

    try {
      // 真实的Twitter API token交换
      const protocol = req.headers['x-forwarded-proto'] || 'http'
      const host = req.headers.host || 'localhost:3002'
      const redirectUri = `${protocol}://${host}/api/auth/twitter-callback`
      
      const clientId = process.env.TWITTER_CLIENT_ID
      const clientSecret = process.env.TWITTER_CLIENT_SECRET

      console.log('Twitter API 配置:', {
        clientId: clientId ? '已设置' : '未设置',
        clientSecret: clientSecret ? '已设置' : '未设置',
        redirectUri
      })

      if (!clientId || !clientSecret) {
        console.error('Twitter API 凭据未配置')
        return res.redirect(`/tasks?auth_error=api_credentials_missing`)
      }

      // 使用授权码换取访问令牌
      const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: clientId,
          redirect_uri: redirectUri,
          code_verifier: state // 使用state作为code verifier
        })
      })

      const tokenData = await tokenResponse.json()
      console.log('Token响应:', { success: !!tokenData.access_token, error: tokenData.error })

      if (!tokenData.access_token) {
        console.error('获取访问令牌失败:', tokenData)
        return res.redirect(`/tasks?auth_error=token_exchange_failed`)
      }

      // 获取真实的Twitter用户信息
      const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=id,username,name,profile_image_url,verified', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      })

      const userData = await userResponse.json()
      console.log('Twitter用户信息响应:', { success: !!userData.data, error: userData.error })

      if (!userData.data) {
        console.error('获取用户信息失败:', userData)
        return res.redirect(`/tasks?auth_error=user_info_failed`)
      }

      console.log('获取到真实Twitter用户信息:', userData.data)

      // 保存真实的用户数据
      const twitterUserData = {
        id: userData.data.id,
        username: userData.data.username,
        name: userData.data.name,
        profileImage: userData.data.profile_image_url,
        verified: userData.data.verified || false,
        verifiedAt: new Date()
      }

      // 解析state获取钱包地址
      const walletAddress = state.split('_')[0]
      
      if (!walletAddress) {
        return res.redirect(`/tasks?auth_error=invalid_state`)
      }

      // 更新用户数据
      await User.findOneAndUpdate(
        { walletAddress },
        {
          $set: {
            'socialAccounts.twitter': twitterUserData
          }
        },
        { upsert: true }
      )

      // 重定向回任务页面，显示成功消息
      return res.redirect('/tasks?auth_success=twitter_bound')

    } catch (error) {
      console.error('Twitter OAuth回调错误:', error)
      return res.redirect(`/tasks?auth_error=${encodeURIComponent(error.message)}`)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 