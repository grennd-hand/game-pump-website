'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'zh' | 'ja' | 'ko'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en') // 默认英文

  // 从 localStorage 读取语言设置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('gamepump-language') as Language
      if (savedLang && ['en', 'zh', 'ja', 'ko'].includes(savedLang)) {
        setLang(savedLang)
      }
    }
  }, [])

  // 保存语言设置到 localStorage
  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('gamepump-language', newLang)
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 