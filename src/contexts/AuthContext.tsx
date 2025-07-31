import React, { createContext, useContext, useState, useEffect } from 'react'
import { initGoogleAuth, signOut } from '../services/auth'
import { getUserCredits, useCredits as useCreditsService, logCreditUsage } from '../services/credits'

interface User {
  id: string
  name: string
  email: string
  picture: string
}

interface UserCredits {
  credits: number
  maxCredits: number
  lastReset: string
  userId: string
}

interface AuthContextType {
  user: User | null
  isDevMode: boolean
  userCredits: UserCredits | null
  login: (userData: User) => void
  logout: () => void
  enableDevMode: () => void
  useCredits: (amount: number, description: string) => boolean
  initAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isDevMode, setIsDevMode] = useState(false)
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null)

  useEffect(() => {
    // 檢查開發模式
    const devMode = localStorage.getItem('devMode') === 'true'
    setIsDevMode(devMode)
    
    // 檢查已登入用戶
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      // 載入用戶積分
      const credits = getUserCredits(userData.id)
      setUserCredits(credits)
    }

    // 監聽 Google 登入事件
    const handleGoogleLogin = (event: CustomEvent) => {
      const userData = event.detail as User
      login(userData)
    }

    const handleGoogleLogout = () => {
      logout()
    }

    const handleCreditsUpdated = (event: CustomEvent) => {
      setUserCredits(event.detail)
    }

    window.addEventListener('googleLogin', handleGoogleLogin as EventListener)
    window.addEventListener('googleLogout', handleGoogleLogout)
    window.addEventListener('creditsUpdated', handleCreditsUpdated as EventListener)

    return () => {
      window.removeEventListener('googleLogin', handleGoogleLogin as EventListener)
      window.removeEventListener('googleLogout', handleGoogleLogout)
      window.removeEventListener('creditsUpdated', handleCreditsUpdated as EventListener)
    }
  }, [])

  const initAuth = async () => {
    try {
      await initGoogleAuth()
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error)
    }
  }

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // 載入用戶積分
    const credits = getUserCredits(userData.id)
    setUserCredits(credits)
  }

  const logout = () => {
    setUser(null)
    setUserCredits(null)
    signOut()
  }

  const enableDevMode = () => {
    setIsDevMode(true)
    localStorage.setItem('devMode', 'true')
  }

  const useCredits = (amount: number, description: string): boolean => {
    if (isDevMode) return true // 開發模式無限積分
    
    if (!user) return false
    
    const success = useCreditsService(user.id, amount)
    if (success) {
      logCreditUsage(user.id, amount, description)
    }
    return success
  }

  return (
    <AuthContext.Provider value={{
      user,
      isDevMode,
      userCredits,
      login,
      logout,
      enableDevMode,
      useCredits,
      initAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}