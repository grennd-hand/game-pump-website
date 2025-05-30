// 调试用户数据同步问题
const walletAddress = '3auWMFnc1ZbvDZe5d72QoUmZZe9DmbQUBXUTJKoJN4jZ';

// 测试连接API
async function testConnectAPI() {
  try {
    console.log('🔍 测试连接API...');
    const response = await fetch('http://localhost:3000/api/users/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        solBalance: 0.0592
      }),
    });

    const data = await response.json();
    console.log('📡 API响应:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ API调用失败:', error);
  }
}

// 测试获取用户API
async function testGetUserAPI() {
  try {
    console.log('🔍 测试获取用户API...');
    const response = await fetch(`http://localhost:3000/api/users/${walletAddress}`);
    const data = await response.json();
    console.log('📡 获取用户响应:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ 获取用户失败:', error);
  }
}

// 运行测试
async function runTest() {
  console.log('🚀 开始用户数据同步调试...\n');
  
  console.log('=== 测试1: 连接API ===');
  await testConnectAPI();
  
  console.log('\n=== 测试2: 获取用户API ===');
  await testGetUserAPI();
  
  console.log('\n✅ 调试完成');
}

// 如果在Node.js环境中运行
if (typeof window === 'undefined') {
  // Node.js环境
  const fetch = require('node-fetch');
  runTest();
} else {
  // 浏览器环境
  window.debugUserSync = runTest;
  console.log('在浏览器控制台中运行: debugUserSync()');
} 