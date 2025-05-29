# 🗳️ GAME PUMP 投票系统

## 概述

GAME PUMP 投票系统是一个基于 Solana 区块链的去中心化游戏投票平台，允许社区成员为经典游戏投票，获胜游戏将获得专属 meme 代币发射。

## 🎯 核心功能

### 1. 钱包连接与用户管理
- **Solana 钱包集成**: 支持 Phantom、Solflare 等主流钱包
- **自动用户创建**: 首次连接时自动创建用户档案
- **余额检查**: 实时检查 SOL 余额并分配投票权
- **用户等级系统**: 基于经验值的等级提升

### 2. 投票机制
- **多选投票**: 每个钱包最多可投票 3 个游戏
- **余额门槛**: 需要至少 0.1 SOL 余额才能参与投票
- **防重复投票**: 每个钱包只能投票一次
- **实时统计**: 投票结果实时更新

### 3. 游戏管理
- **19 款经典游戏**: 包含俄罗斯方块、超级马里奥等经典游戏
- **多语言支持**: 支持中文、英文、日文、韩文
- **详细信息**: 包含游戏发布年份、平台、开发商等信息
- **排行榜**: 实时显示投票排行和百分比

## 🏗️ 技术架构

### 前端技术栈
- **Next.js 14**: App Router 架构
- **React 18**: 组件化开发
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **Framer Motion**: 动画效果

### 后端技术栈
- **MongoDB Atlas**: 云数据库
- **Mongoose**: ODM 框架
- **Next.js API Routes**: 服务端 API

### 区块链集成
- **Solana Web3.js**: 区块链交互
- **Wallet Adapter**: 钱包连接
- **余额查询**: 实时 SOL 余额检查

## 📊 数据模型

### 用户模型 (User)
```typescript
interface IUser {
  walletAddress: string;        // 钱包地址 (唯一)
  username?: string;            // 用户名
  totalVotes: number;           // 总投票数
  totalTokens: number;          // 总代币数
  availableVotes: number;       // 可用投票数
  solBalance?: number;          // SOL 余额
  level: number;                // 用户等级
  experience: number;           // 经验值
  achievements: string[];       // 成就列表
  preferences: {
    language: 'en' | 'zh' | 'ja' | 'ko';
    notifications: boolean;
  };
  joinedAt: Date;              // 加入时间
  lastActive: Date;            // 最后活跃时间
}
```

### 投票轮次模型 (VotingRound)
```typescript
interface IVotingRound {
  roundNumber: number;          // 轮次编号
  title: string;               // 标题
  description: string;         // 描述
  games: IGame[];              // 游戏列表
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  startDate: Date;             // 开始时间
  endDate: Date;               // 结束时间
  totalVotes: number;          // 总投票数
  totalParticipants: number;   // 参与者数量
  votingRules: {
    minSOLBalance: number;     // 最小 SOL 余额要求
    maxVotesPerWallet: number; // 每钱包最大投票数
    votingPower: 'equal' | 'weighted';
  };
}
```

### 游戏模型 (Game)
```typescript
interface IGame {
  id: string;                  // 游戏 ID
  name: string;                // 游戏名称
  nameTranslations: {          // 多语言名称
    en: string;
    zh: string;
    ja: string;
    ko: string;
  };
  icon: string;                // 游戏图标 (emoji)
  description: string;         // 描述
  descriptionTranslations: {   // 多语言描述
    en: string;
    zh: string;
    ja: string;
    ko: string;
  };
  released: string;            // 发布年份
  platform?: string;          // 平台
  developer?: string;          // 开发商
  votes: number;               // 投票数
  voters: string[];            // 投票者钱包地址列表
}
```

## 🔄 投票流程

### 1. 用户连接钱包
```mermaid
graph TD
    A[用户点击连接钱包] --> B[选择钱包类型]
    B --> C[钱包授权连接]
    C --> D[获取钱包地址]
    D --> E[检查 SOL 余额]
    E --> F[创建/更新用户档案]
    F --> G[分配投票权限]
```

### 2. 投票过程
```mermaid
graph TD
    A[选择游戏] --> B[检查投票限制]
    B --> C{是否超过限制?}
    C -->|是| D[显示错误提示]
    C -->|否| E[添加到选择列表]
    E --> F[点击投票按钮]
    F --> G[验证用户权限]
    G --> H[提交投票]
    H --> I[更新数据库]
    I --> J[扣除可用投票数]
    J --> K[增加经验值]
    K --> L[显示成功提示]
```

## 🛠️ API 接口

### 用户相关
- `POST /api/users/connect` - 连接钱包并创建/更新用户
- `GET /api/users/[address]` - 获取用户信息

### 投票相关
- `GET /api/voting-rounds` - 获取所有投票轮次
- `GET /api/voting-rounds/[id]` - 获取特定投票轮次
- `POST /api/voting-rounds/[id]/vote` - 提交投票
- `GET /api/voting-rounds/[id]/status` - 检查投票状态

### 统计相关
- `GET /api/stats` - 获取平台统计数据

## 🎮 游戏列表

当前投票轮次包含 19 款经典游戏：

1. 🟦 **Tetris** (1984) - 俄罗斯方块
2. 🦍 **Donkey Kong** (1981) - 大金刚
3. 🟡 **Pac-Man** (1980) - 吃豆人
4. 🍄 **Super Mario Bros** (1985) - 超级马里奥兄弟
5. 🗡️ **The Legend of Zelda** (1986) - 塞尔达传说
6. ⚔️ **Final Fantasy** (1987) - 最终幻想
7. 🤖 **Mega Man 2** (1988) - 洛克人2
8. 🔫 **Contra** (1987) - 魂斗罗
9. 💙 **Sonic the Hedgehog** (1991) - 索尼克刺猬
10. 👊 **Street Fighter II** (1991) - 街头霸王II
11. 🌍 **Super Mario World** (1990) - 超级马里奥世界
12. ⚡ **Pokémon Red/Green** (1996) - 宝可梦红/绿
13. 🚀 **Super Metroid** (1994) - 超级银河战士
14. ☁️ **Final Fantasy VII** (1997) - 最终幻想VII
15. 🎵 **Ocarina of Time** (1998) - 时之笛
16. 🎮 **Super Mario 64** (1996) - 超级马里奥64
17. 👹 **Doom** (1993) - 毁灭战士
18. 🌌 **StarCraft** (1998) - 星际争霸
19. 🏺 **Tomb Raider** (1996) - 古墓丽影

## 🏆 奖励机制

### 投票奖励
- **经验值**: 每票获得 10 经验值
- **等级提升**: 基于经验值自动升级
- **成就系统**: 完成特定任务获得成就

### 代币奖励
- **空投分配**: 投票者获得 10% 代币空投
- **DAO 治理**: 代币持有者参与治理决策
- **未来权益**: play-to-earn 开发投票权

## 🔧 管理工具

### 初始化脚本
```bash
# 初始化投票轮次
node scripts/init-voting-round.js

# 测试投票功能
node scripts/test-voting.js
```

### 管理脚本
```bash
# 查看投票统计
node scripts/voting-admin.js stats

# 查看游戏排行榜
node scripts/voting-admin.js games

# 查看用户排行榜
node scripts/voting-admin.js users

# 清理测试数据
node scripts/voting-admin.js reset

# 查看所有信息
node scripts/voting-admin.js all
```

## 🚀 部署说明

### 环境变量
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### 部署步骤
1. 克隆项目并安装依赖
2. 配置环境变量
3. 初始化数据库
4. 运行初始化脚本
5. 部署到 Vercel

## 📈 监控指标

### 关键指标
- **总投票数**: 当前 101,772 票
- **参与者数**: 当前 1,338 人
- **投票参与率**: 用户投票比例
- **活跃用户数**: 7天内活跃用户

### 实时统计
- 游戏投票排行榜
- 用户经验值排行
- 投票趋势分析

## 🔒 安全措施

### 防作弊机制
- **钱包验证**: 验证钱包地址有效性
- **余额检查**: 确保足够的 SOL 余额
- **重复投票检测**: 防止同一钱包多次投票
- **投票限制**: 每钱包最多 3 票

### 数据完整性
- **事务处理**: 确保数据一致性
- **错误处理**: 完善的错误处理机制
- **日志记录**: 详细的操作日志

## 🎯 未来规划

### 短期目标
- [ ] 添加投票历史记录
- [ ] 实现投票结果可视化
- [ ] 增加社交分享功能
- [ ] 优化移动端体验

### 长期目标
- [ ] 多轮投票系统
- [ ] 代币发射功能
- [ ] DAO 治理机制
- [ ] NFT 奖励系统

## 📞 技术支持

如有问题或建议，请联系开发团队或在 GitHub 上提交 Issue。

---

*最后更新: 2024年12月* 