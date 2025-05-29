# SOL 余额投票权限要求

## 📋 修改内容

已将系统中的SOL余额要求统一修改为：**钱包余额必须 ≥ 0.1 SOL 才能获得 3 张投票票据**

## 🔧 修改的文件

### 1. 后端API
- `app/api/users/connect/route.ts` - 用户连接API，票据分配逻辑
- `app/api/voting-rounds/[id]/vote/route.ts` - 投票提交API，余额验证

### 2. 前端组件  
- `components/wallet/SolanaWalletIntegration.tsx` - 钱包集成组件
- `components/sections/VotingSection.tsx` - 投票界面规则显示
- `components/sections/TokenomicsSection.tsx` - 代币经济学说明

## 🎯 投票权限规则

| SOL 余额 | 投票权限 | 说明 |
|---------|---------|------|
| ≥ 0.1 SOL | 3 票 | 获得完整投票权限 |
| < 0.1 SOL | 0 票 | 无投票权限 |
| 余额检查失败 | 0 票 | 网络问题时无投票权限 |

## 🧪 测试验证

运行测试脚本验证逻辑：

```bash
node test-voting-balance.js
```

测试用例包括：
- 余额充足 (0.15 SOL) → 应获得 3 票
- 余额刚好 (0.1 SOL) → 应获得 3 票  
- 余额不足 (0.05 SOL) → 应获得 0 票
- 空钱包 (0 SOL) → 应获得 0 票

## 💡 实现逻辑

### 新用户注册
```javascript
const minBalance = 0.1; // 固定要求0.1 SOL

if (balanceCheckFailed) {
  initialVotes = 0; // 余额检查失败，无投票权
} else if (solBalance >= minBalance) {
  initialVotes = 3; // 满足要求，获得3票
} else {
  initialVotes = 0; // 余额不足，无投票权
}
```

### 现有用户更新
```javascript
if (solBalance >= minBalance) {
  // 余额充足，确保有3票投票权
  if (user.availableVotes === 0) {
    user.availableVotes = 3;
  }
} else {
  // 余额不足，清零投票权
  user.availableVotes = 0;
}
```

### 投票时验证
```javascript
const requiredBalance = 0.1; // 固定要求0.1 SOL

if ((user.solBalance || 0) < requiredBalance) {
  return NextResponse.json({
    error: `投票需要至少 ${requiredBalance} SOL 余额，当前余额: ${user.solBalance || 0}`
  }, { status: 400 });
}
```

## ✅ 验证清单

- [x] 后端API正确验证0.1 SOL要求
- [x] 前端组件显示正确的余额要求
- [x] 投票规则说明已更新
- [x] 代币经济学描述已更新
- [x] 测试脚本验证逻辑正确性
- [x] 移除开发环境特殊处理

## 🚀 部署注意事项

1. 确保数据库中现有用户的投票权限会根据新规则重新评估
2. 前端显示的余额要求已统一为0.1 SOL
3. 所有相关文档和说明已更新
4. 测试脚本可用于验证部署后的功能 