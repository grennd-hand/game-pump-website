'use client'

import { useEffect, useRef } from 'react'

interface PageSoundEffectsProps {
  isLoading: boolean
  pageKey: string
}

export default function PageSoundEffects({ isLoading, pageKey }: PageSoundEffectsProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const previousPageKeyRef = useRef<string>('')

  useEffect(() => {
    // 初始化音频上下文
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.log('音频上下文初始化失败:', error)
      }
    }
  }, [])

  useEffect(() => {
    // 页面切换时播放音效
    if (pageKey !== previousPageKeyRef.current && previousPageKeyRef.current !== '') {
      playPageTransitionSound()
    }
    previousPageKeyRef.current = pageKey
  }, [pageKey])

  useEffect(() => {
    // 加载完成时播放音效
    if (!isLoading && audioContextRef.current) {
      playLoadCompleteSound()
    }
  }, [isLoading])

  const createBeep = (frequency: number, duration: number, volume: number = 0.1) => {
    if (!audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    oscillator.type = 'square' // 像素风格的方波

    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }

  const playPageTransitionSound = () => {
    // 页面切换音效：上升音调
    createBeep(440, 0.1, 0.05) // A4
    setTimeout(() => createBeep(554, 0.1, 0.05), 50) // C#5
    setTimeout(() => createBeep(659, 0.1, 0.05), 100) // E5
  }

  const playLoadCompleteSound = () => {
    // 加载完成音效：确认音
    createBeep(523, 0.15, 0.08) // C5
    setTimeout(() => createBeep(659, 0.15, 0.08), 100) // E5
  }

  return null
}

// 导出音效钩子
export const usePageSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.log('音频上下文初始化失败:', error)
      }
    }
  }, [])

  const playClickSound = () => {
    if (!audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime)
    oscillator.type = 'square'

    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.05, audioContextRef.current.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.1)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + 0.1)
  }

  const playHoverSound = () => {
    if (!audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime)
    oscillator.type = 'square'

    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.03, audioContextRef.current.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.05)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + 0.05)
  }

  return { playClickSound, playHoverSound }
} 