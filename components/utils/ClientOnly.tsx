'use client'

import { useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ClientOnly({ children, fallback }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {fallback || (
          <div className="text-center">
            <p className="text-retro-green font-pixel">加载中...</p>
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
} 