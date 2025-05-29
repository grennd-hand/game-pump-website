export function setupWalletErrorHandler() {
  if (typeof window === 'undefined') return;

  // 捕获未处理的Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // 检查是否是钱包相关错误
    if (isWalletError(error)) {
      console.warn('🔌 捕获到钱包相关的未处理Promise错误，静默刷新:', error);
      
      // 阻止错误冒泡到控制台和开发环境错误弹窗
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // 静默刷新页面
      showWalletErrorToast();
      
      return;
    }
  });

  // 捕获运行时错误
  window.addEventListener('error', (event) => {
    const error = event.error;
    
    if (isWalletError(error)) {
      console.warn('🔌 捕获到钱包相关的运行时错误，静默刷新:', error);
      
      // 阻止错误显示在控制台和开发环境错误弹窗
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // 静默刷新页面
      showWalletErrorToast();
      
      return;
    }
  });

  // 强化错误提示隐藏逻辑
  const hideAllErrorIndicators = () => {
    try {
      // 1. 隐藏Next.js错误相关的元素
      const errorIndicators = document.querySelectorAll('[data-nextjs-toast-errors], [data-nextjs-dialog-overlay], [data-nextjs-dialog]');
      errorIndicators.forEach(indicator => {
        indicator.remove();
        console.log('🔇 移除Next.js错误指示器');
      });
    
      // 2. 查找所有固定定位的元素
      const allFixedElements = document.querySelectorAll('div[style*="position: fixed"], div[style*="position:fixed"], div[class*="fixed"]');
    allFixedElements.forEach(el => {
      const text = el.textContent?.toLowerCase() || '';
      const style = el.getAttribute('style') || '';
      const className = (el.className && typeof el.className === 'string' ? el.className : (el.className ? Array.from(el.className).join(' ') : '')).toLowerCase();
        
        // 检查是否是错误提示元素
        const isErrorElement = (
          // 包含错误文字
          (text.includes('error') || text.includes('1 error') || text.includes('错误')) &&
          // 位于底部或左下角
          (style.includes('bottom') || className.includes('bottom')) &&
          // 不是重要的UI元素
          !className.includes('modal') && 
          !className.includes('dropdown') && 
          !className.includes('tooltip') &&
          !el.closest('[data-keep]') // 保护标记了data-keep的元素
        );
        
        if (isErrorElement) {
        el.remove();
          console.log('🔇 移除错误提示元素:', text.substring(0, 50));
      }
    });
      
      // 3. 查找并隐藏可能的错误弹窗
      const errorDialogs = document.querySelectorAll('div[role="dialog"], div[role="alertdialog"]');
      errorDialogs.forEach(dialog => {
        const text = dialog.textContent?.toLowerCase() || '';
        if (text.includes('error') || text.includes('错误') || text.includes('_bn')) {
          dialog.remove();
          console.log('🔇 移除错误对话框');
        }
      });
      
      // 4. 隐藏可能的错误覆盖层
      const overlays = document.querySelectorAll('div[style*="z-index"], div[class*="overlay"], div[class*="backdrop"]');
      overlays.forEach(overlay => {
        const text = overlay.textContent?.toLowerCase() || '';
        if (text.includes('error') || text.includes('错误')) {
          overlay.remove();
          console.log('🔇 移除错误覆盖层');
        }
      });
      
    } catch (e) {
      // 静默处理隐藏错误时的异常
      console.warn('隐藏错误提示时出现异常:', e);
    }
  };

  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          const text = element.textContent?.toLowerCase() || '';
          const style = element.getAttribute('style') || '';
          const className = (element.className && typeof element.className === 'string' ? element.className : (element.className ? Array.from(element.className).join(' ') : '')).toLowerCase();
          
          // 检查是否是错误提示元素并立即移除
          const isErrorElement = (
            element.getAttribute('data-nextjs-toast-errors') !== null ||
            element.getAttribute('data-nextjs-dialog-overlay') !== null ||
            element.getAttribute('data-nextjs-dialog') !== null ||
            (
              (text.includes('error') || text.includes('1 error') || text.includes('错误')) &&
              (style.includes('position') && style.includes('bottom')) &&
              !className.includes('modal') && 
              !className.includes('dropdown') && 
              !className.includes('tooltip')
            )
          );
          
          if (isErrorElement) {
            element.remove();
            console.log('🔇 实时移除错误提示元素:', text.substring(0, 50));
          }
        }
      });
    });
  });

  // 开始观察DOM变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // 定期检查并隐藏错误提示
  const intervalId = setInterval(hideAllErrorIndicators, 50);
  
  // 页面卸载时清除定时器和观察器
  window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
    observer.disconnect();
  });
}

function isWalletError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = (error.message || '').toLowerCase();
  const errorStack = (error.stack || '').toLowerCase();
  
  // 只检测真正严重的钱包错误，避免误判
  const isCriticalWalletError = (
    // 钱包扩展内部错误
    (errorMessage.includes('_bn') && errorStack.includes('chrome-extension')) ||
    // 钱包扩展崩溃
    (errorStack.includes('extension://') && errorMessage.includes('disconnect'))
  );
  
  return isCriticalWalletError;
}

function showWalletErrorToast() {
  // 检测到钱包断开连接错误时立即刷新页面
  console.log('🔌 检测到钱包断开连接错误，立即刷新页面...');
  
  // 立即刷新页面，不给错误提示显示的机会
  setTimeout(() => {
    window.location.reload();
  }, 0);
}

// 创建一个防抖的错误处理器，避免重复提示
let lastErrorTime = 0;
const ERROR_DEBOUNCE_TIME = 5000; // 5秒内不重复提示

export function handleWalletError(error: any, context: string = '') {
  const now = Date.now();
  
  if (now - lastErrorTime < ERROR_DEBOUNCE_TIME) {
    return; // 防抖，避免短时间内重复处理
  }
  
  if (isWalletError(error)) {
    console.warn(`🔌 ${context} 钱包错误:`, error);
    lastErrorTime = now;
    showWalletErrorToast();
  }
} 