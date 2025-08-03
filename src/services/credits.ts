// 真實積分系統服務

interface UserCredits {
  credits: number
  maxCredits: number
  lastReset: string
  userId: string
}

const CREDITS_STORAGE_KEY = 'userCredits'
const MONTHLY_CREDITS = 1000

// 獲取用戶積分
export function getUserCredits(userId: string): UserCredits {
  const storageKey = `${CREDITS_STORAGE_KEY}_${userId}` // 每個用戶獨立的積分記錄
  const stored = localStorage.getItem(storageKey)
  const currentMonth = getCurrentMonth()
  
  if (stored) {
    const data: UserCredits = JSON.parse(stored)
    
    // 檢查是否需要重置積分（新月份）
    if (data.userId === userId && data.lastReset === currentMonth) {
      return data
    }
    
    // 如果是新月份，重置積分
    if (data.userId === userId && data.lastReset !== currentMonth) {
      const resetCredits: UserCredits = {
        credits: MONTHLY_CREDITS,
        maxCredits: MONTHLY_CREDITS,
        lastReset: currentMonth,
        userId: userId
      }
      localStorage.setItem(storageKey, JSON.stringify(resetCredits))
      return resetCredits
    }
  }
  
  // 創建新用戶的積分記錄
  const newCredits: UserCredits = {
    credits: MONTHLY_CREDITS,
    maxCredits: MONTHLY_CREDITS,
    lastReset: currentMonth,
    userId: userId
  }
  
  localStorage.setItem(storageKey, JSON.stringify(newCredits))
  return newCredits
}

// 使用積分
export function useCredits(userId: string, amount: number): boolean {
  const storageKey = `${CREDITS_STORAGE_KEY}_${userId}`
  const userCredits = getUserCredits(userId)
  
  if (userCredits.credits >= amount) {
    userCredits.credits -= amount
    localStorage.setItem(storageKey, JSON.stringify(userCredits))
    
    // 觸發積分更新事件
    window.dispatchEvent(new CustomEvent('creditsUpdated', { 
      detail: userCredits 
    }))
    
    return true
  }
  
  return false
}

// 獲取當前月份字串 (YYYY-MM)
function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// 檢查積分是否足夠
export function hasEnoughCredits(userId: string, amount: number): boolean {
  const userCredits = getUserCredits(userId)
  return userCredits.credits >= amount
}

// 重置積分（測試用）
export function resetCredits(userId: string): UserCredits {
  const newCredits: UserCredits = {
    credits: MONTHLY_CREDITS,
    maxCredits: MONTHLY_CREDITS,
    lastReset: getCurrentMonth(),
    userId: userId
  }
  
  localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(newCredits))
  
  // 觸發積分更新事件
  window.dispatchEvent(new CustomEvent('creditsUpdated', { 
    detail: newCredits 
  }))
  
  return newCredits
}

// 獲取積分歷史（可擴展功能）
export function getCreditHistory(userId: string): any[] {
  const historyKey = `creditHistory_${userId}`
  const stored = localStorage.getItem(historyKey)
  return stored ? JSON.parse(stored) : []
}

// 記錄積分使用
export function logCreditUsage(userId: string, amount: number, description: string) {
  const historyKey = `creditHistory_${userId}`
  const history = getCreditHistory(userId)
  
  const entry = {
    timestamp: new Date().toISOString(),
    amount: -amount,
    description: description,
    balance: getUserCredits(userId).credits
  }
  
  history.unshift(entry) // 最新的在前面
  
  // 只保留最近 100 筆記錄
  if (history.length > 100) {
    history.splice(100)
  }
  
  localStorage.setItem(historyKey, JSON.stringify(history))
}