export default async function handler(req, res) {
  if (req.method === 'GET') {
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const host = req.headers.host || 'localhost:3002'
    const redirectUri = `${protocol}://${host}/api/auth/twitter-callback`
    
    const config = {
      clientId: process.env.TWITTER_CLIENT_ID ? '已设置' : '未设置',
      clientSecret: process.env.TWITTER_CLIENT_SECRET ? '已设置' : '未设置',
      redirectUri,
      protocol,
      host,
      nodeEnv: process.env.NODE_ENV || 'development'
    }
    
    res.json({
      success: true,
      config,
      instructions: {
        '1': '在Twitter Developer Portal创建应用',
        '2': '设置OAuth 2.0回调URL为: ' + redirectUri,
        '3': '启用OAuth 2.0',
        '4': '设置应用权限为 Read',
        '5': '复制客户端ID和密钥到.env.local文件'
      }
    })
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 