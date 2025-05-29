import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Fundraising from '@/models/Fundraising';
import Token from '@/models/Token';

// 获取募集活动列表
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    const skip = (page - 1) * limit;
    
    const query: any = {};
    if (status !== 'all') {
      query.status = status;
    }
    
    const fundraisings = await Fundraising.find(query)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Fundraising.countDocuments(query);

    return NextResponse.json({
      success: true,
      fundraisings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('获取募集活动错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 创建募集活动
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const fundraisingData = await request.json();
    
    // 验证必需字段
    const requiredFields = ['tokenId', 'gameId', 'gameName', 'targetSOL', 'endDate'];
    for (const field of requiredFields) {
      if (!fundraisingData[field]) {
        return NextResponse.json(
          { error: `${field} 是必需的` },
          { status: 400 }
        );
      }
    }

    // 检查代币是否存在
    const token = await Token.findById(fundraisingData.tokenId);
    if (!token) {
      return NextResponse.json(
        { error: '代币不存在' },
        { status: 404 }
      );
    }

    // 检查是否已有活跃的募集活动
    const existingFundraising = await Fundraising.findOne({
      tokenId: fundraisingData.tokenId,
      status: 'active'
    });

    if (existingFundraising) {
      return NextResponse.json(
        { error: '该代币已有活跃的募集活动' },
        { status: 400 }
      );
    }

    // 计算代币分配
    const totalSupply = token.totalSupply;
    const presaleTokens = totalSupply * 0.5; // 50% for presale
    const pricePerToken = fundraisingData.targetSOL / presaleTokens;

    // 设置里程碑
    const milestones = [
      { percentage: 25, targetAmount: fundraisingData.targetSOL * 0.25, reached: false },
      { percentage: 50, targetAmount: fundraisingData.targetSOL * 0.5, reached: false },
      { percentage: 75, targetAmount: fundraisingData.targetSOL * 0.75, reached: false },
      { percentage: 100, targetAmount: fundraisingData.targetSOL, reached: false }
    ];

    const fundraising = new Fundraising({
      ...fundraisingData,
      startDate: new Date(),
      raisedSOL: 0,
      contributors: [],
      tokenAllocation: {
        presaleTokens,
        pricePerToken
      },
      milestones,
      refundPolicy: {
        enabled: true,
        conditions: [
          '如果募集目标未达到，将全额退款',
          '退款将在募集结束后7个工作日内处理',
          '退款将返回到原始贡献钱包地址'
        ]
      }
    });

    await fundraising.save();

    // 更新代币状态
    await Token.findByIdAndUpdate(fundraisingData.tokenId, {
      status: 'fundraising',
      'fundraising.targetSOL': fundraisingData.targetSOL,
      'fundraising.deadline': fundraisingData.endDate
    });

    return NextResponse.json({
      success: true,
      fundraising
    });

  } catch (error) {
    console.error('创建募集活动错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}