import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthError, rateLimit, getClientIP } from '@/lib/auth';
import { VoteSchema, sanitizeInput } from '@/lib/validation';
import dbConnect from '@/lib/mongodb';
import Vote from '@/models/Vote';
import User from '@/models/User';
import VotingRound from '@/models/VotingRound';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    // 限流保护 - 每个IP每分钟最多5次投票
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 5, 60000)) {
      return NextResponse.json(
        { error: '投票过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    // 验证用户身份
    let user;
    try {
      user = requireAuth(request);
    } catch (error) {
      return createAuthError('需要身份验证才能投票');
    }

    // 解析并验证请求数据
    const rawData = await request.json();
    const cleanedData = sanitizeInput(rawData);
    
    let validatedData;
    try {
      validatedData = VoteSchema.parse(cleanedData);
    } catch (error: any) {
      return NextResponse.json(
        { error: `数据验证失败: ${error.message}` },
        { status: 400 }
      );
    }

    // 验证投票者钱包地址与认证用户一致
    if (validatedData.walletAddress !== user.walletAddress) {
      return NextResponse.json(
        { error: '投票钱包地址与认证用户不匹配' },
        { status: 403 }
      );
    }

    await dbConnect();

    // 验证用户是否存在
    const userExists = await User.findOne({ 
      walletAddress: validatedData.walletAddress 
    });
    
    if (!userExists) {
      return NextResponse.json(
        { error: '用户不存在，请先注册' },
        { status: 404 }
      );
    }

    // 验证投票轮次是否存在且处于活跃状态
    const votingRound = await VotingRound.findOne({
      _id: validatedData.proposalId,
      status: 'active',
      endDate: { $gt: new Date() }
    });

    if (!votingRound) {
      return NextResponse.json(
        { error: '投票轮次不存在或已结束' },
        { status: 404 }
      );
    }

    // 检查用户是否已经投过票
    const existingVote = await Vote.findOne({
      walletAddress: validatedData.walletAddress,
      proposalId: validatedData.proposalId
    });

    if (existingVote) {
      return NextResponse.json(
        { error: '您已经为此提案投过票了' },
        { status: 409 }
      );
    }

    // 检查用户投票权限（需要有足够的积分或满足条件）
    const MIN_POINTS_TO_VOTE = 100; // 最低100积分才能投票
    if (userExists.points < MIN_POINTS_TO_VOTE) {
      return NextResponse.json(
        { error: `需要至少${MIN_POINTS_TO_VOTE}积分才能投票，当前积分：${userExists.points}` },
        { status: 403 }
      );
    }

    // 检查用户是否在黑名单中
    if (userExists.status === 'banned') {
      return NextResponse.json(
        { error: '账户已被禁用，无法投票' },
        { status: 403 }
      );
    }

    // 使用事务确保数据一致性
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // 创建投票记录
        const vote = new Vote({
          walletAddress: validatedData.walletAddress,
          proposalId: validatedData.proposalId,
          vote: validatedData.vote,
          timestamp: new Date(),
          ipAddress: clientIP // 记录IP用于审计
        });

        await vote.save({ session });

        // 更新投票轮次统计
        const updateField = validatedData.vote === 'for' ? 'votesFor' : 'votesAgainst';
        await VotingRound.findByIdAndUpdate(
          validatedData.proposalId,
          { $inc: { [updateField]: 1 } },
          { session }
        );

        // 给用户增加投票积分奖励
        await User.findOneAndUpdate(
          { walletAddress: validatedData.walletAddress },
          { 
            $inc: { 
              points: 10, // 投票奖励10积分
              totalVotes: 1 
            }
          },
          { session }
        );

        console.log(`✅ 用户 ${validatedData.walletAddress} 投票成功: ${validatedData.vote} for ${validatedData.proposalId}`);
      });

      return NextResponse.json({
        success: true,
        message: '投票成功',
        data: {
          vote: validatedData.vote,
          proposalId: validatedData.proposalId,
          pointsEarned: 10
        }
      });

    } catch (transactionError) {
      console.error('投票事务失败:', transactionError);
      return NextResponse.json(
        { error: '投票失败，请重试' },
        { status: 500 }
      );
    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.error('投票API错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 