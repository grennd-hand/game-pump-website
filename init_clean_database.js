const { MongoClient } = require('mongodb');

async function initCleanDatabase() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ 连接到MongoDB成功');
    
    const db = client.db('game-pump-local');
    
    // 验证数据库为空
    const collections = await db.listCollections().toArray();
    console.log('📁 当前集合:', collections.map(c => c.name));
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`${collection.name}: ${count} 条记录`);
    }
    
    // 创建一个活跃的投票轮次
    console.log('\n🎮 创建初始投票轮次...');
    
    const votingRound = {
      roundNumber: 1,
      title: "经典游戏复兴计划 - 第一轮",
      description: "投票选择你最想复兴的经典游戏",
      status: "active",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后结束
      totalVotes: 0,
      totalParticipants: 0,
      votingRules: {
        maxVotesPerWallet: 3,
        minSolBalance: 0.001
      },
      games: [
        {
          id: "tetris",
          name: "Tetris",
          nameTranslations: {
            en: "Tetris",
            zh: "俄罗斯方块", 
            ja: "テトリス",
            ko: "테트리스"
          },
          icon: "🟦",
          description: "Classic falling blocks puzzle game",
          descriptionTranslations: {
            en: "Classic falling blocks puzzle game",
            zh: "经典的方块消除益智游戏",
            ja: "クラシックな落下ブロックパズルゲーム", 
            ko: "클래식 블록 퍼즐 게임"
          },
          released: "1984",
          platform: "Multiple",
          developer: "Alexey Pajitnov",
          votes: 0,
          voters: []
        },
        {
          id: "pac-man",
          name: "Pac-Man",
          nameTranslations: {
            en: "Pac-Man",
            zh: "吃豆人",
            ja: "パックマン",
            ko: "팩맨"
          },
          icon: "🟡",
          description: "Arcade maze action game",
          descriptionTranslations: {
            en: "Arcade maze action game",
            zh: "街机迷宫动作游戏",
            ja: "アーケード迷路アクションゲーム",
            ko: "아케이드 미로 액션 게임"
          },
          released: "1980",
          platform: "Arcade",
          developer: "Namco",
          votes: 0,
          voters: []
        },
        {
          id: "super-mario",
          name: "Super Mario Bros",
          nameTranslations: {
            en: "Super Mario Bros",
            zh: "超级马里奥兄弟",
            ja: "スーパーマリオブラザーズ",
            ko: "슈퍼 마리오 브라더스"
          },
          icon: "🍄",
          description: "Platform adventure game",
          descriptionTranslations: {
            en: "Platform adventure game", 
            zh: "平台冒险游戏",
            ja: "プラットフォームアドベンチャーゲーム",
            ko: "플랫폼 어드벤처 게임"
          },
          released: "1985",
          platform: "Nintendo",
          developer: "Nintendo",
          votes: 0,
          voters: []
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('votingrounds').insertOne(votingRound);
    console.log(`✅ 创建投票轮次成功: ${result.insertedId}`);
    
    console.log('\n🎉 数据库初始化完成！');
    console.log('📊 当前状态:');
    console.log(`   投票轮次: 1个`);
    console.log(`   游戏选项: 3个`);
    console.log(`   用户: 0个（等待钱包连接）`);
    
  } catch (error) {
    console.error('❌ 初始化失败:', error);
  } finally {
    await client.close();
    console.log('✅ 数据库连接已关闭');
  }
}

initCleanDatabase(); 