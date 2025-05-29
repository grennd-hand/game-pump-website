// 错误抑制器 - 专门用于隐藏钱包断开连接时的错误提示

export function suppressAllErrors() {
  if (typeof window === 'undefined') return;
  
  console.log('🔇 启动错误抑制器...');
  
  // 1. 立即隐藏现有的错误提示
  const hideExistingErrors = () => {
    try {
      // 查找所有可能的错误提示元素
      const selectors = [
        '[data-nextjs-toast-errors]',
        '[data-nextjs-dialog-overlay]', 
        '[data-nextjs-dialog]',
        '[data-nextjs-error-overlay]',
        'div[style*="position: fixed"]',
        'div[style*="position:fixed"]',
        'div[class*="fixed"]',
        'div[role="dialog"]',
        'div[role="alertdialog"]',
        'div[class*="error"]',
        'div[class*="toast"]',
        'div[class*="notification"]'
      ];
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent?.toLowerCase() || '';
          const className = (el.className && typeof el.className === 'string' ? el.className : (el.className ? Array.from(el.className).join(' ') : '')).toLowerCase();
          
          // 检查是否是错误相关的元素
          const isErrorElement = (
            text.includes('error') || 
            text.includes('错误') || 
            text.includes('1 error') ||
            text.includes('_bn') ||
            text.includes('disconnect') ||
            className.includes('error') ||
            className.includes('toast-error')
          );
          
          // 确保不移除重要的UI元素
          const isImportantElement = (
            className.includes('modal') ||
            className.includes('dropdown') ||
            className.includes('tooltip') ||
            className.includes('menu') ||
            el.closest('[data-keep]') ||
            el.closest('[role="main"]') ||
            el.closest('nav') ||
            el.closest('header') ||
            el.closest('footer')
          );
          
          if (isErrorElement && !isImportantElement) {
            el.remove();
            console.log('🔇 移除错误元素:', text.substring(0, 50));
          }
        });
      });
      
    } catch (e) {
      console.warn('隐藏错误时出现异常:', e);
    }
  };
  
  // 2. 立即执行一次
  hideExistingErrors();
  
  // 3. 设置定时器持续监控
  const intervalId = setInterval(hideExistingErrors, 100);
  
  // 4. 设置MutationObserver监听新增的错误元素
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          const text = element.textContent?.toLowerCase() || '';
          const className = (element.className && typeof element.className === 'string' ? element.className : (element.className ? Array.from(element.className).join(' ') : '')).toLowerCase();
          
          // 立即检查并移除新增的错误元素
          const isErrorElement = (
            element.hasAttribute('data-nextjs-toast-errors') ||
            element.hasAttribute('data-nextjs-dialog-overlay') ||
            element.hasAttribute('data-nextjs-dialog') ||
            element.hasAttribute('data-nextjs-error-overlay') ||
            text.includes('error') ||
            text.includes('错误') ||
            text.includes('1 error') ||
            text.includes('_bn') ||
            className.includes('error') ||
            className.includes('toast-error')
          );
          
          const isImportantElement = (
            className.includes('modal') ||
            className.includes('dropdown') ||
            className.includes('tooltip') ||
            element.closest('[data-keep]')
          );
          
          if (isErrorElement && !isImportantElement) {
            element.remove();
            console.log('🔇 实时移除新增错误元素:', text.substring(0, 50));
          }
        }
      });
    });
  });
  
  // 开始观察
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 5. 返回清理函数
  return () => {
    clearInterval(intervalId);
    observer.disconnect();
    console.log('🔇 错误抑制器已停止');
  };
}

// 快速隐藏错误的函数
export function quickHideErrors() {
  if (typeof window === 'undefined') return;
  
  try {
    // 快速移除常见的错误提示
    const errorSelectors = [
      '[data-nextjs-toast-errors]',
      '[data-nextjs-dialog-overlay]',
      '[data-nextjs-dialog]',
      'div[style*="position: fixed"][style*="bottom"]',
      'div[class*="fixed"][class*="bottom"]'
    ];
    
    errorSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const text = el.textContent?.toLowerCase() || '';
        if (text.includes('error') || text.includes('错误')) {
          el.remove();
          console.log('🔇 快速移除错误提示');
        }
      });
    });
    
  } catch (e) {
    console.warn('快速隐藏错误失败:', e);
  }
} 