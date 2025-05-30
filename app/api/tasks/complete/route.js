import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Task, UserTaskCompletion } from '@/models/Task';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { taskId, walletAddress, verificationData } = await request.json();
    
    // 验证输入
    if (!taskId || !walletAddress) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    // 获取任务信息
    const task = await Task.findOne({ id: taskId, status: 'active' });
    if (!task) {
      return NextResponse.json(
        { success: false, error: '任务不存在或已过期' },
        { status: 404 }
      );
    }
    
    // 检查是否已经完成过
    const existingCompletion = await UserTaskCompletion.findOne({
      walletAddress,
      taskId
    });
    
    if (existingCompletion) {
      return NextResponse.json(
        { success: false, error: '已经完成过此任务' },
        { status: 409 }
      );
    }
    
    // 获取用户信息
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 验证用户是否已绑定相应的社交账号
    if (task.category === 'twitter') {
      if (!user.socialAccounts?.twitter?.username || !user.socialAccounts?.twitter?.verified) {
        return NextResponse.json(
          { success: false, error: '请先绑定并验证Twitter账号' },
          { status: 400 }
        );
      }
    }

    if (task.category === 'telegram') {
      if (!user.socialAccounts?.telegram?.username || !user.socialAccounts?.telegram?.verified) {
        return NextResponse.json(
          { success: false, error: '请先绑定并验证Telegram账号' },
          { status: 400 }
        );
      }
    }
    
    // 计算当前用户的任务完成总数（不包括当前这个任务）
    const completedTasksCount = await UserTaskCompletion.countDocuments({
      walletAddress,
      status: { $in: ['completed', 'verified'] }
    });
    
    // 获取用户当前积分，如果没有基础积分则设置为100
    if (user.totalPoints === 0) {
      user.totalPoints = 100; // 基础积分
    }
    
    // 积分计算逻辑：任务开始前的总积分乘以1.1
    const previousPoints = user.totalPoints;
    const newTotalPoints = Math.floor(previousPoints * 1.1);
    const pointsGained = newTotalPoints - previousPoints;
    
    // 创建任务完成记录
    const completion = new UserTaskCompletion({
      walletAddress,
      taskId,
      status: 'completed',
      verificationData: verificationData || {},
      completedAt: new Date(),
      rewardsEarned: {
        points: pointsGained,
        tokens: task.rewards.tokens,
        votes: task.rewards.votes,
        multiplierApplied: 1.1
      }
    });
    
    await completion.save();
    
    // 更新用户数据
    const updateData = {
      totalPoints: newTotalPoints,
      completedTasks: completedTasksCount + 1,
      taskMultiplier: Math.pow(1.1, completedTasksCount + 1)
    };
    
    // 添加投票奖励
    if (task.rewards.votes > 0) {
      updateData.availableVotes = user.availableVotes + task.rewards.votes;
    }
    
    await User.findOneAndUpdate(
      { walletAddress },
      updateData,
      { new: true }
    );
    
    // 更新任务的完成次数
    await Task.findOneAndUpdate(
      { id: taskId },
      { $inc: { totalCompletions: 1 } }
    );
    
    return NextResponse.json({
      success: true,
      completion,
      rewards: {
        basePoints: task.rewards.points, // 任务基础积分
        actualPoints: pointsGained,
        newTotalPoints: newTotalPoints, // 新的总积分
        previousPoints: previousPoints, // 之前的积分
        votes: task.rewards.votes,
        multiplier: 1.1,
        totalCompletedTasks: completedTasksCount + 1
      }
    });
    
  } catch (error) {
    console.error('❌ 完成任务失败:', error);
    return NextResponse.json(
      { success: false, error: '完成任务失败' },
      { status: 500 }
    );
  }
} 