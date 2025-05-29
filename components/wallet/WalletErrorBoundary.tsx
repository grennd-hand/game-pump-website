'use client';

import React, { Component, ReactNode } from 'react';

interface WalletErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface WalletErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class WalletErrorBoundary extends Component<WalletErrorBoundaryProps, WalletErrorBoundaryState> {
  constructor(props: WalletErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): WalletErrorBoundaryState {
    // 只处理严重的钱包错误，避免误判正常的连接过程
    const isCriticalWalletError = error.message.includes('_bn') && 
                                 error.stack?.includes('chrome-extension');
    
    if (isCriticalWalletError) {
      console.warn('🔌 严重钱包错误已被捕获:', error);
      return { hasError: true, error };
    }
    
    // 其他错误正常处理
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('WalletErrorBoundary caught an error:', error, errorInfo);
    
    // 只记录错误，不自动刷新页面
    if (typeof window !== 'undefined' && (window as any).addToast) {
      (window as any).addToast({
        type: 'warning',
        title: '⚠️ 应用错误',
        message: '检测到应用错误，请刷新页面重试',
        duration: 5000
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    
    // 尝试重新加载页面
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="pixel-card border-red-400 bg-red-400/10 p-6 max-w-md mx-auto text-center">
          <div className="text-red-400 font-pixel mb-4">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-lg mb-2">钱包连接异常</div>
            <div className="text-sm text-gray-400 mb-4">
              检测到钱包扩展内部错误，这通常是由于钱包扩展的临时问题导致的。
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={this.handleRetry}
              className="neon-button text-retro-cyan border-retro-cyan px-6 py-2"
            >
              🔄 刷新页面
            </button>
            
            <div className="text-xs text-gray-500 font-pixel">
              <div>建议操作：</div>
              <div>• 刷新浏览器页面</div>
              <div>• 重启钱包扩展</div>
              <div>• 清除浏览器缓存</div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 