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
    
    // 渲染自定義樣式的 Google 按鈕
    window.google.accounts.id.renderButton(element, {
      theme: 'filled_blue',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      logo_alignment: 'left',
      width: element.offsetWidth || 300,
      height: 56
    })
    
    console.log('Google button rendered successfully')
    
  } catch (error) {
    console.error('Failed to render Google button:', error)
    
    // 如果官方按鈕渲染失敗，創建美觀的自定義按鈕
    element.innerHTML = `
      <button 
        id="manual-google-signin"
        class="google-signin-custom"
        style="
          width: 100%;
          height: 56px;
          background: linear-gradient(135deg, #4285f4 0%, #34a853 50%, #fbbc05 75%, #ea4335 100%);
          border: none;
          border-radius: 28px;
          color: white;
          font-family: 'Google Sans', 'Segoe UI', Roboto, sans-serif;
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
          position: relative;
          overflow: hidden;
        "
        onmouseover="
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 8px 20px rgba(66, 133, 244, 0.4)';
        "
        onmouseout="
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)';
        "
        onmousedown="this.style.transform = 'translateY(0) scale(0.98)'"
        onmouseup="this.style.transform = 'translateY(-2px) scale(1)'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));">
          <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span style="text-shadow: 0 1px 2px rgba(0,0,0,0.1);">使用 Google 登入</span>
        <div style="
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        " class="shine-effect"></div>
      </button>
      <style>
        .google-signin-custom:hover .shine-effect {
          left: 100%;
        }
      </style>
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