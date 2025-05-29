# 首页签到按钮功能

## 🎯 功能概述

在首页的HeroSection中添加了每日签到按钮，用户可以直接在首页进行每日签到获取票数奖励。

## 🔧 实现内容

### 1. 新增功能组件

**位置**: `components/sections/HeroSection.tsx`

#### 新增导入
```typescript
import { useWalletConnect } from '@/hooks/useWalletConnect'
import { useWallet } from '@solana/wallet-adapter-react'
```

#### 新增状态管理
```typescript
const { user, isConnected } = useWalletConnect()
const { connected } = useWallet()
const [checkinLoading, setCheckinLoading] = useState(false)
```

#### 多语言支持
```typescript
const btnCheckinMap = {
  en: "Daily Check-in",
  zh: "每日签到", 
  ja: "デイリーチェックイン",
  ko: "일일 체크인"
}
const checkinSuccessMap = {
  en: "Check-in successful!",
  zh: "签到成功！",
  ja: "チェックイン成功！", 
  ko: "체크인 성공!"
}
const checkinErrorMap = {
  en: "Check-in failed",
  zh: "签到失败",
  ja: "チェックイン失敗",
  ko: "체크인 실패"
}
const connectWalletMap = {
  en: "Connect wallet first",
  zh: "请先连接钱包",
  ja: "まずウォレットを接続してください",
  ko: "먼저 지갑을 연결하세요"
}
```

### 2. 核心功能实现

#### 签到处理函数
```typescript
const handleCheckin = async () => {
  // 首先检查钱包连接状态
  if (!connected) {
    // 显示提示需要连接钱包
    if ((window as any).addToast) {
      (window as any).addToast({
        type: 'warning',
        title: '⚠️ 提示',
        message: connectWalletMap[lang],
        duration: 3000
      });
    }
    return;
  }

  // 检查用户数据是否加载完成
  if (!user) {
    if ((window as any).addToast) {
      (window as any).addToast({
        type: 'info',
        title: '⏳ 请稍候',
        message: '正在加载用户数据...',
        duration: 2000
      });
    }
    return;
  }

  // 检查是否已经签到
  if (!canCheckinToday()) {
    if ((window as any).addToast) {
      (window as any).addToast({
        type: 'info',
        title: '✅ 提示',
        message: '今日已签到，明天再来吧！',
        duration: 3000
      });
    }
    return;
  }

  setCheckinLoading(true);
  
  try {
    const response = await fetch('/api/users/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: user.walletAddress
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // 签到成功，显示奖励信息
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'success',
          title: '🎉 ' + checkinSuccessMap[lang],
          message: `获得 ${data.rewardVotes} 票！连续签到 ${data.consecutiveDays} 天`,
          duration: 4000
        });
      }
      
      // 刷新用户数据
      window.location.reload();
    } else {
      // 签到失败
      if ((window as any).addToast) {
        (window as any).addToast({
          type: 'error',
          title: '❌ ' + checkinErrorMap[lang],
          message: data.error || '签到失败，请重试',
          duration: 3000
        });
      }
    }
  } catch (error) {
    console.error('签到请求失败:', error);
    if ((window as any).addToast) {
      (window as any).addToast({
        type: 'error',
        title: '❌ ' + checkinErrorMap[lang],
        message: '网络错误，请重试',
        duration: 3000
      });
    }
  } finally {
    setCheckinLoading(false);
  }
}
```

#### 签到状态检查
```typescript
const canCheckinToday = () => {
  if (!user || !(user as any).dailyCheckin) return true;
  
  const today = new Date();
  const lastCheckin = (user as any).dailyCheckin.lastCheckinDate ? 
    new Date((user as any).dailyCheckin.lastCheckinDate) : null;
  
  if (!lastCheckin) return true;
  
  return today.toDateString() !== lastCheckin.toDateString();
}
```

### 3. UI组件设计

#### 按钮样式
- **可签到状态**: 金色边框和文字，悬停时金色发光效果
- **已签到状态**: 灰色边框和文字，显示"(已签到)"标识
- **未连接钱包**: 灰色禁用状态，提示连接钱包
- **签到中**: 显示加载动画和"签到中..."文字

#### 响应式设计
```typescript
<motion.button
  whileHover={{ 
    scale: 1.05, 
    boxShadow: connected && canCheckinToday() ? "0 0 30px #FFD700" : "0 0 15px #666",
    backgroundColor: connected && canCheckinToday() ? "#FFD700" : "#666",
    color: "#000000"
  }}
  whileTap={{ scale: 0.95 }}
  className={`neon-button w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 ${
    connected && canCheckinToday() 
      ? 'text-yellow-400 border-yellow-400 hover:text-black' 
      : 'text-gray-500 border-gray-500 cursor-not-allowed'
  }`}
  onClick={handleCheckin}
  disabled={checkinLoading || !connected || !canCheckinToday()}
>
  {checkinLoading ? (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      <span>签到中...</span>
    </div>
  ) : (
    <>
      {connected && canCheckinToday() ? '✨' : '✅'} {btnCheckinMap[lang]}
      {connected && !canCheckinToday() && (
        <span className="ml-2 text-xs">(已签到)</span>
      )}
    </>
  )}
</motion.button>
```

## 🎨 视觉效果

### 按钮状态
1. **未连接钱包**: 🔗 灰色状态，显示"请先连接钱包"
2. **用户数据加载中**: ⏳ 灰色状态，显示"加载中..."
3. **可签到**: ✨ 金色发光，悬停时背景变金色
4. **已签到**: ✅ 灰色状态，显示"(已签到)"标识
5. **签到中**: ⏳ 旋转动画，显示"签到中..."

### 动画效果
- **悬停动画**: 按钮放大1.05倍，发光效果
- **点击动画**: 按钮缩小0.95倍
- **加载动画**: 旋转的圆形进度指示器

## 🔄 用户流程

### 已连接钱包用户
1. 用户访问首页
2. 看到签到按钮（金色/灰色状态）
3. 点击签到按钮
4. 显示签到结果和奖励信息
5. 页面刷新更新用户数据

### 未连接钱包用户
1. 用户访问首页
2. 看到显示"请先连接钱包"的按钮
3. 点击按钮弹出Toast提示连接钱包
4. 连接钱包后按钮变为可用状态

### 钱包连接但数据加载中
1. 钱包连接成功
2. 按钮显示"加载中..."
3. 用户数据加载完成后显示正确状态

## 🎁 奖励机制

- **基础奖励**: 1票 + 5经验
- **连续3天**: 2票 + 10经验  
- **连续7天**: 3票 + 15经验

## 📱 响应式适配

- **桌面端**: 三个按钮水平排列
- **移动端**: 三个按钮垂直堆叠
- **按钮间距**: 从6调整为4，适应三个按钮布局

## 🔗 API集成

使用现有的签到API：
- **端点**: `POST /api/users/checkin`
- **参数**: `{ walletAddress: string }`
- **返回**: 签到结果、奖励信息、连续天数

## ✨ 特色功能

1. **智能状态检测**: 自动判断是否可以签到
2. **实时反馈**: Toast通知显示签到结果
3. **多语言支持**: 支持中英日韩四种语言
4. **无缝集成**: 与现有钱包系统完美配合
5. **视觉一致性**: 保持像素风格设计语言

这个签到按钮为用户提供了便捷的每日签到入口，增强了首页的互动性和用户粘性。 