'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface TimeZoneConfig {
  timezone: string
  country: string
  flag: string
}

const timeZoneMap: Record<string, TimeZoneConfig> = {
  en: {
    timezone: 'America/New_York', // 美国东部时间
    country: 'United States',
    flag: '🇺🇸'
  },
  zh: {
    timezone: 'Asia/Shanghai', // 中国时间
    country: '中国',
    flag: '🇨🇳'
  },
  ja: {
    timezone: 'Asia/Tokyo', // 日本时间
    country: '日本',
    flag: '🇯🇵'
  },
  ko: {
    timezone: 'Asia/Seoul', // 韩国时间
    country: '대한민국',
    flag: '🇰🇷'
  }
}

export default function TimeDisplay() {
  const { lang } = useLanguage()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const config = timeZoneMap[lang]
      const now = new Date()
      
      // 格式化时间
      const timeOptions: Intl.DateTimeFormatOptions = {
        timeZone: config.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: lang === 'en' // 英文使用12小时制，其他使用24小时制
      }
      
      // 格式化日期
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: config.timezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }
      
      // 根据语言设置locale
      const locale = {
        en: 'en-US',
        zh: 'zh-CN',
        ja: 'ja-JP',
        ko: 'ko-KR'
      }[lang]
      
      setCurrentTime(now.toLocaleTimeString(locale, timeOptions))
      setCurrentDate(now.toLocaleDateString(locale, dateOptions))
    }

    // 立即更新一次
    updateTime()
    
    // 每秒更新时间
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [lang])

  const config = timeZoneMap[lang]

  const timeLabels = {
    en: 'Local Time',
    zh: '当地时间',
    ja: '現地時間',
    ko: '현지 시간'
  }

  return (
    <div className="flex flex-col items-center space-y-2 p-4 bg-gray-900/50 rounded-lg border border-retro-green/30">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{config.flag}</span>
        <span className="text-retro-green font-pixel text-sm">
          {timeLabels[lang]}
        </span>
      </div>
      
      <div className="text-center">
        <div className="text-retro-cyan font-retro text-xl mb-1">
          {currentTime}
        </div>
        <div className="text-gray-400 font-pixel text-xs">
          {currentDate}
        </div>
      </div>
    </div>
  )
} 