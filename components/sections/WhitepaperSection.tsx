'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface WhitepaperSectionProps {
  lang: 'en' | 'zh' | 'ja' | 'ko'
}

export default function WhitepaperSection({ lang }: WhitepaperSectionProps) {
  const [activeSection, setActiveSection] = useState<string>('overview')

  const titleMap = {
    en: '📄 GAME PUMP Whitepaper',
    zh: '📄 GAME PUMP 项目白皮书',
    ja: '📄 GAME PUMP ホワイトペーパー',
    ko: '📄 GAME PUMP 백서'
  }

  const sectionsMap = {
    en: [
      { id: 'overview', title: 'Project Overview', icon: '🎯' },
      { id: 'mechanism', title: 'Operating Mechanism', icon: '⚙️' },
      { id: 'tokenomics', title: 'Token Economics', icon: '💰' },
      { id: 'roadmap', title: 'Development Roadmap', icon: '🗺️' },
      { id: 'risks', title: 'Risk Disclosure', icon: '⚠️' }
    ],
    zh: [
      { id: 'overview', title: '项目概述', icon: '🎯' },
      { id: 'mechanism', title: '运作机制', icon: '⚙️' },
      { id: 'tokenomics', title: '代币经济学', icon: '💰' },
      { id: 'roadmap', title: '发展路线图', icon: '🗺️' },
      { id: 'risks', title: '风险披露', icon: '⚠️' }
    ],
    ja: [
      { id: 'overview', title: 'プロジェクト概要', icon: '🎯' },
      { id: 'mechanism', title: '運営メカニズム', icon: '⚙️' },
      { id: 'tokenomics', title: 'トークンエコノミクス', icon: '💰' },
      { id: 'roadmap', title: '開発ロードマップ', icon: '🗺️' },
      { id: 'risks', title: 'リスク開示', icon: '⚠️' }
    ],
    ko: [
      { id: 'overview', title: '프로젝트 개요', icon: '🎯' },
      { id: 'mechanism', title: '운영 메커니즘', icon: '⚙️' },
      { id: 'tokenomics', title: '토큰 이코노믹스', icon: '💰' },
      { id: 'roadmap', title: '개발 로드맵', icon: '🗺️' },
      { id: 'risks', title: '위험 공개', icon: '⚠️' }
    ]
  }

  const contentMap = {
    en: {
      overview: {
        title: 'Project Background & Purpose',
        content: [
          'GAME PUMP is an innovative community-driven Web3 project that aims to revive classic games through player voting and bring them to the blockchain world. Players vote for the top-ranked game from a classic game list (such as Super Mario or Tetris), then the project launches SOL fundraising activities. After fundraising is completed, exclusive meme tokens are launched for that game (such as $MARIO). These tokens initially have no practical use, but in future version updates, the community can decide through governance whether to develop play-to-earn versions, allowing classic games to be reborn in Web3.',
          'In the rapid development of the gaming industry, classic games like Super Mario, Tetris, and Space Invaders are not just entertainment, but cultural symbols that have profoundly influenced generation after generation of players. However, with technological advancement, these classic games have gradually been overshadowed by modern games\' gorgeous graphics and complex mechanics, risking being forgotten. In recent years, the gaming industry has witnessed a revival of interest in classic games, with giants like Sega, Atari, and Nintendo exploring Web3 technology to bring retro games into the modern era. This indicates that players\' demand for nostalgic games is growing, and blockchain technology can enhance these games\' asset ownership and economic incentives.',
          'GAME PUMP\'s mission is: Make Classic Games Great Again. Through community participation and blockchain empowerment, players can not only choose their favorite classic games but also gain real value in games through play-to-earn (P2E) mechanisms.'
        ]
      },
      mechanism: {
        title: 'Operating Mechanism',
        content: [
          '🗳️ Vote for Games',
          'Process: Users connect Solana wallets and vote from a list containing numerous classic games. As long as your wallet balance is greater than 0.1 SOL, you can choose 3 favorite classic games to vote for.',
          'Goal: After the voting countdown ends, the game with the highest votes will be selected and enter the SOL fundraising stage.',
          '',
          '💰 Raise SOL',
          'Crowdfunding: After the game is selected, the project sets SOL fundraising targets, with funds used to support token issuance and future development.',
          'Participation: Users contribute SOL in exchange for shares of that game\'s exclusive meme token.',
          '',
          '🚀 Token Launch',
          'Exclusive meme tokens: After fundraising is completed, each game will "launch" its exclusive meme token (such as $MARIO or $TETRIS), based on Solana\'s SPL standard.',
          'Initial state: Tokens initially have no practical use, mainly serving as symbols of community participation, with value potentially dependent on market speculation.',
          '',
          '🏛️ Community Governance & Play-to-Earn',
          'Governance: Token holders decide the future development direction of tokens through DAO, such as voting on whether to develop play-to-earn versions for games.',
          'Play-to-earn mechanism: If the community decides to proceed, the project will develop remakes of those classic games, integrating blockchain technology. Players can earn tokens through game activities, allowing classic games to be reborn in the Web3 world.'
        ]
      },
      tokenomics: {
        title: 'Token Economics (Tokenomics)',
        content: [
          'GAME PUMP creates exclusive meme tokens for each selected classic game. The following is the standard allocation ratio for all tokens:',
          '',
          '📊 Token Distribution:',
          '• Pre-sale (50%): For project startup funding, sold through IDO or similar methods to raise SOL for game development and operations',
          '• Liquidity (30%): For DEX liquidity pools, ensuring token circulation and trading activity',
          '• Voting Airdrop (10%): Airdropped to community members through voting activities, rewarding participation in game selection and governance',
          '• SOL Ecosystem Airdrop (7%): Airdropped to Solana ecosystem users, promoting project ecosystem integration and user growth',
          '• Development (3%): For project development and maintenance, supporting future updates and improvements',
          '',
          '💎 Token Utility:',
          '• Initial use: Tokens serve mainly as investment or speculation tools in early issuance, symbolizing community participation',
          '• Future use: As game development progresses, tokens will be integrated into games\' play-to-earn (P2E) mechanisms for:',
          '  - In-game purchases: Players can use tokens to buy in-game items, characters, etc.',
          '  - Staking: Holders can earn rewards by staking tokens',
          '  - Community governance: Token holders can participate in voting decisions for game rules, updates, etc.',
          '',
          '⚠️ Risk disclosure: As meme tokens, these tokens may have high volatility, investors should be cautious.'
        ]
      },
      roadmap: {
        title: 'Development Roadmap',
        content: [
          '2025-Q3:',
          '• Voting platform goes live, launch first round voting',
          '• Select first classic game, create exclusive meme token, launch SOL fundraising',
          '• Complete first game development, integrate P2E mechanism',
          '',
          '2025-Q4:',
          '• First game goes live, launch second round voting',
          '• Select second classic game, create exclusive meme token, launch SOL fundraising',
          '',
          '2026-Q1:',
          '• Complete second game development, integrate P2E mechanism',
          '• Complete staking protocol application implementation',
          '• Continue developing more games, expand ecosystem'
        ]
      },
      risks: {
        title: 'Risk & Legal Disclosure',
        content: [
          '⚠️ Risk Disclosure:',
          '• Investment risk: Meme tokens may have high volatility, investors should be cautious',
          '• Smart contract risk: Although the project will conduct strict security audits, smart contracts still have potential risks',
          '• Regulatory risk: Blockchain projects may face future regulatory changes',
          '',
          '📜 Copyright Statement:',
          '• All developed games are original works, inspired by classic games but do not infringe any copyrights',
          '• The project team will work with legal experts to ensure all games comply with local laws and avoid direct use of copyrighted materials',
          '',
          '🎯 Conclusion:',
          'GAME PUMP is not just a game project, but a movement to make classic games great again in Web3. We believe that the charm of classic games never goes out of style, and blockchain technology can give them new vitality. Through community participation and innovation, we will together create a gaming ecosystem where nostalgia and future merge. Join us to make classic games great again!'
        ]
      }
    },
    zh: {
      overview: {
        title: '项目背景与目的',
        content: [
          'GAME PUMP 是一个创新的社区驱动 Web3 项目，旨在通过玩家投票复兴经典游戏，并将其带入区块链世界。玩家通过连接 Solana 钱包从经典游戏列表中投票选出排名第一的游戏（如《超级马里奥》或《俄罗斯方块》），然后项目启动 SOL 募集活动，募集完成后为该游戏发射专属 meme 代币（如 $MARIO）。这些代币初始无实际用途，但未来版本更新中，社区可通过自治决定是否开发 play-to-earn 版本，让经典游戏在 Web3 中焕发新生。',
          '在游戏行业的快速发展中，经典游戏如 超级马里奥、俄罗斯方块 和 太空侵略者 等，不仅是娱乐，更是文化符号，深刻影响了一代又一代玩家。然而，随着技术的进步，这些经典游戏逐渐被现代游戏的华丽图形和复杂机制所掩盖，风险被遗忘。近年来，游戏行业见证了对经典游戏的复兴兴趣，巨头如 Sega、Atari 和 Nintendo 正在探索 Web3 技术，将复古游戏带入现代时代。这表明，玩家对怀旧游戏的需求正在增长，而区块链技术可以增强这些游戏的资产所有权和经济激励。',
          'GAME PUMP 的使命是：让经典游戏再次伟大。通过社区的参与和区块链的赋能，玩家不仅可以选择他们最喜爱的经典游戏，还可以通过 play-to-earn（P2E）机制在游戏中获得真正的价值。'
        ]
      },
      mechanism: {
        title: '运作机制',
        content: [
          '🗳️ 投票选游戏',
          '流程：用户连接 Solana 钱包，从包含众多经典游戏的列表中投票，只要你钱包余额大于0.1sol你将可以选择3个你喜欢的经典游戏进行投票。',
          '目标：投票倒计时结束后，得票最高的游戏将被选定，进入 SOL 募集阶段。',
          '',
          '💰 募集 SOL',
          '众筹：选定游戏后，项目设定 SOL 募集目标，资金用于支持代币发行和未来开发。',
          '参与方式：用户贡献 SOL 以换取该游戏专属 meme 代币的份额。',
          '',
          '🚀 代币发行',
          '专属 meme 代币：募集完成后，每个游戏将"发射"其专属 meme 代币（如 $MARIO 或 $TETRIS），基于 Solana 的 SPL 标准。',
          '初始状态：代币初期无实际用途，主要作为社区参与的象征，价值可能依赖市场投机。',
          '',
          '🏛️ 社区自治与 play-to-earn',
          '治理：代币持有者通过 DAO 决定代币的未来发展方向，例如投票是否为游戏开发 play-to-earn 版本。',
          'play-to-earn 机制：若社区决定推进，项目将开发该经典游戏的重制版，融入区块链技术。玩家可通过游戏活动赚取代币，让经典游戏在 Web3 世界中焕发新生。'
        ]
      },
      tokenomics: {
        title: '代币经济学（Tokenomics）',
        content: [
          'GAME PUMP 为每个选定的经典游戏创建专属 meme 代币。以下是所有代币的标准分配比例：',
          '',
          '📊 代币分配：',
          '• 预售 (50%)：用于项目启动资金，通过 IDO 或类似方式售卖代币，筹集 SOL 用于游戏开发和运营',
          '• 流动性 (30%)：用于 DEX 的流动性池，确保代币的流通和交易活跃度',
          '• 投票空投 (10%)：通过投票活动空投给社区成员，奖励参与游戏选择和治理的用户',
          '• SOL 生态空投 (7%)：空投给 Solana 生态系统内的用户，促进项目的生态整合和用户增长',
          '• 开发 (3%)：用于项目开发和维护，支持未来的更新和改进',
          '',
          '💎 代币用途：',
          '• 初始用途：代币在发行初期主要作为投资或投机工具，象征社区参与',
          '• 未来用途：随着游戏开发的推进，代币将集成到游戏的 play-to-earn（P2E）机制中，用于：',
          '  - 游戏内购买：玩家可以使用代币购买游戏内道具、角色等',
          '  - Staking（质押）：持有者可以通过质押代币获得奖励',
          '  - 社区治理：代币持有者可以参与游戏规则、更新等的投票决策',
          '',
          '⚠️ 风险披露：作为 meme 代币，这些代币可能具有高波动性，投资者需谨慎。'
        ]
      },
      roadmap: {
        title: '路线图',
        content: [
          '2025-Q3：',
          '• 投票平台上线，启动首轮投票',
          '• 选出第一款经典游戏，创建其专属 meme 代币，启动 SOL 募集',
          '• 完成第一款游戏的开发，集成 P2E 机制',
          '',
          '2025-Q4：',
          '• 第一款游戏上线，启动第二轮投票',
          '• 选出第二款经典游戏，创建其专属 meme 代币，启动 SOL 募集',
          '',
          '2026-Q1：',
          '• 完成第二款游戏的开发，集成 P2E 机制',
          '• 完成staking协议的应用落地',
          '• 持续开发更多游戏，扩展生态系统'
        ]
      },
      risks: {
        title: '风险与法律声明',
        content: [
          '⚠️ 风险披露：',
          '• 投资风险：meme 代币可能具有高波动性，投资者需谨慎',
          '• 智能合约风险：尽管项目将进行严格的安全审计，但智能合约仍存在潜在风险',
          '• 监管风险：区块链项目可能面临未来的监管变化',
          '',
          '📜 版权声明：',
          '• 所有开发的游戏均为原创作品，受经典游戏启发但不侵犯任何版权',
          '• 项目团队将与法律专家合作，确保所有游戏符合当地法律，并避免直接使用受版权保护的素材',
          '',
          '🎯 结语：',
          'GAME PUMP 不仅仅是一个游戏项目，更是一个让经典游戏在 Web3 中再次伟大的运动。我们相信，经典游戏的魅力永不过时，而区块链技术可以赋予它们新的生命力。通过社区的参与和创新，我们将共同创造一个怀旧与未来交融的游戏生态。加入我们，一起让经典游戏再次伟大！'
        ]
      }
    },
    ja: {
      overview: {
        title: 'プロジェクト背景と目的',
        content: [
          'GAME PUMP は、プレイヤーの投票を通じてクラシックゲームを復活させ、ブロックチェーンの世界に持ち込む革新的なコミュニティ主導のWeb3プロジェクトです。プレイヤーはSolanaウォレットを接続してクラシックゲームリストから1位のゲーム（スーパーマリオやテトリスなど）に投票し、その後プロジェクトはSOL募金活動を開始します。募金完了後、そのゲーム専用のミームトークン（$MARIOなど）を発行します。これらのトークンは最初は実用性がありませんが、将来のバージョンアップデートで、コミュニティはガバナンスを通じてplay-to-earnバージョンを開発するかどうかを決定でき、クラシックゲームをWeb3で新たに生まれ変わらせることができます。',
          'ゲーム業界の急速な発展において、スーパーマリオ、テトリス、スペースインベーダーなどのクラシックゲームは、単なる娯楽ではなく文化的シンボルであり、世代を超えてプレイヤーに深い影響を与えています。しかし、技術の進歩とともに、これらのクラシックゲームは現代ゲームの華麗なグラフィックと複雑なメカニズムに徐々に覆い隠され、忘れられるリスクがあります。近年、ゲーム業界ではクラシックゲームへの復活の関心が見られ、Sega、Atari、Nintendoなどの巨大企業がWeb3技術を探索し、レトロゲームを現代に持ち込んでいます。これは、プレイヤーのノスタルジックゲームへの需要が高まっていることを示し、ブロックチェーン技術がこれらのゲームの資産所有権と経済的インセンティブを強化できることを意味します。',
          'GAME PUMP の使命は：クラシックゲームを再び偉大にすることです。コミュニティの参加とブロックチェーンの力により、プレイヤーは好きなクラシックゲームを選択できるだけでなく、play-to-earn（P2E）メカニズムを通じてゲームで真の価値を得ることができます。'
        ]
      },
      mechanism: {
        title: '運営メカニズム',
        content: [
          '🗳️ ゲーム投票',
          'プロセス：ユーザーはSolanaウォレットを接続し、多数のクラシックゲームを含むリストから投票します。ウォレット残高が0.1 SOL以上であれば、好きなクラシックゲーム3つを選んで投票できます。',
          '目標：投票カウントダウン終了後、最高得票のゲームが選定され、SOL募金段階に進みます。',
          '',
          '💰 SOL募金',
          'クラウドファンディング：ゲーム選定後、プロジェクトはSOL募金目標を設定し、資金はトークン発行と将来の開発をサポートするために使用されます。',
          '参加方法：ユーザーはSOLを提供し、そのゲーム専用ミームトークンのシェアと交換します。',
          '',
          '🚀 トークン発行',
          '専用ミームトークン：募金完了後、各ゲームは専用ミームトークン（$MARIOや$TETRISなど）を「発射」し、SolanaのSPL標準に基づきます。',
          '初期状態：トークンは初期段階では実用性がなく、主にコミュニティ参加の象徴として機能し、価値は市場投機に依存する可能性があります。',
          '',
          '🏛️ コミュニティガバナンス & play-to-earn',
          'ガバナンス：トークン保有者はDAOを通じてトークンの将来の発展方向を決定します。例えば、ゲームのplay-to-earnバージョンを開発するかどうかの投票などです。',
          'play-to-earnメカニズム：コミュニティが推進を決定した場合、プロジェクトはそのクラシックゲームのリメイク版を開発し、ブロックチェーン技術を統合します。プレイヤーはゲーム活動を通じてトークンを獲得でき、クラシックゲームをWeb3世界で新たに生まれ変わらせることができます。'
        ]
      },
      tokenomics: {
        title: 'トークンエコノミクス',
        content: [
          'GAME PUMP は選定された各クラシックゲームに専用ミームトークンを作成します。以下はすべてのトークンの標準配分比率です：',
          '',
          '📊 トークン配分：',
          '• プリセール (50%)：プロジェクト開始資金のため、IDOまたは類似の方法でトークンを販売し、ゲーム開発と運営のためのSOLを調達',
          '• 流動性 (30%)：DEXの流動性プールのため、トークンの流通と取引活動を確保',
          '• 投票エアドロップ (10%)：投票活動を通じてコミュニティメンバーにエアドロップ、ゲーム選択とガバナンスへの参加を報酬',
          '• SOLエコシステムエアドロップ (7%)：Solanaエコシステムユーザーにエアドロップ、プロジェクトのエコシステム統合とユーザー成長を促進',
          '• 開発 (3%)：プロジェクト開発とメンテナンスのため、将来のアップデートと改善をサポート',
          '',
          '💎 トークンの用途：',
          '• 初期用途：トークンは発行初期段階では主に投資または投機ツールとして機能し、コミュニティ参加を象徴',
          '• 将来の用途：ゲーム開発の進展に伴い、トークンはゲームのplay-to-earn（P2E）メカニズムに統合され、以下に使用：',
          '  - ゲーム内購入：プレイヤーはトークンを使用してゲーム内アイテム、キャラクターなどを購入',
          '  - ステーキング：保有者はトークンをステーキングして報酬を獲得',
          '  - コミュニティガバナンス：トークン保有者はゲームルール、アップデートなどの投票決定に参加',
          '',
          '⚠️ リスク開示：ミームトークンとして、これらのトークンは高いボラティリティを持つ可能性があり、投資家は慎重になる必要があります。'
        ]
      },
      roadmap: {
        title: 'ロードマップ',
        content: [
          '2025-Q3：',
          '• 投票プラットフォーム開始、初回投票開始',
          '• 初回クラシックゲーム選定、専用ミームトークン作成、SOL募金開始',
          '• 初回ゲーム開発完了、P2E機構統合',
          '',
          '2025-Q4：',
          '• 初回ゲーム開始、第2回投票開始',
          '• 第2クラシックゲーム選定、専用ミームトークン作成、SOL募金開始',
          '',
          '2026-Q1：',
          '• 第2ゲーム開発完了、P2E機構統合',
          '• ステーキングプロトコルアプリケーション実装完了',
          '• より多くのゲーム開発継続、エコシステム拡張'
        ]
      },
      risks: {
        title: 'リスクと法的開示',
        content: [
          '⚠️ リスク開示：',
          '• 投資リスク：ミームトークンは高いボラティリティを持つ可能性があり、投資家は慎重になる必要があります',
          '• スマートコントラクトリスク：プロジェクトは厳格なセキュリティ監査を実施しますが、スマートコントラクトには潜在的なリスクが残ります',
          '• 規制リスク：ブロックチェーンプロジェクトは将来の規制変更に直面する可能性があります',
          '',
          '📜 著作権声明：',
          '• 開発されるすべてのゲームはオリジナル作品であり、クラシックゲームにインスパイアされていますが、著作権を侵害しません',
          '• プロジェクトチームは法律専門家と協力し、すべてのゲームが現地法に準拠し、著作権保護された素材の直接使用を避けることを確保します',
          '',
          '🎯 結論：',
          'GAME PUMP は単なるゲームプロジェクトではなく、Web3でクラシックゲームを再び偉大にする運動です。私たちは、クラシックゲームの魅力は決して時代遅れにならず、ブロックチェーン技術が新たな活力を与えることができると信じています。コミュニティの参加と革新を通じて、ノスタルジアと未来が融合するゲームエコシステムを共に創造します。私たちに参加して、クラシックゲームを再び偉大にしましょう！'
        ]
      }
    },
    ko: {
      overview: {
        title: '프로젝트 배경과 목적',
        content: [
          'GAME PUMP는 플레이어 투표를 통해 클래식 게임을 되살리고 블록체인 세계로 가져오는 혁신적인 커뮤니티 주도 Web3 프로젝트입니다. 플레이어는 Solana 지갑을 연결하여 클래식 게임 목록에서 1위 게임(슈퍼 마리오나 테트리스 등)에 투표하고, 그 후 프로젝트는 SOL 모금 활동을 시작합니다. 모금 완료 후 해당 게임 전용 밈 토큰($MARIO 등)을 발행합니다. 이러한 토큰은 처음에는 실용성이 없지만, 향후 버전 업데이트에서 커뮤니티는 거버넌스를 통해 play-to-earn 버전을 개발할지 결정할 수 있어 클래식 게임을 Web3에서 새롭게 태어나게 할 수 있습니다.',
          '게임 산업의 급속한 발전에서 슈퍼 마리오, 테트리스, 스페이스 인베이더와 같은 클래식 게임은 단순한 오락이 아니라 문화적 상징으로서 세대를 거쳐 플레이어들에게 깊은 영향을 미쳤습니다. 그러나 기술의 발전과 함께 이러한 클래식 게임들은 현대 게임의 화려한 그래픽과 복잡한 메커니즘에 점차 가려져 잊혀질 위험이 있습니다. 최근 몇 년간 게임 산업에서는 클래식 게임에 대한 부활의 관심이 목격되고 있으며, Sega, Atari, Nintendo와 같은 거대 기업들이 Web3 기술을 탐색하여 레트로 게임을 현대로 가져오고 있습니다. 이는 플레이어들의 향수 게임에 대한 수요가 증가하고 있음을 나타내며, 블록체인 기술이 이러한 게임의 자산 소유권과 경제적 인센티브를 강화할 수 있음을 의미합니다.',
          'GAME PUMP의 사명은: 클래식 게임을 다시 위대하게 만드는 것입니다. 커뮤니티의 참여와 블록체인의 힘을 통해 플레이어는 좋아하는 클래식 게임을 선택할 수 있을 뿐만 아니라 play-to-earn(P2E) 메커니즘을 통해 게임에서 진정한 가치를 얻을 수 있습니다.'
        ]
      },
      mechanism: {
        title: '운영 메커니즘',
        content: [
          '🗳️ 게임 투표',
          '프로세스: 사용자는 Solana 지갑을 연결하고 수많은 클래식 게임을 포함한 목록에서 투표합니다. 지갑 잔액이 0.1 SOL 이상이면 좋아하는 클래식 게임 3개를 선택하여 투표할 수 있습니다.',
          '목표: 투표 카운트다운 종료 후 최고 득표 게임이 선정되어 SOL 모금 단계로 진입합니다.',
          '',
          '💰 SOL 모금',
          '크라우드펀딩: 게임 선정 후 프로젝트는 SOL 모금 목표를 설정하고, 자금은 토큰 발행과 향후 개발을 지원하는 데 사용됩니다.',
          '참여 방법: 사용자는 SOL을 제공하여 해당 게임 전용 밈 토큰의 지분과 교환합니다.',
          '',
          '🚀 토큰 발행',
          '전용 밈 토큰: 모금 완료 후 각 게임은 전용 밈 토큰($MARIO나 $TETRIS 등)을 "발사"하며, Solana의 SPL 표준을 기반으로 합니다.',
          '초기 상태: 토큰은 초기 단계에서는 실용성이 없으며 주로 커뮤니티 참여의 상징으로 기능하고, 가치는 시장 투기에 의존할 수 있습니다.',
          '',
          '🏛️ 커뮤니티 거버넌스 & play-to-earn',
          '거버넌스: 토큰 보유자는 DAO를 통해 토큰의 미래 발전 방향을 결정합니다. 예를 들어 게임의 play-to-earn 버전을 개발할지에 대한 투표 등입니다.',
          'play-to-earn 메커니즘: 커뮤니티가 추진을 결정하면 프로젝트는 해당 클래식 게임의 리메이크 버전을 개발하고 블록체인 기술을 통합합니다. 플레이어는 게임 활동을 통해 토큰을 획득할 수 있어 클래식 게임을 Web3 세계에서 새롭게 태어나게 할 수 있습니다.'
        ]
      },
      tokenomics: {
        title: '토큰 이코노믹스',
        content: [
          'GAME PUMP는 선정된 각 클래식 게임에 전용 밈 토큰을 생성합니다. 다음은 모든 토큰의 표준 할당 비율입니다:',
          '',
          '📊 토큰 배분:',
          '• 프리세일 (50%): 프로젝트 시작 자금을 위해 IDO 또는 유사한 방법으로 토큰을 판매하여 게임 개발 및 운영을 위한 SOL 조달',
          '• 유동성 (30%): DEX 유동성 풀을 위해 토큰 유통 및 거래 활동 보장',
          '• 투표 에어드롭 (10%): 투표 활동을 통해 커뮤니티 구성원에게 에어드롭, 게임 선택 및 거버넌스 참여 보상',
          '• SOL 생태계 에어드롭 (7%): Solana 생태계 사용자에게 에어드롭, 프로젝트 생태계 통합 및 사용자 성장 촉진',
          '• 개발 (3%): 프로젝트 개발 및 유지보수를 위해 향후 업데이트 및 개선 지원',
          '',
          '💎 토큰 용도:',
          '• 초기 용도: 토큰은 발행 초기 단계에서 주로 투자 또는 투기 도구로 기능하며 커뮤니티 참여를 상징',
          '• 향후 용도: 게임 개발이 진행됨에 따라 토큰은 게임의 play-to-earn(P2E) 메커니즘에 통합되어 다음과 같이 사용:',
          '  - 게임 내 구매: 플레이어는 토큰을 사용하여 게임 내 아이템, 캐릭터 등을 구매',
          '  - 스테이킹: 보유자는 토큰을 스테이킹하여 보상을 획득',
          '  - 커뮤니티 거버넌스: 토큰 보유자는 게임 규칙, 업데이트 등의 투표 결정에 참여',
          '',
          '⚠️ 위험 공개: 밈 토큰으로서 이러한 토큰은 높은 변동성을 가질 수 있으며, 투자자는 신중해야 합니다.'
        ]
      },
      roadmap: {
        title: '로드맵',
        content: [
          '2025-Q3:',
          '• 투표 플랫폼 출시, 첫 라운드 투표 시작',
          '• 첫 번째 클래식 게임 선정, 전용 밈 토큰 생성, SOL 모금 시작',
          '• 첫 번째 게임 개발 완료, P2E 메커니즘 통합',
          '',
          '2025-Q4:',
          '• 첫 번째 게임 출시, 두 번째 라운드 투표 시작',
          '• 두 번째 클래식 게임 선정, 전용 밈 토큰 생성, SOL 모금 시작',
          '',
          '2026-Q1:',
          '• 두 번째 게임 개발 완료, P2E 메커니즘 통합',
          '• 스테이킹 프로토콜 애플리케이션 구현 완료',
          '• 더 많은 게임 개발 지속, 생태계 확장'
        ]
      },
      risks: {
        title: '위험 및 법적 공개',
        content: [
          '⚠️ 위험 공개:',
          '• 투자 위험: 밈 토큰은 높은 변동성을 가질 수 있으며, 투자자는 신중해야 합니다',
          '• 스마트 컨트랙트 위험: 프로젝트는 엄격한 보안 감사를 실시하지만 스마트 컨트랙트에는 잠재적 위험이 남아있습니다',
          '• 규제 위험: 블록체인 프로젝트는 향후 규제 변화에 직면할 수 있습니다',
          '',
          '📜 저작권 성명:',
          '• 개발되는 모든 게임은 오리지널 작품이며, 클래식 게임에서 영감을 받았지만 저작권을 침해하지 않습니다',
          '• 프로젝트 팀은 법률 전문가와 협력하여 모든 게임이 현지 법률을 준수하고 저작권 보호 자료의 직접 사용을 피하도록 보장합니다',
          '',
          '🎯 결론:',
          'GAME PUMP는 단순한 게임 프로젝트가 아니라 Web3에서 클래식 게임을 다시 위대하게 만드는 운동입니다. 우리는 클래식 게임의 매력이 결코 시대에 뒤떨어지지 않으며, 블록체인 기술이 새로운 활력을 줄 수 있다고 믿습니다. 커뮤니티의 참여와 혁신을 통해 향수와 미래가 융합하는 게임 생태계를 함께 만들어갑니다. 우리와 함께 클래식 게임을 다시 위대하게 만들어보세요!'
        ]
      }
    }
  }

  const sections = sectionsMap[lang]
  const content = contentMap[lang]

  return (
    <section id="whitepaper" className="py-20 relative">
      {/* 动态背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-retro text-retro-green mb-6 animate-glow">
            {titleMap[lang]}
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边导航 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/4"
          >
            <div className="pixel-card p-6 sticky top-24">
              <h3 className="text-xl font-retro text-retro-cyan mb-6">目录</h3>
              <nav className="space-y-3">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-pixel text-sm ${
                      activeSection === section.id
                        ? 'bg-retro-green/20 text-retro-green border-l-4 border-retro-green'
                        : 'text-gray-400 hover:text-retro-cyan hover:bg-gray-800/50'
                    }`}
                  >
                    <span className="mr-3">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* 主要内容 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-3/4"
          >
            <div className="pixel-card p-8">
              {Object.entries(content).map(([sectionId, sectionContent]) => (
                <div
                  key={sectionId}
                  className={`${activeSection === sectionId ? 'block' : 'hidden'}`}
                >
                  <h3 className="text-2xl font-retro text-retro-yellow mb-6">
                    {sectionContent.title}
                  </h3>
                  <div className="space-y-4">
                    {sectionContent.content.map((paragraph, index) => (
                      <div key={index}>
                        {paragraph === '' ? (
                          <div className="h-4"></div>
                        ) : paragraph.startsWith('•') ? (
                          <div className="flex items-start space-x-3 ml-4">
                            <span className="text-retro-green mt-1">•</span>
                            <p className="text-gray-300 font-pixel leading-relaxed">
                              {paragraph.substring(2)}
                            </p>
                          </div>
                        ) : paragraph.includes('：') || paragraph.includes(':') ? (
                          <h4 className="text-lg font-retro text-retro-cyan mt-6 mb-3">
                            {paragraph}
                          </h4>
                        ) : paragraph.startsWith('  -') ? (
                          <div className="flex items-start space-x-3 ml-8">
                            <span className="text-retro-yellow mt-1">-</span>
                            <p className="text-gray-300 font-pixel leading-relaxed">
                              {paragraph.substring(4)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-300 font-pixel leading-relaxed">
                            {paragraph}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 