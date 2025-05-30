const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// 连接MongoDB
async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/game-pump-local';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB 连接成功');

    // 清理现有投票轮次
    await mongoose.connection.dropCollection('votingrounds');

  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error);
    process.exit(1);
  }
}

// 投票轮次模型
const VotingRoundSchema = new mongoose.Schema({
  roundNumber: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  games: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    nameTranslations: {
      en: String,
      zh: String,
      ja: String,
      ko: String
    },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    descriptionTranslations: {
      en: String,
      zh: String,
      ja: String,
      ko: String
    },
    released: { type: String, required: true },
    platform: String,
    developer: String,
    votes: { type: Number, default: 0 },
    voters: [{ type: String }]
  }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'active'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalVotes: { type: Number, default: 0 },
  totalParticipants: { type: Number, default: 0 },
  winnerGameId: { type: String, default: null },
  winnerToken: { type: String, default: null },
  votingRules: {
    minSOLBalance: { type: Number, default: 0 },
    maxVotesPerWallet: { type: Number, default: 3 },
    votingPower: { type: String, enum: ['equal', 'weighted'], default: 'equal' }
  },
  rewards: {
    votingAirdropPercentage: { type: Number, default: 10 },
    participationRewards: { type: Boolean, default: true }
  }
}, { timestamps: true });

const VotingRound = mongoose.model('VotingRound', VotingRoundSchema);

// 19个经典游戏数据
const classicGames = [
  {
    id: "1",
    name: "Tetris",
    nameTranslations: {
      en: "Tetris",
      zh: "俄罗斯方块",
      ja: "テトリス",
      ko: "테트리스"
    },
    icon: "🟦",
    description: "Soviet scientist's simple yet extremely addictive block-stacking game, Game Boy version sold over 35 million copies worldwide",
    descriptionTranslations: {
      en: "Soviet scientist's simple yet extremely addictive block-stacking game, Game Boy version sold over 35 million copies worldwide",
      zh: "苏联科学家设计的简单却极具成瘾性的方块堆叠游戏，Game Boy版全球销量超3500万",
      ja: "ソビエトの科学者が設計したシンプルでありながら極めて中毒性のあるブロック積みゲーム",
      ko: "소비에트 과학자가 설계한 단순하면서도 극도로 중독성 있는 블록 쌓기 게임"
    },
    released: "1984",
    platform: "Electronika 60, Game Boy",
    developer: "Alexey Pajitnov",
    votes: 18456
  },
  {
    id: "2",
    name: "Donkey Kong",
    nameTranslations: {
      en: "Donkey Kong",
      zh: "大金刚",
      ja: "ドンキーコング",
      ko: "동키콩"
    },
    icon: "🦍",
    description: "Miyamoto's early work, first introduced Mario (then called Jumpman), arcade era classic that laid Nintendo's foundation",
    descriptionTranslations: {
      en: "Miyamoto's early work, first introduced Mario (then called Jumpman), arcade era classic that laid Nintendo's foundation",
      zh: "宫本茂的早期作品，首次引入马里奥（当时叫Jumpman），街机时代经典，奠定了任天堂游戏基础",
      ja: "宮本茂の初期作品、マリオ（当時はジャンプマン）を初めて紹介",
      ko: "미야모토 시게루의 초기 작품, 마리오를 처음 소개한 게임"
    },
    released: "1981",
    platform: "Arcade, NES",
    developer: "Nintendo",
    votes: 15234
  },
  {
    id: "3",
    name: "Pac-Man",
    nameTranslations: {
      en: "Pac-Man",
      zh: "吃豆人",
      ja: "パックマン",
      ko: "팩맨"
    },
    icon: "🟡",
    description: "Iconic yellow circular character, global arcade phenomenon, cultural symbol with countless sales and remakes",
    descriptionTranslations: {
      en: "Iconic yellow circular character, global arcade phenomenon, cultural symbol with countless sales and remakes",
      zh: "标志性黄色圆形角色，全球街机现象，文化符号，销量和重制版无数",
      ja: "象徴的な黄色い円形キャラクター、世界的なアーケード現象",
      ko: "상징적인 노란색 원형 캐릭터, 전 세계적인 아케이드 현상"
    },
    released: "1980",
    platform: "Arcade, Multiple",
    developer: "Namco",
    votes: 14567
  },
  {
    id: "4",
    name: "Super Mario Bros",
    nameTranslations: {
      en: "Super Mario Bros",
      zh: "超级马里奥兄弟",
      ja: "スーパーマリオブラザーズ",
      ko: "슈퍼 마리오 브라더스"
    },
    icon: "🍄",
    description: "Defined 2D platform games, sold over 40 million copies, NES bundle sales drove home console popularity",
    descriptionTranslations: {
      en: "Defined 2D platform games, sold over 40 million copies, NES bundle sales drove home console popularity",
      zh: "定义2D平台游戏，销量超4000万，NES捆绑销售推动了家用主机普及",
      ja: "2Dプラットフォームゲームを定義、4000万本以上の売上",
      ko: "2D 플랫폼 게임을 정의, 4천만 장 이상 판매"
    },
    released: "1985",
    platform: "NES",
    developer: "Nintendo",
    votes: 13890
  },
  {
    id: "5",
    name: "The Legend of Zelda",
    nameTranslations: {
      en: "The Legend of Zelda",
      zh: "塞尔达传说",
      ja: "ゼルダの伝説",
      ko: "젤다의 전설"
    },
    icon: "🗡️",
    description: "Open-world adventure game pioneer, Link's debut, established series' exploration and puzzle-solving core",
    descriptionTranslations: {
      en: "Open-world adventure game pioneer, Link's debut, established series' exploration and puzzle-solving core",
      zh: "开放式冒险游戏先驱，Link的初次登场，奠定系列探索和解谜核心",
      ja: "オープンワールドアドベンチャーゲームの先駆者",
      ko: "오픈 월드 어드벤처 게임의 선구자"
    },
    released: "1986",
    platform: "NES",
    developer: "Nintendo",
    votes: 8234
  },
  {
    id: "6",
    name: "Final Fantasy",
    nameTranslations: {
      en: "Final Fantasy",
      zh: "最终幻想",
      ja: "ファイナルファンタジー",
      ko: "파이널 판타지"
    },
    icon: "⚔️",
    description: "Opened the JRPG era, Square's lifesaver when facing bankruptcy, profound global influence",
    descriptionTranslations: {
      en: "Opened the JRPG era, Square's lifesaver when facing bankruptcy, profound global influence",
      zh: "开启了JRPG时代，史克威尔濒临破产时的救命之作，全球影响力深远",
      ja: "JRPGの時代を開いた、スクウェアの破産危機を救った作品",
      ko: "JRPG 시대를 연 작품, 스퀘어의 파산 위기를 구한 게임"
    },
    released: "1987",
    platform: "NES",
    developer: "Square",
    votes: 6789
  },
  {
    id: "7",
    name: "Mega Man 2",
    nameTranslations: {
      en: "Mega Man 2",
      zh: "洛克人2",
      ja: "ロックマン2",
      ko: "록맨 2"
    },
    icon: "🤖",
    description: "One of the best Mega Man series works, precise controls and classic music, sold over 1.5 million copies",
    descriptionTranslations: {
      en: "One of the best Mega Man series works, precise controls and classic music, sold over 1.5 million copies",
      zh: "洛克人系列最佳作品之一，精准操作和经典音乐，销量超150万",
      ja: "ロックマンシリーズの最高傑作の一つ、精密な操作と名曲",
      ko: "록맨 시리즈 최고 작품 중 하나, 정밀한 조작과 명곡"
    },
    released: "1988",
    platform: "NES",
    developer: "Capcom",
    votes: 4567
  },
  {
    id: "8",
    name: "Contra",
    nameTranslations: {
      en: "Contra",
      zh: "魂斗罗",
      ja: "コントラ",
      ko: "콘트라"
    },
    icon: "🔫",
    description: "Hardcore two-player co-op shooter, classic '30 lives' cheat code, action game benchmark",
    descriptionTranslations: {
      en: "Hardcore two-player co-op shooter, classic '30 lives' cheat code, action game benchmark",
      zh: "硬核双人合作射击，经典\"30条命\"秘籍，动作游戏标杆",
      ja: "ハードコア2人協力シューティング、伝説の30人チート",
      ko: "하드코어 2인 협력 슈팅, 전설의 30명 치트"
    },
    released: "1987",
    platform: "Arcade, NES",
    developer: "Konami",
    votes: 3456
  },
  {
    id: "9",
    name: "Sonic the Hedgehog",
    nameTranslations: {
      en: "Sonic the Hedgehog",
      zh: "索尼克刺猬",
      ja: "ソニック・ザ・ヘッジホッグ",
      ko: "소닉 더 헤지혹"
    },
    icon: "💙",
    description: "Sega's mascot, high-speed gameplay to compete with Mario, sold over 15 million copies",
    descriptionTranslations: {
      en: "Sega's mascot, high-speed gameplay to compete with Mario, sold over 15 million copies",
      zh: "世嘉的吉祥物，高速玩法对抗马里奥，销量超1500万",
      ja: "セガのマスコット、マリオに対抗する高速ゲームプレイ",
      ko: "세가의 마스코트, 마리오에 대항하는 고속 게임플레이"
    },
    released: "1991",
    platform: "Sega Genesis",
    developer: "Sega",
    votes: 2890
  },
  {
    id: "10",
    name: "Street Fighter II",
    nameTranslations: {
      en: "Street Fighter II",
      zh: "街头霸王II",
      ja: "ストリートファイターII",
      ko: "스트리트 파이터 II"
    },
    icon: "👊",
    description: "Defined modern fighting games, global arcade craze, characters like Ryu and Ken became cultural icons",
    descriptionTranslations: {
      en: "Defined modern fighting games, global arcade craze, characters like Ryu and Ken became cultural icons",
      zh: "定义现代格斗游戏，全球街机热潮，角色如隆和肯成为文化符号",
      ja: "現代格闘ゲームを定義、リュウやケンが文化的アイコンに",
      ko: "현대 격투 게임을 정의, 류와 켄이 문화적 아이콘이 됨"
    },
    released: "1991",
    platform: "Arcade, SNES",
    developer: "Capcom",
    votes: 2567
  },
  {
    id: "11",
    name: "Super Mario World",
    nameTranslations: {
      en: "Super Mario World",
      zh: "超级马里奥世界",
      ja: "スーパーマリオワールド",
      ko: "슈퍼 마리오 월드"
    },
    icon: "🌍",
    description: "SNES launch game, introduced Yoshi, classic level design, sold over 20 million copies",
    descriptionTranslations: {
      en: "SNES launch game, introduced Yoshi, classic level design, sold over 20 million copies",
      zh: "SNES首发游戏，引入耀西，关卡设计经典，销量超2000万",
      ja: "SNES発売ゲーム、ヨッシー初登場、2000万本以上の売上",
      ko: "SNES 출시 게임, 요시 첫 등장, 2천만 장 이상 판매"
    },
    released: "1990",
    platform: "SNES",
    developer: "Nintendo",
    votes: 2234
  },
  {
    id: "12",
    name: "Pokémon Red/Green",
    nameTranslations: {
      en: "Pokémon Red/Green",
      zh: "宝可梦红/绿",
      ja: "ポケットモンスター赤・緑",
      ko: "포켓몬스터 빨강/초록"
    },
    icon: "⚡",
    description: "Started global Pokémon craze, 151 original Pokémon, sold over 31 million copies",
    descriptionTranslations: {
      en: "Started global Pokémon craze, 151 original Pokémon, sold over 31 million copies",
      zh: "开启全球宝可梦热潮，151只初代宝可梦，销量超3100万",
      ja: "世界的ポケモンブームの始まり、151匹のオリジナルポケモン",
      ko: "전 세계 포켓몬 열풍의 시작, 151마리의 오리지널 포켓몬"
    },
    released: "1996",
    platform: "Game Boy",
    developer: "Game Freak",
    votes: 1890
  },
  {
    id: "13",
    name: "Super Metroid",
    nameTranslations: {
      en: "Super Metroid",
      zh: "超级银河战士",
      ja: "スーパーメトロイド",
      ko: "슈퍼 메트로이드"
    },
    icon: "🚀",
    description: "Metroid series pinnacle, 'Metroidvania' genre benchmark, non-linear exploration masterpiece",
    descriptionTranslations: {
      en: "Metroid series pinnacle, 'Metroidvania' genre benchmark, non-linear exploration masterpiece",
      zh: "银河战士系列巅峰，\"Metroidvania\"类型的标杆，非线性探索",
      ja: "メトロイドシリーズの頂点、メトロイドヴァニアジャンルの基準",
      ko: "메트로이드 시리즈의 정점, 메트로이드바니아 장르의 기준"
    },
    released: "1994",
    platform: "SNES",
    developer: "Nintendo",
    votes: 1567
  },
  {
    id: "14",
    name: "Final Fantasy VII",
    nameTranslations: {
      en: "Final Fantasy VII",
      zh: "最终幻想VII",
      ja: "ファイナルファンタジーVII",
      ko: "파이널 판타지 VII"
    },
    icon: "☁️",
    description: "JRPG milestone, 3D graphics and deep storyline, sold over 10 million copies",
    descriptionTranslations: {
      en: "JRPG milestone, 3D graphics and deep storyline, sold over 10 million copies",
      zh: "JRPG的里程碑，3D画面和深刻剧情，销量超1000万",
      ja: "JRPGのマイルストーン、3Dグラフィックと深いストーリー",
      ko: "JRPG의 이정표, 3D 그래픽과 깊은 스토리"
    },
    released: "1997",
    platform: "PlayStation",
    developer: "Square",
    votes: 1345
  },
  {
    id: "15",
    name: "Ocarina of Time",
    nameTranslations: {
      en: "The Legend of Zelda: Ocarina of Time",
      zh: "塞尔达传说：时之笛",
      ja: "ゼルダの伝説 時のオカリナ",
      ko: "젤다의 전설: 시간의 오카리나"
    },
    icon: "🎵",
    description: "3D adventure game benchmark, won countless awards, sold over 7.5 million copies",
    descriptionTranslations: {
      en: "3D adventure game benchmark, won countless awards, sold over 7.5 million copies",
      zh: "3D冒险游戏标杆，获无数奖项，销量超750万",
      ja: "3Dアドベンチャーゲームの基準、数々の賞を受賞",
      ko: "3D 어드벤처 게임의 기준, 수많은 상을 수상"
    },
    released: "1998",
    platform: "N64",
    developer: "Nintendo",
    votes: 1123
  },
  {
    id: "16",
    name: "Super Mario 64",
    nameTranslations: {
      en: "Super Mario 64",
      zh: "超级马里奥64",
      ja: "スーパーマリオ64",
      ko: "슈퍼 마리오 64"
    },
    icon: "🎮",
    description: "First 3D Mario game, open-world level design, sold over 11 million copies",
    descriptionTranslations: {
      en: "First 3D Mario game, open-world level design, sold over 11 million copies",
      zh: "首款3D马里奥游戏，开放式关卡设计，销量超1100万",
      ja: "初の3Dマリオゲーム、オープンワールドレベルデザイン",
      ko: "최초의 3D 마리오 게임, 오픈 월드 레벨 디자인"
    },
    released: "1996",
    platform: "N64",
    developer: "Nintendo",
    votes: 998
  },
  {
    id: "17",
    name: "Doom",
    nameTranslations: {
      en: "Doom",
      zh: "毁灭战士",
      ja: "DOOM",
      ko: "둠"
    },
    icon: "👹",
    description: "FPS game pioneer, violent fast-paced action, established modern shooter game foundation",
    descriptionTranslations: {
      en: "FPS game pioneer, violent fast-paced action, established modern shooter game foundation",
      zh: "FPS游戏先驱，暴力快节奏，奠定现代射击游戏基础",
      ja: "FPSゲームの先駆者、激しい高速アクション",
      ko: "FPS 게임의 선구자, 격렬한 고속 액션"
    },
    released: "1993",
    platform: "PC, Multiple",
    developer: "id Software",
    votes: 876
  },
  {
    id: "18",
    name: "StarCraft",
    nameTranslations: {
      en: "StarCraft",
      zh: "星际争霸",
      ja: "スタークラフト",
      ko: "스타크래프트"
    },
    icon: "🌌",
    description: "Esports pioneer, global sales over 11 million, especially popular in Korea",
    descriptionTranslations: {
      en: "Esports pioneer, global sales over 11 million, especially popular in Korea",
      zh: "电竞鼻祖，全球销量超1100万，韩国尤为流行",
      ja: "eスポーツの先駆者、世界売上1100万本以上",
      ko: "e스포츠의 선구자, 전 세계 판매량 1100만 장 이상"
    },
    released: "1998",
    platform: "PC",
    developer: "Blizzard Entertainment",
    votes: 654
  },
  {
    id: "19",
    name: "Tomb Raider",
    nameTranslations: {
      en: "Tomb Raider",
      zh: "古墓丽影",
      ja: "トゥームレイダー",
      ko: "툼 레이더"
    },
    icon: "🏺",
    description: "3D action-adventure pioneer, iconic Lara Croft character, cultural phenomenon",
    descriptionTranslations: {
      en: "3D action-adventure pioneer, iconic Lara Croft character, cultural phenomenon",
      zh: "3D动作冒险先驱，标志性劳拉·克劳馥角色，文化现象",
      ja: "3Dアクションアドベンチャーの先駆者、象徴的なララ・クロフト",
      ko: "3D 액션 어드벤처의 선구자, 상징적인 라라 크로프트"
    },
    released: "1996",
    platform: "PlayStation, PC",
    developer: "Core Design",
    votes: 432
  }
];

async function initVotingRound() {
  try {
    await connectDB();

    // 创建新的投票轮次
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7天后结束

    const votingRound = new VotingRound({
      roundNumber: 2,
      title: "经典游戏投票 - 第一轮",
      description: "为你最喜爱的经典游戏投票，获胜游戏将获得专属meme代币发射！",
      games: classicGames,
      status: 'active',
      startDate,
      endDate,
      totalVotes: classicGames.reduce((sum, game) => sum + game.votes, 0),
      totalParticipants: 1337,
      votingRules: {
        minSOLBalance: 0,
        maxVotesPerWallet: 3,
        votingPower: 'equal'
      },
      rewards: {
        votingAirdropPercentage: 10,
        participationRewards: true
      }
    });

    await votingRound.save();
    console.log('✅ 投票轮次初始化成功');
    console.log(`📊 总游戏数: ${classicGames.length}`);
    console.log(`🗳️  总投票数: ${votingRound.totalVotes}`);
    console.log(`⏰ 结束时间: ${endDate.toLocaleString()}`);

  } catch (error) {
    console.error('❌ 初始化失败:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 数据库连接已断开');
  }
}

// 运行初始化
initVotingRound();