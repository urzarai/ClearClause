import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cc_token'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cc_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (tokenValue, userData) => {
    localStorage.setItem('cc_token', tokenValue)
    localStorage.setItem('cc_user', JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('cc_token')
    localStorage.removeItem('cc_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}