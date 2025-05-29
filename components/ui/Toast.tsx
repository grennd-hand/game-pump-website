'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'border-retro-green bg-retro-green/10 text-retro-green';
      case 'error': return 'border-red-400 bg-red-400/10 text-red-400';
      case 'warning': return 'border-retro-yellow bg-retro-yellow/10 text-retro-yellow';
      case 'info': return 'border-retro-cyan bg-retro-cyan/10 text-retro-cyan';
      default: return 'border-retro-cyan bg-retro-cyan/10 text-retro-cyan';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={`pixel-card p-4 min-w-[300px] max-w-[400px] ${getColors()}`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-xl">{getIcon()}</div>
        <div className="flex-1">
          <div className="font-pixel text-sm font-bold">{title}</div>
          {message && (
            <div className="font-pixel text-xs mt-1 opacity-80">{message}</div>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

export interface ToastContextType {
  addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  removeToast: (id: string) => void;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // 全局暴露addToast函数
  useEffect(() => {
    (window as any).addToast = addToast;
    return () => {
      delete (window as any).addToast;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
} 