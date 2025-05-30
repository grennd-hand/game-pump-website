// 分析和事件追踪系统
class Analytics {
  constructor() {
    this.events = []
    this.sessionId = this.generateSessionId()
    this.userId = null
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // 设置用户ID
  setUserId(userId) {
    this.userId = userId
    this.track('user_identified', { userId })
  }

  // 追踪事件
  track(eventName, properties = {}) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: this.userId,
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      }
    }

    this.events.push(event)
    console.log('Analytics Event:', event)

    // 发送到各个分析平台
    this.sendToGoogleAnalytics(eventName, properties)
    this.sendToFacebookPixel(eventName, properties)
    this.sendToCustomAPI(event)
  }

  // 发送到Google Analytics
  sendToGoogleAnalytics(eventName, properties) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        custom_parameter_1: properties.value || '',
        custom_parameter_2: properties.category || ''
      })
    }
  }

  // 发送到Facebook Pixel
  sendToFacebookPixel(eventName, properties) {
    if (typeof fbq !== 'undefined') {
      // 标准事件映射
      const eventMapping = {
        'task_completed': 'CompleteRegistration',
        'wallet_connected': 'Lead',
        'social_bind': 'Subscribe',
        'page_view': 'PageView'
      }

      const fbEvent = eventMapping[eventName] || 'CustomEvent'
      
      if (fbEvent === 'CustomEvent') {
        fbq('trackCustom', eventName, properties)
      } else {
        fbq('track', fbEvent, properties)
      }
    }
  }

  // 发送到自定义API
  sendToCustomAPI(event) {
    if (typeof fetch !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(error => {
        console.error('分析事件发送失败:', error)
      })
    }
  }

  // 页面浏览追踪
  pageView(page) {
    this.track('page_view', { page })
  }

  // 钱包连接追踪
  walletConnected(walletType, address) {
    this.track('wallet_connected', { 
      walletType, 
      address: address.slice(0, 8) + '...' // 只记录前8位保护隐私
    })
  }

  // 任务完成追踪
  taskCompleted(taskId, taskType, rewards) {
    this.track('task_completed', { 
      taskId, 
      taskType, 
      rewards,
      value: rewards.points || 0
    })
  }

  // 社交账号绑定追踪
  socialBind(platform, success) {
    this.track('social_bind', { 
      platform, 
      success,
      category: 'social_integration'
    })
  }

  // 错误追踪
  trackError(error, context = {}) {
    this.track('error_occurred', {
      error: error.message || error.toString(),
      stack: error.stack,
      context,
      category: 'error'
    })
  }

  // 性能追踪
  trackPerformance(metric, value) {
    this.track('performance_metric', {
      metric,
      value,
      category: 'performance'
    })
  }

  // 获取所有事件
  getEvents() {
    return this.events
  }

  // 清空事件
  clearEvents() {
    this.events = []
  }
}

// 创建全局实例
const analytics = new Analytics()

// 页面加载完成后自动追踪
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    analytics.pageView(window.location.pathname)
    
    // 追踪页面性能
    const perfData = performance.getEntriesByType('navigation')[0]
    if (perfData) {
      analytics.trackPerformance('page_load_time', perfData.loadEventEnd - perfData.loadEventStart)
      analytics.trackPerformance('dom_ready_time', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)
    }
  })

  // 追踪页面离开
  window.addEventListener('beforeunload', () => {
    analytics.track('page_unload', { 
      timeOnPage: Date.now() - analytics.sessionStartTime 
    })
  })

  // 暴露到全局
  window.analytics = analytics
}

export default analytics 