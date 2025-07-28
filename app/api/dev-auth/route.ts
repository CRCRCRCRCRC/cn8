import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { testCode } = await request.json()
  
  if (testCode === 'howard is a pig') {
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ error: 'Invalid test code' }, { status: 400 })
}