import { createContext, useContext, useState } from 'react'

// Screens: 'landing' | 'boss-pin' | 'employee-name' | 'app'
// Roles: null | 'boss' | 'employee'

const USER_KEY = 'bmt_user'
const ROLE_KEY = 'bmt_role'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY) || null)

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null } catch { return null }
  })

  // Derive which screen to show
  const getScreen = () => {
    if (!role) return 'landing'
    if (role === 'boss' && user) return 'app'
    if (role === 'boss' && !user) return 'boss-pin'
    if (role === 'employee' && user) return 'app'
    if (role === 'employee' && !user) return 'employee-name'
    return 'landing'
  }

  const screen = getScreen()

  const chooseBoss = () => {
    setRole('boss')
    localStorage.setItem(ROLE_KEY, 'boss')
  }

  const chooseEmployee = () => {
    setRole('employee')
    localStorage.setItem(ROLE_KEY, 'employee')
  }

  const loginBoss = () => {
    const u = { id: 'boss', name: 'Boss' }
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
  }

  const saveEmployeeName = (name) => {
    const existing = (() => { try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null } })()
    const id = existing?.id ?? crypto.randomUUID()
    const u = { id, name }
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem(ROLE_KEY)
    localStorage.removeItem(USER_KEY)
    setRole(null)
    setUser(null)
  }

  const isAdmin = role === 'boss'

  return (
    <UserContext.Provider value={{
      screen, role, user, isAdmin,
      chooseBoss, chooseEmployee, loginBoss, saveEmployeeName, logout,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
