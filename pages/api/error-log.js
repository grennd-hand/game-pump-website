export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { msg, url, line, col, error, type, userAgent } = req.body
    
    // 记录错误信息
    const errorInfo = {
      timestamp: new Date().toISOString(),
      type: type || 'javascript',
      message: msg,
      url,
      line,
      col,
      error,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      referer: req.headers.referer
    }
    
    // 在生产环境中，这里可以发送到错误监控服务
    // 比如 Sentry, LogRocket, 或自定义的日志系统
    console.error('前端错误:', errorInfo)
    
    // 可以根据错误类型进行不同处理
    if (errorInfo.message?.includes('ChunkLoadError')) {
      // 代码分割加载错误
      console.log('代码块加载失败，可能需要刷新页面')
    } else if (errorInfo.message?.includes('Network Error')) {
      // 网络错误
      console.log('网络连接错误')
    } else if (errorInfo.type === 'promise') {
      // Promise未处理错误
      console.log('Promise错误:', errorInfo.error)
    }
    
    res.status(200).json({ success: true, logged: true })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 