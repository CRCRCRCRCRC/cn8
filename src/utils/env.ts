// 環境變數檢查工具
export const ENV_CONFIG = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV
}

// 檢查必要的環境變數
export function validateEnvironment(): { isValid: boolean; missing: string[] } {
  const required = ['GOOGLE_CLIENT_ID', 'OPENAI_API_KEY']
  const missing: string[] = []
  
  for (const key of required) {
    if (!ENV_CONFIG[key as keyof typeof ENV_CONFIG]) {
      missing.push(`VITE_${key}`)
    }
  }
  
  return {
    isValid: missing.length === 0,
    missing
  }
}

// 安全的日誌輸出
export function safeLog(message: string, data?: any) {
  if (ENV_CONFIG.IS_DEVELOPMENT) {
    console.log(message, data)
  }
}

export function safeError(message: string, error?: any) {
  if (ENV_CONFIG.IS_DEVELOPMENT) {
    console.error(message, error)
  } else {
    // 生產環境只記錄錯誤，不輸出詳細信息
    console.error(message)
  }
}

export function safeWarn(message: string, data?: any) {
  if (ENV_CONFIG.IS_DEVELOPMENT) {
    console.warn(message, data)
  }
}