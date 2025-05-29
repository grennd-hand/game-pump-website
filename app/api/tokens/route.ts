import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Token from '@/models/Token';
import User from '@/models/User';

// 获取代币列表
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'votes';
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;
    
    // 构建查询条件
    const query: any = {};
    if (status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { symbol: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const tokens = await Token.find(query)
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Token.countDocuments(query);

    return NextResponse.json({
      success: true,
      tokens,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('获取代币列表错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 创建新代币
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const tokenData = await request.json();
    
    // 验证必需字段
    const requiredFields = ['name', 'symbol', 'description', 'image', 'creator', 'totalSupply'];
    for (const field of requiredFields) {
      if (!tokenData[field]) {
        return NextResponse.json(
          { error: `${field} 是必需的` },
          { status: 400 }
        );
      }
    }

    // 检查符号是否已存在
    const existingToken = await Token.findOne({ symbol: tokenData.symbol.toUpperCase() });
    if (existingToken) {
      return NextResponse.json(
        { error: '代币符号已存在' },
        { status: 400 }
      );
    }

    // 创建新代币
    const token = new Token({
      ...tokenData,
      symbol: tokenData.symbol.toUpperCase(),
      votes: 0,
      voters: [],
      status: 'pending',
      currentPrice: 0,
      marketCap: 0,
      volume24h: 0,
      priceChange24h: 0,
      isVerified: false
    });

    await token.save();

    // 更新创建者的代币数量
    await User.findOneAndUpdate(
      { walletAddress: tokenData.creator },
      { $inc: { totalTokens: 1 } }
    );

    return NextResponse.json({
      success: true,
      token
    });

  } catch (error) {
    console.error('创建代币错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}