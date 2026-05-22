import { createContext, useContext, useState } from 'react'

const ADMIN_PIN = '12345'
const USER_KEY = 'bmt_user'
const ADMIN_KEY = 'bmt_is_admin'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null
    } catch {
      return null
    }
  })

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem(ADMIN_KEY) === 'true'
  })

  const saveUser = (name) => {
    const id = user?.id ?? crypto.randomUUID()
    const u = { id, name }
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
  }

  const tryAdminLogin = (pin) => {
    if (pin === ADMIN_PIN) {
      localStorage.setItem(ADMIN_KEY, 'true')
      setIsAdmin(true)
      return true
    }
    return false
  }

  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_KEY)
    setIsAdmin(false)
  }

  return (
    <UserContext.Provider value={{ user, isAdmin, saveUser, tryAdminLogin, logoutAdmin }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
