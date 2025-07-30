import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface AuthContextType {
  user: User | null
  isDevMode: boolean
  credits: number
  login: (userData: User) => void
  logout: () => void
  enableDevMode: () => void
  useCredits: (amount: number) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isDevMode, setIsDevMode] = useState(false)
  const [credits, setCredits] = useState(1000)

  useEffect(() => {
    // 檢查開發模式
    const devMode = localStorage.getItem('devMode') === 'true'
    setIsDevMode(devMode)
    
    // 檢查已登入用戶
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    // 檢查積分
    const savedCredits = localStorage.getItem('credits')
    if (savedCredits) {
      setCredits(parseInt(savedCredits))
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const enableDevMode = () => {
    setIsDevMode(true)
    localStorage.setItem('devMode', 'true')
  }

  const useCredits = (amount: number): boolean => {
    if (isDevMode) return true // 開發模式無限積分
    
    if (credits >= amount) {
      const newCredits = credits - amount
      setCredits(newCredits)
      localStorage.setItem('credits', newCredits.toString())
      return true
    }
    return false
  }

  return (
    <AuthContext.Provider value={{
      user,
      isDevMode,
      credits,
      login,
      logout,
      enableDevMode,
      useCredits
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