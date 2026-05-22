import { useState } from 'react'
import { Crown, Check, LogOut, KeyRound, Loader2, User } from 'lucide-react'
import { useUser } from '../UserContext'
import { getBossPin, setBossPin } from '../db'

// eslint-disable-next-line no-unused-vars

function BossSettings({ logout }) {
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [status, setStatus] = useState(null) // 'saving' | 'success' | 'wrong' | 'mismatch'

  const handleChangePin = async (e) => {
    e.preventDefault()
    if (newPin !== confirmPin) { setStatus('mismatch'); return }
    if (newPin.length < 4) { setStatus('short'); return }
    setStatus('saving')
    try {
      const correct = await getBossPin()
      if (currentPin !== correct) { setStatus('wrong'); return }
      await setBossPin(newPin)
      setStatus('success')
      setCurrentPin(''); setNewPin(''); setConfirmPin('')
      setTimeout(() => setStatus(null), 3000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <div className="flex items-center justify-center gap-2">
        <Crown size={18} className="text-yellow-400" strokeWidth={1.5} />
        <h1 className="text-xl font-bold text-white">Boss Settings</h1>
      </div>

      {/* Change PIN */}
      <div className="bg-white/5 rounded-3xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <KeyRound size={16} className="text-gray-400" strokeWidth={1.5} />
          <h2 className="font-bold text-white text-base">Change PIN</h2>
        </div>
        <form onSubmit={handleChangePin} className="flex flex-col gap-3">
          <input
            type="password"
            inputMode="numeric"
            className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            placeholder="Current PIN"
            value={currentPin}
            onChange={(e) => { setCurrentPin(e.target.value); setStatus(null) }}
            maxLength={10}
          />
          <input
            type="password"
            inputMode="numeric"
            className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            placeholder="New PIN (min 4 digits)"
            value={newPin}
            onChange={(e) => { setNewPin(e.target.value); setStatus(null) }}
            maxLength={10}
          />
          <input
            type="password"
            inputMode="numeric"
            className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
            placeholder="Confirm new PIN"
            value={confirmPin}
            onChange={(e) => { setConfirmPin(e.target.value); setStatus(null) }}
            maxLength={10}
          />

          {status === 'wrong' && <p className="text-red-400 text-xs text-center">Current PIN is incorrect</p>}
          {status === 'mismatch' && <p className="text-red-400 text-xs text-center">New PINs do not match</p>}
          {status === 'short' && <p className="text-red-400 text-xs text-center">PIN must be at least 4 digits</p>}
          {status === 'success' && <p className="text-green-400 text-xs text-center flex items-center justify-center gap-1"><Check size={12} /> PIN changed successfully</p>}
          {status === 'error' && <p className="text-red-400 text-xs text-center">Something went wrong, try again</p>}

          <button
            type="submit"
            disabled={!currentPin || !newPin || !confirmPin || status === 'saving'}
            className="bg-yellow-600/40 hover:bg-yellow-600/60 border border-yellow-500/30 disabled:opacity-40 text-yellow-200 font-semibold py-2.5 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            {status === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} strokeWidth={1.5} />}
            Save new PIN
          </button>
        </form>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="bg-red-700/30 hover:bg-red-700/50 border border-red-500/30 text-red-300 font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={16} strokeWidth={1.5} /> Sign out
      </button>

      <p className="text-xs text-gray-600 text-center">v1.0 — Boss Mood Tracker</p>
    </div>
  )
}

function EmployeeSettings({ logout }) {
  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <div className="flex items-center justify-center gap-2">
        <User size={18} className="text-purple-400" strokeWidth={1.5} />
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>

      <button
        onClick={logout}
        className="bg-red-700/30 hover:bg-red-700/50 border border-red-500/30 text-red-300 font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={16} strokeWidth={1.5} /> Sign out
      </button>

      <p className="text-xs text-gray-600 text-center">v1.0 — Boss Mood Tracker</p>
    </div>
  )
}

export default function Settings() {
  const { isAdmin, user, saveEmployeeName, logout } = useUser()

  if (isAdmin) return <BossSettings logout={logout} />
  return <EmployeeSettings logout={logout} />
}
