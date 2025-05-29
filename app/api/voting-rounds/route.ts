import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VotingRound from '@/models/VotingRound'

// 获取投票轮次列表
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    
    const query: any = {}
    if (status !== 'all') {
      query.status = status
    }
    
    const rounds = await VotingRound.find(query).sort({ roundNumber: -1 })
    
    return NextResponse.json({
      success: true,
      rounds
    })
    
  } catch (error) {
    console.error('获取投票轮次错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 创建新投票轮次
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const roundData = await request.json()
    
    const round = new VotingRound(roundData)
    await round.save()
    
    return NextResponse.json({
      success: true,
      round
    })
    
  } catch (error) {
    console.error('创建投票轮次错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 