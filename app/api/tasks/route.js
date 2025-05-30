import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Task, UserTaskCompletion } from '@/models/Task';
import User from '@/models/User';

// 获取所有活跃任务
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const walletAddress = searchParams.get('walletAddress');
    
    // 构建查询条件
    const query = {
      status: 'active',
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: new Date() } }
      ]
    };
    
    if (category) {
      query.category = category;
    }
    
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    
    // 如果提供了钱包地址，获取用户的完成状态
    let userCompletions = {};
    if (walletAddress) {
      const completions = await UserTaskCompletion.find({
        walletAddress,
        taskId: { $in: tasks.map(t => t.id) }
      });
      
      userCompletions = completions.reduce((acc, completion) => {
        acc[completion.taskId] = completion;
        return acc;
      }, {});
    }
    
    // 添加完成状态到任务数据
    const tasksWithStatus = tasks.map(task => {
      const taskObj = task.toObject();
      if (walletAddress) {
        taskObj.userCompletion = userCompletions[task.id] || null;
      }
      return taskObj;
    });
    
    return NextResponse.json({
      success: true,
      tasks: tasksWithStatus
    });
    
  } catch (error) {
    console.error('❌ 获取任务失败:', error);
    return NextResponse.json(
      { success: false, error: '获取任务失败' },
      { status: 500 }
    );
  }
}

// 创建新任务（管理员功能）
export async function POST(request) {
  try {
    await dbConnect();
    
    const taskData = await request.json();
    
    // 生成任务ID
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTask = new Task({
      ...taskData,
      id: taskId
    });
    
    await newTask.save();
    
    return NextResponse.json({
      success: true,
      task: newTask
    });
    
  } catch (error) {
    console.error('❌ 创建任务失败:', error);
    return NextResponse.json(
      { success: false, error: '创建任务失败' },
      { status: 500 }
    );
  }
}