import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Proposal from '@/models/Proposal';

// 删除提案
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: '钱包地址是必需的' },
        { status: 400 }
      );
    }

    const proposal = await Proposal.findById(id);

    if (!proposal) {
      return NextResponse.json(
        { error: '提案不存在' },
        { status: 404 }
      );
    }

    // 检查权限：只有作者可以删除
    if (proposal.author !== walletAddress) {
      return NextResponse.json(
        { error: '只有提案作者可以删除提案' },
        { status: 403 }
      );
    }

    // 检查状态：只有pending或没有投票的提案可以删除
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    if (proposal.status === 'active' && totalVotes > 0) {
      return NextResponse.json(
        { error: '已有投票的提案无法删除' },
        { status: 400 }
      );
    }

    await Proposal.findByIdAndDelete(id);

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