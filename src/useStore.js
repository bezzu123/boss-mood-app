import { useState, useEffect } from 'react'

const USER_KEY = 'bmt_user'
const ADMIN_KEY = 'bmt_is_admin'
const ADMIN_PIN = '12345'

export function useUser() {
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
    const id = localStorage.getItem(USER_KEY)
      ? JSON.parse(localStorage.getItem(USER_KEY)).id
      : crypto.randomUUID()
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

  return { user, isAdmin, saveUser, tryAdminLogin, logoutAdmin }
}

export function useToday() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
