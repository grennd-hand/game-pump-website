'use client'

import { useEffect } from 'react'

interface PagePreloaderProps {
  routes: string[]
}

export default function PagePreloader({ routes }: PagePreloaderProps) {
  useEffect(() => {
    // 预加载页面资源
    const preloadPages = () => {
      routes.forEach(route => {
        // 创建隐藏的 link 元素进行预加载
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = route
        document.head.appendChild(link)
      })
    }

    // 延迟预加载，避免影响当前页面性能
    const timer = setTimeout(preloadPages, 1000)

    return () => clearTimeout(timer)
  }, [routes])

  return null
}

// 导出预加载钩子
export const usePagePreloader = () => {
  const preloadRoute = (route: string) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = route
    document.head.appendChild(link)
  }

  return { preloadRoute }
} 