import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

// 模擬用戶積分數據庫
const userCredits: { [key: string]: { credits: number; lastReset: string } } = {}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.email
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  
  // 檢查是否需要重置積分
  if (!userCredits[userId] || userCredits[userId].lastReset !== currentMonth) {
    userCredits[userId] = {
      credits: 1000,
      lastReset: currentMonth
    }
  }

  return NextResponse.json({ 
    credits: userCredits[userId].credits,
    maxCredits: 1000 
  })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { amount } = await request.json()
  const userId = session.user.email
  const currentMonth = new Date().toISOString().slice(0, 7)
  
  // 確保用戶數據存在
  if (!userCredits[userId] || userCredits[userId].lastReset !== currentMonth) {
    userCredits[userId] = {
      credits: 1000,
      lastReset: currentMonth
    }
  }

  // 檢查積分是否足夠
  if (userCredits[userId].credits < amount) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
  }

  // 扣除積分
  userCredits[userId].credits -= amount

  return NextResponse.json({ 
    credits: userCredits[userId].credits,
    maxCredits: 1000 
  })
}