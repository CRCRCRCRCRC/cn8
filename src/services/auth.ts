// 真實 Google OAuth 服務

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET

interface GoogleUser {
  id: string
  name: string
  email: string
  picture: string
}

interface GoogleAuthResponse {
  credential: string
}

// 初始化 Google OAuth
export function initGoogleAuth(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_CLIENT_ID) {
      reject(new Error('GOOGLE_CLIENT_ID not configured'))
      return
    }

    // 動態載入 Google Identity Services
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      })
      resolve()
    }
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
    document.head.appendChild(script)
  })
}

// 處理 Google 登入回應
function handleGoogleResponse(response: GoogleAuthResponse) {
  try {
    // 解析 JWT token
    const payload = parseJWT(response.credential)
    const user: GoogleUser = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    }
    
    // 觸發登入事件
    window.dispatchEvent(new CustomEvent('googleLogin', { detail: user }))
  } catch (error) {
    console.error('Failed to parse Google response:', error)
    window.dispatchEvent(new CustomEvent('googleLoginError', { detail: error }))
  }
}

// 解析 JWT token
function parseJWT(token: string) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  return JSON.parse(jsonPayload)
}

// 顯示 Google 登入按鈕
export function renderGoogleSignInButton(element: HTMLElement) {
  if (!window.google) {
    throw new Error('Google Identity Services not loaded')
  }
  
  window.google.accounts.id.renderButton(element, {
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    shape: 'rectangular',
    logo_alignment: 'left',
    width: '100%'
  })
}

// 登出
export function signOut() {
  if (window.google) {
    window.google.accounts.id.disableAutoSelect()
  }
  
  // 清除本地存儲
  localStorage.removeItem('user')
  localStorage.removeItem('userCredits')
  
  // 觸發登出事件
  window.dispatchEvent(new CustomEvent('googleLogout'))
}

// 擴展 Window 介面
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, config: any) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}