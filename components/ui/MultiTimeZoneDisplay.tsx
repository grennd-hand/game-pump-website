'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface TimeZoneInfo {
  timezone: string
  country: string
  flag: string
  code: string
  locale: string
  hour12: boolean
}

const timeZones: TimeZoneInfo[] = [
  {
    timezone: 'America/New_York',
    country: 'United States',
    flag: '🇺🇸',
    code: 'EN',
    locale: 'en-US',
    hour12: true
  },
  {
    timezone: 'Asia/Shanghai',
    country: '中国',
    flag: '🇨🇳',
    code: 'CN',
    locale: 'zh-CN',
    hour12: false
  },
  {
    timezone: 'Asia/Tokyo',
    country: '日本',
    flag: '🇯🇵',
    code: 'JP',
    locale: 'ja-JP',
    hour12: false
  },
  {
    timezone: 'Asia/Seoul',
    country: '대한민국',
    flag: '🇰🇷',
    code: 'KR',
    locale: 'ko-KR',
    hour12: false
  }
]

export default function MultiTimeZoneDisplay() {
  const { lang } = useLanguage()
  const [times, setTimes] = useState<{ [key: string]: string }>({})
  const [dates, setDates] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date()
      const newTimes: { [key: string]: string } = {}
      const newDates: { [key: string]: string } = {}

      timeZones.forEach(zone => {
        // 格式化时间
        const timeOptions: Intl.DateTimeFormatOptions = {
          timeZone: zone.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: zone.hour12
        }
        
        // 格式化日期
        const dateOptions: Intl.DateTimeFormatOptions = {
          timeZone: zone.timezone,
          month: 'short',
          day: 'numeric'
        }
        
        newTimes[zone.code] = now.toLocaleTimeString(zone.locale, timeOptions)
        newDates[zone.code] = now.toLocaleDateString(zone.locale, dateOptions)
      })

      setTimes(newTimes)
      setDates(newDates)
    }

    // 立即更新一次
    updateTimes()
    
    // 每秒更新时间
    const interval = setInterval(updateTimes, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const titleMap = {
    en: 'Global Time Zones',
    zh: '全球时区',
    ja: '世界のタイムゾーン',
    ko: '세계 시간대'
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-retro-green font-retro text-xl mb-2">
          {titleMap[lang]}
        </h3>
        <div className="w-16 h-0.5 bg-retro-green mx-auto"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {timeZones.map(zone => (
          <div 
            key={zone.code}
            className={`pixel-card p-4 transition-all duration-300 ${
              lang === zone.code.toLowerCase() 
                ? 'border-retro-green border-2 bg-retro-green/10' 
                : 'border-gray-600'
            }`}
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-2xl">{zone.flag}</span>
                <span className={`font-pixel text-xs ${
                  lang === zone.code.toLowerCase() ? 'text-retro-green' : 'text-gray-400'
                }`}>
                  {zone.code}
                </span>
              </div>
              
              <div className={`font-retro text-lg mb-1 ${
                lang === zone.code.toLowerCase() ? 'text-retro-cyan' : 'text-white'
              }`}>
                {times[zone.code] || '00:00:00'}
              </div>
              
              <div className="text-gray-400 font-pixel text-xs">
                {dates[zone.code] || ''}
              </div>
              
              <div className="text-gray-500 font-pixel text-xs mt-1">
                {zone.country}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 