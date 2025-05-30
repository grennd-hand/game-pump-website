export default async function handler(req, res) {
  if (req.method === 'POST') {
    const event = req.body
    
    // 添加服务器端信息
    const enrichedEvent = {
      ...event,
      serverTimestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer
    }
    
    // 在生产环境中，这里可以发送到分析服务
    // 比如 Mixpanel, Amplitude, 自定义数据库等
    console.log('Analytics Event Received:', enrichedEvent)
    
    // 根据事件类型进行不同处理
    switch (event.event) {
      case 'task_completed':
        console.log(`用户完成任务: ${event.properties.taskId}`)
        // 可以触发奖励发放等后续逻辑
        break
        
      case 'wallet_connected':
        console.log(`钱包连接: ${event.properties.walletType}`)
        // 可以记录新用户注册
        break
        
      case 'social_bind':
        console.log(`社交账号绑定: ${event.properties.platform}`)
        // 可以更新用户完成度状态
        break
        
      case 'error_occurred':
        console.error(`前端错误: ${event.properties.error}`)
        // 可以发送到错误监控系统
        break
        
      case 'performance_metric':
        console.log(`性能指标: ${event.properties.metric} = ${event.properties.value}ms`)
        // 可以监控应用性能
        break
        
      default:
        console.log(`其他事件: ${event.event}`)
    }
    
    // 简单的事件统计
    if (typeof global.eventStats === 'undefined') {
      global.eventStats = {}
    }
    
    if (!global.eventStats[event.event]) {
      global.eventStats[event.event] = 0
    }
    global.eventStats[event.event]++
    
    res.status(200).json({ 
      success: true, 
      eventReceived: true,
      totalEvents: Object.values(global.eventStats).reduce((a, b) => a + b, 0)
    })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 