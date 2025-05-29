import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Solana连接配置 - 暂时使用devnet，因为主网RPC端点访问受限
const RPC_ENDPOINTS = [
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  'https://devnet.helius-rpc.com/?api-key=demo',
  'https://rpc.ankr.com/solana_devnet'
];

// 创建连接实例
const connection = new Connection(RPC_ENDPOINTS[0], {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000,
});

// 钱包连接API
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { walletAddress, solBalance: frontendBalance } = await request.json();
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: '钱包地址是必需的' },
        { status: 400 }
      );
    }

    // 验证钱包地址格式
    let publicKey: PublicKey;
    try {
      publicKey = new PublicKey(walletAddress);
    } catch (error) {
      return NextResponse.json(
        { error: '无效的钱包地址' },
        { status: 400 }
      );
    }

    // 获取SOL余额 - 暂时使用模拟数据，因为RPC端点访问受限
    let solBalance = 0;
    let balanceCheckFailed = false;
    
    console.log(`🔍 开始获取钱包余额: ${walletAddress}`);
    
    // 使用前端传递的真实余额
    if (typeof frontendBalance === 'number' && frontendBalance >= 0) {
      solBalance = frontendBalance;
      balanceCheckFailed = false;
      console.log(`✅ 接收前端真实余额: ${solBalance} SOL`);
    } else {
      console.log(`⚠️  前端未提供余额，余额设为0`);
      solBalance = 0;
      balanceCheckFailed = true;
    }

    // 查找现有用户
    let user = await User.findOne({ walletAddress });
    let isNewUser = false;
    
    if (!user) {
      // 创建新用户
      isNewUser = true;
      
      // 根据SOL余额分配投票数（主网使用较低的门槛）
      let initialVotes = 0;
      const minBalance = 0.1; // 主网最低要求0.1 SOL
      
      if (balanceCheckFailed) {
        // 如果余额检查失败，不分配投票权
        initialVotes = 0;
        console.log('⚠️  余额检查失败，不分配投票权');
      } else if (solBalance >= minBalance) {
        initialVotes = 3; // 满足最低要求，获得全部投票权
        console.log(`✅ 余额${solBalance} SOL >= ${minBalance}，分配3票`);
      } else {
        console.log(`❌ 余额${solBalance} SOL 不足，需要至少${minBalance} SOL`);
      }

      try {
        // 生成唯一的邀请码
        let inviteCode;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
          try {
            inviteCode = (User as any).generateInviteCode();
            const existingUser = await User.findOne({ inviteCode });
            if (!existingUser) {
              break; // 找到唯一的邀请码
            }
            attempts++;
          } catch (error) {
            console.warn('生成邀请码时出错:', error);
            attempts++;
          }
        }
        
        if (attempts >= maxAttempts) {
          console.warn('无法生成唯一邀请码，将在保存后生成');
          inviteCode = null;
        }

        user = new User({
          walletAddress,
          username: `Player_${walletAddress.slice(-6)}`,
          totalVotes: 0,
          totalTokens: 0,
          availableVotes: initialVotes,
          solBalance: solBalance,
          level: 1,
          experience: 0,
          achievements: [],
          preferences: {
            language: 'zh',
            notifications: true
          },
          inviteCode,
          dailyCheckin: {
            consecutiveDays: 0,
            totalCheckins: 0
          },
          inviteRewards: {
            totalInvites: 0,
            totalRewards: 0
          }
        });
        
        await user.save();
        
        // 如果没有邀请码，保存后再生成
        if (!user.inviteCode) {
          let retryAttempts = 0;
          while (retryAttempts < 5) {
            try {
              const newInviteCode = (User as any).generateInviteCode();
              const existingUser = await User.findOne({ inviteCode: newInviteCode });
              if (!existingUser) {
                user.inviteCode = newInviteCode;
                await user.save();
                break;
              }
              retryAttempts++;
            } catch (error) {
              console.warn('重试生成邀请码失败:', error);
              retryAttempts++;
            }
          }
        }
      } catch (saveError: any) {
        // 如果是重复键错误，说明用户在并发请求中已被创建，重新查找
        if (saveError.code === 11000) {
          user = await User.findOne({ walletAddress });
          isNewUser = false;
          if (!user) {
            throw new Error('用户创建失败');
          }
        } else {
          throw saveError;
        }
      }
      
    } else {
      // 更新现有用户
      user.lastActive = new Date();
      user.solBalance = solBalance;
      
      // 为现有用户添加缺失的字段
      if (!user.inviteCode) {
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
          try {
            const inviteCode = (User as any).generateInviteCode();
            const existingUser = await User.findOne({ inviteCode });
            if (!existingUser) {
              user.inviteCode = inviteCode;
              break;
            }
            attempts++;
          } catch (error) {
            console.warn('为现有用户生成邀请码时出错:', error);
            attempts++;
          }
        }
        
        if (attempts >= maxAttempts) {
          console.warn('无法为现有用户生成唯一邀请码');
          // 使用时间戳作为后备方案
          user.inviteCode = `USER${Date.now().toString().slice(-6)}`;
        }
      }
      
      if (!user.dailyCheckin) {
        user.dailyCheckin = {
          consecutiveDays: 0,
          totalCheckins: 0
        };
      }
      
      if (!user.inviteRewards) {
        user.inviteRewards = {
          totalInvites: 0,
          totalRewards: 0
        };
      }
      
      if (!user.invitedUsers) {
        user.invitedUsers = [];
      }
      
      if (balanceCheckFailed) {
        // 如果余额检查失败，保留原有投票权但记录问题
        console.log('⚠️  现有用户余额检查失败，保留原投票权');
      } else {
        // 根据实际余额重新评估投票权，但保护签到获得的票数
        const minBalance = 0; // 测试环境设为0，方便测试
        
        // 检查用户是否今天签到过，如果签到过则保护签到票数
        const today = new Date();
        const lastCheckin = user.dailyCheckin?.lastCheckinDate ? new Date(user.dailyCheckin.lastCheckinDate) : null;
        const hasCheckedInToday = lastCheckin && today.toDateString() === lastCheckin.toDateString();
        
        if (solBalance >= minBalance) {
          // 余额充足，确保有基础3票投票权
          const baseVotes = 3;
          if (user.availableVotes < baseVotes) {
            user.availableVotes = baseVotes;
            console.log(`✅ 用户余额${solBalance} SOL >= ${minBalance}，分配${baseVotes}票`);
          } else {
            console.log(`✅ 用户余额${solBalance} SOL >= ${minBalance}，保持${user.availableVotes}票`);
          }
        } else {
          // 余额不足，但保护签到获得的票数
          if (hasCheckedInToday && user.availableVotes > 0) {
            console.log(`🎁 用户余额${solBalance} SOL < ${minBalance}，但保护签到票数${user.availableVotes}票`);
          } else if (user.availableVotes > 0) {
            user.availableVotes = 0;
            console.log(`❌ 用户余额${solBalance} SOL < ${minBalance}，清零投票权`);
          } else {
            console.log(`❌ 用户余额${solBalance} SOL < ${minBalance}，无投票权`);
          }
        }
      }
      
      // 使用findOneAndUpdate避免版本冲突
      user = await User.findOneAndUpdate(
        { _id: user._id },
        {
          lastActive: user.lastActive,
          solBalance: user.solBalance,
          inviteCode: user.inviteCode,
          dailyCheckin: user.dailyCheckin,
          inviteRewards: user.inviteRewards,
          invitedUsers: user.invitedUsers,
          availableVotes: user.availableVotes
        },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      isNewUser,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        avatar: user.avatar,
        totalVotes: user.totalVotes,
        totalTokens: user.totalTokens,
        availableVotes: user.availableVotes,
        solBalance: user.solBalance,
        level: user.level,
        experience: user.experience,
        achievements: user.achievements,
        preferences: user.preferences,
        joinedAt: user.joinedAt,
        lastActive: user.lastActive,
        inviteCode: user.inviteCode,
        invitedBy: user.invitedBy,
        dailyCheckin: user.dailyCheckin,
        inviteRewards: user.inviteRewards
      },
      message: isNewUser ? '欢迎新玩家！' : '欢迎回来！'
    });

  } catch (error) {
    console.error('钱包连接API错误:', error);
    
    // 详细的错误信息
    let errorMessage = '服务器内部错误';
    if (error instanceof Error) {
      console.error('错误详情:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // 根据错误类型提供更具体的错误信息
      if (error.message.includes('duplicate key')) {
        errorMessage = '用户已存在，请重试';
      } else if (error.message.includes('validation')) {
        errorMessage = '数据验证失败';
      } else if (error.message.includes('connection')) {
        errorMessage = '数据库连接失败';
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
} 