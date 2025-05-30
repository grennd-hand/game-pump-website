import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthError, rateLimit, getClientIP } from '@/lib/auth';
import { sanitizeInput, preventInjection } from '@/lib/validation';
import dbConnect from '@/lib/mongodb';
import Proposal from '@/models/Proposal';
import User from '@/models/User';
import mongoose from 'mongoose';

// 获取提案详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 限流保护
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 50, 60000)) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    await dbConnect();

    // 验证和清理提案ID
    const proposalId = sanitizeInput(params.id);
    
    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
      return NextResponse.json(
        { error: '无效的提案ID' },
        { status: 400 }
      );
    }

    // 查找提案
    const proposal = await Proposal.findById(proposalId)
      .select('-__v') // 排除版本字段
      .lean();

    if (!proposal) {
      return NextResponse.json(
        { error: '提案不存在' },
        { status: 404 }
      );
    }

    // 检查提案访问权限
    // 对于草稿状态的提案，只有创建者可以查看
    if (proposal.status === 'draft') {
      try {
        const user = requireAuth(request);
        if (user.walletAddress !== proposal.walletAddress) {
          return NextResponse.json(
            { error: '无权访问此提案' },
            { status: 403 }
          );
        }
      } catch (error) {
        return createAuthError('需要身份验证才能查看草稿提案');
      }
    }

    // 记录访问日志（用于审计）
    console.log(`📖 提案访问: ${proposalId} from IP: ${clientIP}`);

    return NextResponse.json({
      success: true,
      data: proposal
    });

  } catch (error) {
    console.error('获取提案详情错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 更新提案
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户身份
    let user;
    try {
      user = requireAuth(request);
    } catch (error) {
      return createAuthError('需要身份验证才能修改提案');
    }

    // 限流保护
    const clientIP = getClientIP(request);
    if (!rateLimit(clientIP, 10, 60000)) {
      return NextResponse.json(
        { error: '修改过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    await dbConnect();

    // 验证和清理提案ID
    const proposalId = sanitizeInput(params.id);
    
    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
      return NextResponse.json(
        { error: '无效的提案ID' },
        { status: 400 }
      );
    }

    // 查找提案并验证所有权
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return NextResponse.json(
        { error: '提案不存在' },
        { status: 404 }
      );
    }

    // 权限检查：只有创建者或管理员可以修改
    if (proposal.walletAddress !== user.walletAddress && !user.isAdmin) {
      return NextResponse.json(
        { error: '无权修改此提案' },
        { status: 403 }
      );
    }

    // 检查提案状态，已发布的提案不能修改
    if (proposal.status === 'active' || proposal.status === 'completed') {
      return NextResponse.json(
        { error: '已发布的提案无法修改' },
        { status: 400 }
      );
    }

    // 解析并验证更新数据
    const rawData = await request.json();
    const cleanedData = sanitizeInput(rawData);

    // 防止恶意字段更新
    const allowedFields = ['title', 'description', 'type', 'category'];
    const updateData: any = {};
    
    for (const field of allowedFields) {
      if (cleanedData[field] !== undefined) {
        updateData[field] = cleanedData[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: '没有提供有效的更新字段' },
        { status: 400 }
      );
    }

    // 更新时间戳
    updateData.updatedAt = new Date();

    // 执行更新
    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      updateData,
      { new: true, runValidators: true }
    );

    console.log(`📝 用户 ${user.walletAddress} 修改了提案 ${proposalId}`);

    return NextResponse.json({
      success: true,
      message: '提案更新成功',
      data: updatedProposal
    });

  } catch (error) {
    console.error('更新提案错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 删除提案
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户身份
    let user;
    try {
      user = requireAuth(request);
    } catch (error) {
      return createAuthError('需要身份验证才能删除提案');
    }

    await dbConnect();

    // 验证和清理提案ID
    const proposalId = sanitizeInput(params.id);

    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
      return NextResponse.json(
        { error: '无效的提案ID' },
        { status: 400 }
      );
    }

    // 查找提案并验证所有权
    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return NextResponse.json(
        { error: '提案不存在' },
        { status: 404 }
      );
    }

    // 权限检查：只有创建者或管理员可以删除
    if (proposal.walletAddress !== user.walletAddress && !user.isAdmin) {
      return NextResponse.json(
        { error: '无权删除此提案' },
        { status: 403 }
      );
    }

    // 检查提案状态，已发布的提案不能删除
    if (proposal.status === 'active') {
      return NextResponse.json(
        { error: '活跃状态的提案无法删除' },
        { status: 400 }
      );
    }

    // 执行删除
    await Proposal.findByIdAndDelete(proposalId);

    console.log(`🗑️ 用户 ${user.walletAddress} 删除了提案 ${proposalId}`);

    return NextResponse.json({
      success: true,
      message: '提案删除成功'
    });

  } catch (error) {
    console.error('删除提案错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 