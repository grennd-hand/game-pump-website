import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === 'POST') {
    const { walletAddress, platform, username, userData } = req.body

    if (!walletAddress || !platform) {
      return res.status(400).json({ 
        success: false, 
        error: '缺少必要参数' 
      })
    }

    try {
      // 更新用户社交账号信息
      const updateData = {}
      
      if (platform === 'twitter') {
        updateData['socialAccounts.twitter'] = {
          ...userData,
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
        message: `${platform}账号绑定成功！`
      })
      
    } catch (error) {
      console.error('更新用户社交账号失败:', error)
      return res.status(500).json({ 
        success: false, 
        error: '服务器错误: ' + error.message
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 