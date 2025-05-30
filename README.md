# GamePump - 去中心化游戏启动平台

🎮 基于Solana区块链的游戏代币发现和交易平台，支持社交任务系统和钱包集成。

## ✨ 功能特性

- 🎯 **社交任务系统** - Twitter/Telegram账号绑定与任务验证
- 💰 **代币交易** - 游戏代币发现、交易和投票
- 🔗 **钱包集成** - 支持Phantom、Solflare等Solana钱包
- 📊 **用户分析** - 完整的事件追踪和错误监控
- 🌐 **多语言支持** - 中文、英文、日文、韩文
- 📱 **响应式设计** - 完美适配桌面和移动端

## 🚀 技术栈

- **前端**: Next.js 14, React, Tailwind CSS
- **区块链**: Solana Web3.js, Wallet Adapter
- **数据库**: MongoDB Atlas
- **分析**: 自定义事件追踪系统
- **UI组件**: Framer Motion, React Icons
- **OAuth**: Twitter OAuth 2.0

## 📦 快速开始

### 1. 安装依赖

```bash
npm install
# 或
yarn install
```

### 2. 环境变量配置

创建 `.env.local` 文件：

```env
# MongoDB数据库
MONGODB_URI=your_mongodb_connection_string

# Twitter OAuth 2.0 API (可选)
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
NEXT_PUBLIC_TWITTER_CLIENT_ID=your_twitter_client_id

# NextJS配置
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your_nextauth_secret
```

### 3. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

打开 [http://localhost:3002](http://localhost:3002) 查看项目。

## 🔧 项目结构

```
game-pump-website/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # 全局样式
│   ├── layout.js          # 根布局
│   ├── page.js           # 首页
│   ├── pump/             # 代币发布页面
│   ├── discovery/        # 代币发现页面
│   └── tasks/            # 社交任务页面
├── components/            # React组件
│   ├── layout/           # 布局组件
│   ├── ui/               # UI组件
│   └── wallet/           # 钱包组件
├── contexts/             # React Context
├── hooks/                # 自定义Hooks
├── lib/                  # 工具库
├── models/               # 数据模型
├── pages/api/            # API路由
└── public/               # 静态资源
```

## 🎯 主要功能模块

### 社交任务系统
- Twitter OAuth 2.0集成
- Telegram账号绑定
- 任务完成验证
- 奖励积分系统

### 代币发布平台
- 游戏代币创建
- 代币交易功能
- 社区投票系统
- 流动性管理

### 钱包集成
- 多钱包支持
- 交易签名
- 余额查询
- NFT展示

### 分析系统
- 用户行为追踪
- 性能监控
- 错误日志记录
- 事件统计

## 📋 环境要求

- Node.js 18+
- npm 或 yarn
- MongoDB数据库
- Solana钱包（开发测试）

## 🚀 部署

### Vercel部署

1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

### 手动部署

```bash
npm run build
npm start
```

## 🤝 贡献指南

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 📄 许可证

本项目使用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Solana官网](https://solana.com/)
- [Next.js文档](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Twitter Developer Portal](https://developer.twitter.com/)

---

⭐ 如果这个项目对你有帮助，请给个星星！ 