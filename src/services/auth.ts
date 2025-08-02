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
      console.error('GOOGLE_CLIENT_ID not configured')
      reject(new Error('GOOGLE_CLIENT_ID not configured'))
      return
    }

    console.log('Initializing Google Auth with Client ID:', GOOGLE_CLIENT_ID)

    // 等待 Google Identity Services 載入
    const checkGoogle = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          console.log('Google Identity Services detected, initializing...')
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false
          })
          console.log('Google Auth initialized successfully')
          resolve()
        } catch (error) {
          console.error('Failed to initialize Google Auth:', error)
          reject(error)
        }
      } else {
        console.log('Waiting for Google Identity Services...')
        setTimeout(checkGoogle, 500)
      }
    }

    // 開始檢查
    checkGoogle()

    // 設置超時
    setTimeout(() => {
      reject(new Error('Google Identity Services load timeout'))
    }, 10000)
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
  console.log('Rendering Google Sign-In button...')
  
  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    console.error('Google Identity Services not available')
    element.innerHTML = '<div class="text-red-500 p-4">Google 登入服務載入失敗，請重新整理頁面</div>'
    return
  }

  try {
    console.log('Rendering official Google button...')
    
    // 清空容器
    element.innerHTML = ''
    
    // 渲染官方 Google 按鈕
    window.google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: element.offsetWidth || 300,
      height: 50
    })
    
    console.log('Google button rendered successfully')
    
  } catch (error) {
    console.error('Failed to render Google button:', error)
    
    // 如果官方按鈕渲染失敗，創建手動觸發按鈕
    element.innerHTML = `
      <button 
        id="manual-google-signin"
        style="
          width: 100%;
          height: 50px;
          background: white;
          border: 1px solid #dadce0;
          border-radius: 4px;
          color: #3c4043;
          font-family: 'Google Sans', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
        "
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        使用 Google 登入
      </button>
    `
    
    const button = element.querySelector('#manual-google-signin')
    if (button) {
      button.addEventListener('click', () => {
        console.log('Manual Google sign-in triggered')
        try {
          window.google.accounts.id.prompt()
        } catch (promptError) {
          console.error('Failed to show Google prompt:', promptError)
        }
      })
    }
  }
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
          prompt: () => void
        }
      }
    }
  }
}