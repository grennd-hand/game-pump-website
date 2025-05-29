// 这个脚本用于初始化第一轮投票
// 运行: npx ts-node scripts/initializeVoting.ts

import mongoose from 'mongoose';
import VotingRound from '../models/VotingRound';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamepump';

const firstRoundData = {
  title: 'GAME PUMP 第一轮投票',
  description: '选择你最喜爱的经典游戏，获胜游戏将获得专属meme代币！',
  games: [
    {
      id: 'tetris',
      name: '俄罗斯方块',
      nameTranslations: {
        en: 'Tetris',
        zh: '俄罗斯方块',
        ja: 'テトリス',
        ko: '테트리스'
      },
      icon: '🟦',
      description: '苏联科学家设计的简单却极具成瘾性的方块堆叠游戏，Game Boy版全球销量超3500万',
      descriptionTranslations: {
        en: 'Simple yet highly addictive block-stacking game designed by Soviet scientist, Game Boy version sold over 35 million copies worldwide',
        zh: '苏联科学家设计的简单却极具成瘾性的方块堆叠游戏，Game Boy版全球销量超3500万',
        ja: 'ソビエトの科学者が設計したシンプルでありながら非常に中毒性のあるブロック積みゲーム、Game Boy版は世界で3500万本以上販売',
        ko: '소비에트 과학자가 설계한 단순하지만 매우 중독적인 블록 쌓기 게임, Game Boy 버전은 전 세계적으로 3500만 개 이상 판매'
      },
      released: '1984'
    },
    {
      id: 'donkey_kong',
      name: '大金刚',
      nameTranslations: {
        en: 'Donkey Kong',
        zh: '大金刚',
        ja: 'ドンキーコング',
        ko: '동키콩'
      },
      icon: '🦍',
      description: '宫本茂的早期作品，首次引入马里奥（当时叫Jumpman），街机时代经典',
      descriptionTranslations: {
        en: 'Early work by Shigeru Miyamoto, first introduction of Mario (then called Jumpman), arcade era classic',
        zh: '宫本茂的早期作品，首次引入马里奥（当时叫Jumpman），街机时代经典',
        ja: '宮本茂の初期作品、マリオ（当時はJumpman）の初登場、アーケード時代の名作',
        ko: '미야모토 시게루의 초기 작품, 마리오(당시 Jumpman)의 첫 등장, 아케이드 시대의 고전'
      },
      released: '1981'
    },
    {
      id: 'pac_man',
      name: '吃豆人',
      nameTranslations: {
        en: 'Pac-Man',
        zh: '吃豆人',
        ja: 'パックマン',
        ko: '팩맨'
      },
      icon: '🟡',
      description: '标志性黄色圆形角色，全球街机现象，文化符号，销量和重制版无数',
      descriptionTranslations: {
        en: 'Iconic yellow circular character, global arcade phenomenon, cultural symbol with countless sales and remakes',
        zh: '标志性黄色圆形角色，全球街机现象，文化符号，销量和重制版无数',
        ja: '象徴的な黄色い円形キャラクター、世界的なアーケード現象、文化的シンボル、無数の売上とリメイク',
        ko: '상징적인 노란색 원형 캐릭터, 전 세계 아케이드 현상, 문화적 상징, 무수한 판매량과 리메이크'
      },
      released: '1980'
    },
    {
      id: 'mario',
      name: '超级马里奥兄弟',
      nameTranslations: {
        en: 'Super Mario Bros',
        zh: '超级马里奥兄弟',
        ja: 'スーパーマリオブラザーズ',
        ko: '슈퍼 마리오 브라더스'
      },
      icon: '🍄',
      description: '定义2D平台游戏，销量超4000万，NES捆绑销售推动了家用主机普及',
      descriptionTranslations: {
        en: 'Defined 2D platform games, sold over 40 million copies, NES bundle sales drove home console adoption',
        zh: '定义2D平台游戏，销量超4000万，NES捆绑销售推动了家用主机普及',
        ja: '2Dプラットフォームゲームを定義、4000万本以上の売上、NESバンドル販売が家庭用ゲーム機の普及を推進',
        ko: '2D 플랫폼 게임을 정의, 4000만 개 이상 판매, NES 번들 판매로 가정용 콘솔 보급 촉진'
      },
      released: '1985'
    },
    {
      id: 'zelda',
      name: '塞尔达传说',
      nameTranslations: {
        en: 'The Legend of Zelda',
        zh: '塞尔达传说',
        ja: 'ゼルダの伝説',
        ko: '젤다의 전설'
      },
      icon: '⚔️',
      description: '开放式冒险游戏先驱，Link的初次登场，奠定系列探索和解谜核心',
      descriptionTranslations: {
        en: 'Pioneer of open-world adventure games, Link\'s debut, established the series\' core of exploration and puzzle-solving',
        zh: '开放式冒险游戏先驱，Link的初次登场，奠定系列探索和解谜核心',
        ja: 'オープンワールドアドベンチャーゲームの先駆者、リンクの初登場、シリーズの探索とパズル解決の核心を確立',
        ko: '오픈 월드 어드벤처 게임의 선구자, 링크의 첫 등장, 시리즈의 탐험과 퍼즐 해결 핵심 확립'
      },
      released: '1986'
    },
    {
      id: 'final_fantasy',
      name: '最终幻想',
      nameTranslations: {
        en: 'Final Fantasy',
        zh: '最终幻想',
        ja: 'ファイナルファンタジー',
        ko: '파이널 판타지'
      },
      icon: '🗡️',
      description: '开启了JRPG时代，史克威尔濒临破产时的救命之作，全球影响力深远',
      descriptionTranslations: {
        en: 'Launched the JRPG era, Square\'s lifesaver when facing bankruptcy, profound global influence',
        zh: '开启了JRPG时代，史克威尔濒临破产时的救命之作，全球影响力深远',
        ja: 'JRPGの時代を開いた、スクウェアが破産の危機に瀕した時の救世主、世界的な影響力が深い',
        ko: 'JRPG 시대를 열었고, 스퀘어가 파산 위기에 처했을 때의 구원작, 전 세계적으로 깊은 영향력'
      },
      released: '1987'
    },
    {
      id: 'mega_man',
      name: '洛克人2',
      nameTranslations: {
        en: 'Mega Man 2',
        zh: '洛克人2',
        ja: 'ロックマン2',
        ko: '록맨 2'
      },
      icon: '🤖',
      description: '洛克人系列最佳作品之一，精准操作和经典音乐，销量超150万',
      descriptionTranslations: {
        en: 'One of the best Mega Man series games, precise controls and classic music, sold over 1.5 million copies',
        zh: '洛克人系列最佳作品之一，精准操作和经典音乐，销量超150万',
        ja: 'ロックマンシリーズの最高傑作の一つ、精密な操作と名曲、150万本以上の売上',
        ko: '록맨 시리즈 최고 작품 중 하나, 정밀한 조작과 클래식 음악, 150만 개 이상 판매'
      },
      released: '1988'
    },
    {
      id: 'contra',
      name: '魂斗罗',
      nameTranslations: {
        en: 'Contra',
        zh: '魂斗罗',
        ja: '魂斗羅',
        ko: '콘트라'
      },
      icon: '💥',
      description: '硬核双人合作射击，经典"30条命"秘籍，动作游戏标杆',
      descriptionTranslations: {
        en: 'Hardcore two-player cooperative shooting, classic "30 lives" cheat code, action game benchmark',
        zh: '硬核双人合作射击，经典"30条命"秘籍，动作游戏标杆',
        ja: 'ハードコア2人協力シューティング、伝説の「30機」裏技、アクションゲームの基準',
        ko: '하드코어 2인 협동 슈팅, 전설적인 "30목숨" 치트 코드, 액션 게임의 기준'
      },
      released: '1987'
    },
    {
      id: 'sonic',
      name: '索尼克刺猬',
      nameTranslations: {
        en: 'Sonic the Hedgehog',
        zh: '索尼克刺猬',
        ja: 'ソニック・ザ・ヘッジホッグ',
        ko: '소닉 더 헤지혹'
      },
      icon: '💨',
      description: '世嘉的吉祥物，高速玩法对抗马里奥，销量超1500万',
      descriptionTranslations: {
        en: 'Sega\'s mascot, high-speed gameplay to compete with Mario, sold over 15 million copies',
        zh: '世嘉的吉祥物，高速玩法对抗马里奥，销量超1500万',
        ja: 'セガのマスコット、マリオに対抗する高速ゲームプレイ、1500万本以上の売上',
        ko: '세가의 마스코트, 마리오에 대항하는 고속 게임플레이, 1500만 개 이상 판매'
      },
      released: '1991'
    },
    {
      id: 'street_fighter',
      name: '街头霸王II',
      nameTranslations: {
        en: 'Street Fighter II',
        zh: '街头霸王II',
        ja: 'ストリートファイターII',
        ko: '스트리트 파이터 II'
      },
      icon: '👊',
      description: '定义现代格斗游戏，全球街机热潮，角色如隆和肯成为文化符号',
      descriptionTranslations: {
        en: 'Defined modern fighting games, global arcade craze, characters like Ryu and Ken became cultural icons',
        zh: '定义现代格斗游戏，全球街机热潮，角色如隆和肯成为文化符号',
        ja: '現代格闘ゲームを定義、世界的なアーケードブーム、リュウやケンなどのキャラクターが文化的アイコンに',
        ko: '현대 격투 게임을 정의, 전 세계 아케이드 열풍, 류와 켄 같은 캐릭터가 문화적 아이콘이 됨'
      },
      released: '1991'
    }
  ],
  status: 'active',
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后结束
  votingRules: {
    minSOLBalance: 0.1,
    maxVotesPerWallet: 3,
    votingPower: 'equal'
  },
  rewards: {
    votingAirdropPercentage: 10,
    participationRewards: true
  }
};

async function initializeVoting() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('连接到MongoDB成功');

    // 检查是否已存在投票轮次
    const existingRound = await VotingRound.findOne();
    if (existingRound) {
      console.log('投票轮次已存在，跳过初始化');
      return;
    }

    // 创建第一轮投票
    const round = new VotingRound({
      ...firstRoundData,
      roundNumber: 1
    });

    await round.save();
    console.log('第一轮投票初始化成功:', round._id);

  } catch (error) {
    console.error('初始化投票失败:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initializeVoting();
}

export default initializeVoting;