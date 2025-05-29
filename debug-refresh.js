// 调试页面刷新的脚本
// 在浏览器控制台中运行此脚本来监控刷新原因

(function() {
  console.log('🔍 开始监控页面刷新原因...');
  
  // 保存原始的 window.location.reload 方法
  const originalReload = window.location.reload;
  
  // 重写 reload 方法来追踪调用栈
  window.location.reload = function() {
    console.error('🔄 页面刷新被触发！调用栈:');
    console.trace();
    
    // 获取调用栈信息
    const stack = new Error().stack;
    console.log('📍 详细调用栈:', stack);
    
    // 调用原始方法
    return originalReload.call(this);
  };
  
  // 监听 beforeunload 事件
  window.addEventListener('beforeunload', function(e) {
    console.log('🚪 页面即将卸载，原因可能是刷新或导航');
  });
  
  // 监听 unload 事件
  window.addEventListener('unload', function(e) {
    console.log('🚪 页面正在卸载');
  });
  
  // 监听 popstate 事件（浏览器前进后退）
  window.addEventListener('popstate', function(e) {
    console.log('🔙 浏览器历史状态变化:', e);
  });
  
  // 监听钱包相关事件
  window.addEventListener('wallet-disconnect', function(e) {
    console.log('🔌 钱包断开连接事件:', e);
  });
  
  // 监听所有错误
  window.addEventListener('error', function(e) {
    console.log('❌ 全局错误事件:', e.error);
  });
  
  window.addEventListener('unhandledrejection', function(e) {
    console.log('❌ 未处理的Promise拒绝:', e.reason);
  });
  
  console.log('✅ 页面刷新监控已启动');
  console.log('💡 如果页面刷新，请查看上面的调用栈信息');
})(); 