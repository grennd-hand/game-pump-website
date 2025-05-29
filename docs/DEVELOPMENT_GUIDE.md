# 🚀 GAME PUMP 开发环境指南

## 🔧 SOL余额验证修复

### 问题解决
我们修复了SOL余额验证的几个关键问题：

1. **开发环境降低门槛**: 开发环境最低要求从 0.1 SOL 降低到 0.05 SOL
2. **错误处理改进**: 当获取SOL余额失败时，开发环境自动给予 0.15 SOL 测试余额
3. **更好的错误信息**: 显示当前余额和所需余额的对比

### 🧪 测试投票功能

#### 方法1: 使用测试脚本
```bash
# 基础测试（不包含空投）
node scripts/test-voting-system.js

# 包含devnet空投测试
node scripts/test-voting-system.js --airdrop
```

#### 方法2: 手动获取devnet SOL
```bash
# 使用我们的空投脚本
node scripts/devnet-airdrop.js YOUR_WALLET_ADDRESS 1

# 或访问官方水龙头
# https://faucet.solana.com/

# 或使用Solana CLI
solana airdrop 1 YOUR_WALLET_ADDRESS --url devnet
```

### 🎮 开发环境特性

#### SOL余额要求
- **生产环境**: 最低 0.1 SOL
- **开发环境**: 最低 0.05 SOL （更容易测试）

#### 投票权分配
- **≥ 0.1 SOL**: 3票 (最大投票权)
- **≥ 0.05 SOL** (仅开发): 1票 (测试权限)
- **< 0.05 SOL**: 0票 (无投票权)

#### 错误处理
- 当获取余额失败时，开发环境会自动给予足够的测试余额
- 生产环境仍需真实的SOL余额

### 📋 测试流程

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **初始化投票轮次** (如果需要)
   ```bash
   node scripts/init-voting-round.js
   ```

3. **连接测试钱包**
   - 使用Phantom、Solflare等钱包
   - 切换到Devnet网络
   - 确保有足够的devnet SOL

4. **测试投票功能**
   - 连接钱包会自动获取余额
   - 系统会根据余额分配投票权
   - 选择游戏并提交投票

### 🔍 调试技巧

#### 检查用户信息
访问: `http://localhost:3000/api/users/connect`
```json
{
  "walletAddress": "YOUR_WALLET_ADDRESS"
}
```

#### 检查投票轮次
访问: `http://localhost:3000/api/voting-rounds`

#### 检查投票状态
访问: `http://localhost:3000/api/voting-rounds/{ROUND_ID}/status?wallet={WALLET_ADDRESS}`

### ⚠️ 常见问题

#### "投票需要至少 X SOL 余额"
- **解决方案**: 使用空投脚本获取devnet SOL
- **命令**: `node scripts/devnet-airdrop.js YOUR_WALLET_ADDRESS`

#### "用户不存在，请先连接钱包"
- **解决方案**: 先调用钱包连接API创建用户
- **或**: 在前端点击连接钱包按钮

#### "可用投票数不足"
- **原因**: 用户已经用完投票或余额不足
- **解决方案**: 增加SOL余额或等待新的投票轮次

#### "您已经投过票了"
- **正常行为**: 每个钱包每轮只能投票一次
- **测试**: 使用不同钱包或创建新投票轮次

### 🔄 重置测试数据

```bash
# 删除所有用户数据
db.users.deleteMany({})

# 删除所有投票轮次
db.votingrounds.deleteMany({})

# 重新初始化
node scripts/init-voting-round.js
```

### 📈 监控和日志

- 开发环境会在控制台显示详细的余额获取日志
- API错误会显示具体的余额和要求对比
- 前端会显示用户的实时SOL余额和可用投票数

### 🎯 生产环境部署

部署到生产环境时：
1. 确保 `NODE_ENV=production`
2. 所有SOL余额验证将使用实际要求 (0.1 SOL)
3. 不会有自动余额分配
4. 用户必须有真实的SOL余额才能投票

---

## 🔧 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript
- **后端**: Next.js API Routes + MongoDB
- **区块链**: Solana Web3.js + Wallet Adapter
- **样式**: Tailwind CSS + Framer Motion
- **数据库**: MongoDB Atlas + Mongoose

投票系统现在已经完全可以在开发环境中测试！🎉 