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
    
    // 不使用官方按鈕，直接創建 cyber 風格按鈕
    createCyberGoogleButton(element)
    
    console.log('Google button rendered successfully')
    
  } catch (error) {
    console.error('Failed to render Google button:', error)
    createCyberGoogleButton(element)
  }
}

// 創建 cyber 風格的 Google 登入按鈕
function createCyberGoogleButton(element: HTMLElement) {
  console.log('Creating cyber Google button...')
  
  element.innerHTML = `
    <button 
      id="cyber-google-signin"
      class="bg-gradient-to-r from-cyber-primary to-cyber-secondary text-cyber-dark px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-cyber-primary/50 transition-all duration-300 w-full flex items-center justify-center space-x-3"
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span>使用 Google 登入</span>
    </button>
  `
  
  const button = element.querySelector('#cyber-google-signin') as HTMLButtonElement
  if (button) {
    console.log('Button found, adding click listener...')
    
    // 移除任何現有的事件監聽器
    const newButton = button.cloneNode(true) as HTMLButtonElement
    button.parentNode?.replaceChild(newButton, button)
    
    newButton.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      console.log('Cyber Google sign-in button clicked!')
      console.log('Google available:', !!window.google)
      console.log('Google accounts:', !!window.google?.accounts)
      console.log('Google ID:', !!window.google?.accounts?.id)
      
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        console.error('Google Identity Services not available')
        alert('Google 登入服務未載入，請重新整理頁面')
        return
      }
      
      try {
        console.log('嘗試 Google prompt...')
        window.google.accounts.id.prompt((notification: any) => {
          console.log('Google prompt notification:', notification)
          
          // 如果 prompt 無法顯示，自動點擊隱藏按鈕
          if (notification.isNotDisplayed && notification.isNotDisplayed()) {
            console.log('Prompt 未顯示，使用自動點擊方式...')
            triggerGoogleLogin()
          } else if (notification.isSkippedMoment && notification.isSkippedMoment()) {
            console.log('Prompt 被跳過，使用自動點擊方式...')
            triggerGoogleLogin()
          } else if (notification.isDismissedMoment && notification.isDismissedMoment()) {
            console.log('用戶關閉了 prompt')
          }
        })
      } catch (promptError) {
        console.error('Prompt 失敗，使用自動點擊方式:', promptError)
        triggerGoogleLogin()
      }
    })
    
    console.log('Click listener added successfully')
  } else {
    console.error('Button not found after creation')
  }
}

// 直接觸發 Google 登入
function triggerGoogleLogin() {
  console.log('觸發 Google 登入...')
  
  if (!GOOGLE_CLIENT_ID) {
    console.error('Google Client ID not configured')
    return
  }
  
  // 創建一個隱藏的官方 Google 按鈕並自動點擊
  const tempContainer = document.createElement('div')
  tempContainer.style.position = 'absolute'
  tempContainer.style.left = '-9999px'
  tempContainer.style.top = '-9999px'
  tempContainer.style.visibility = 'hidden'
  document.body.appendChild(tempContainer)
  
  try {
    // 渲染官方 Google 按鈕
    window.google.accounts.id.renderButton(tempContainer, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with'
    })
    
    // 等待按鈕渲染完成後自動點擊
    setTimeout(() => {
      const googleButton = tempContainer.querySelector('div[role="button"]') as HTMLElement
      if (googleButton) {
        console.log('自動點擊 Google 登入按鈕...')
        googleButton.click()
      } else {
        console.error('找不到 Google 登入按鈕')
      }
      
      // 清理臨時元素
      setTimeout(() => {
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer)
        }
      }, 1000)
    }, 200)
    
  } catch (error) {
    console.error('Failed to create Google button:', error)
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer)
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
          prompt: (callback?: (notification: any) => void) => void
        }
      }
    }
  }
}