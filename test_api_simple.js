// 简单的API测试
const fetch = require('node-fetch').default || require('node-fetch');

async function testAPIs() {
  console.log('🔍 测试前端API...\n');
  
  try {
    // 测试投票统计API
    console.log('1️⃣ 测试投票统计API...');
    const statsResponse = await fetch('http://localhost:3001/api/voting-stats');
    const statsText = await statsResponse.text();
    console.log('响应状态:', statsResponse.status);
    console.log('响应内容前200字符:', statsText.substring(0, 200));
    
    if (statsResponse.ok) {
      try {
        const statsData = JSON.parse(statsText);
        console.log('✅ 投票统计数据:', JSON.stringify(statsData, null, 2));
      } catch (e) {
        console.log('❌ JSON解析失败:', e.message);
      }
    }
    
    // 测试投票轮次API
    console.log('\n2️⃣ 测试投票轮次API...');
    const roundsResponse = await fetch('http://localhost:3001/api/voting-rounds');
    const roundsText = await roundsResponse.text();
    console.log('响应状态:', roundsResponse.status);
    console.log('响应内容前200字符:', roundsText.substring(0, 200));
    
    if (roundsResponse.ok) {
      try {
        const roundsData = JSON.parse(roundsText);
        console.log('✅ 投票轮次数据:', JSON.stringify(roundsData, null, 2));
      } catch (e) {
        console.log('❌ JSON解析失败:', e.message);
      }
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testAPIs(); 