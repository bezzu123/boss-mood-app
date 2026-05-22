import { useState } from 'react'
import { useUser } from '../useStore'

export default function Settings() {
  const { user, isAdmin, saveUser, tryAdminLogin, logoutAdmin } = useUser()
  const [newName, setNewName] = useState(user?.name || '')
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)

  const handleSaveName = (e) => {
    e.preventDefault()
    if (newName.trim().length < 2) return
    saveUser(newName.trim())
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2000)
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    const ok = tryAdminLogin(pin)
    if (!ok) {
      setPinError(true)
      setTimeout(() => setPinError(false), 2000)
    }
    setPin('')
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-white text-center">Settings ⚙️</h1>

      {/* Change name */}
      <div className="bg-white/5 rounded-3xl p-5 flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-white text-base">Your name</h2>
          <p className="text-gray-400 text-xs mt-0.5">Change your funny name anytime</p>
        </div>
        <form onSubmit={handleSaveName} className="flex flex-col gap-3">
          <input
            className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={30}
          />
          <button
            type="submit"
            disabled={newName.trim().length < 2}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold py-2.5 rounded-2xl transition-colors"
          >
            {nameSaved ? '✅ Saved!' : 'Save name'}
          </button>
        </form>
      </div>

      {/* Admin section */}
      <div className="bg-white/5 rounded-3xl p-5 flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-white text-base">Boss mode 👑</h2>
          {isAdmin ? (
            <p className="text-green-400 text-xs mt-0.5">✅ You are in boss mode</p>
          ) : (
            <p className="text-gray-400 text-xs mt-0.5">Enter the PIN to unlock boss powers</p>
          )}
        </div>

        {isAdmin ? (
          <button
            onClick={logoutAdmin}
            className="bg-red-700/40 hover:bg-red-700/60 border border-red-500/30 text-red-300 font-semibold py-2.5 rounded-2xl transition-colors"
          >
            Exit boss mode
          </button>
        ) : (
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-3">
            <input
              type="password"
              inputMode="numeric"
              className={`bg-white/10 border rounded-2xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                pinError ? 'border-red-400' : 'border-white/20 focus:border-purple-400'
              }`}
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={10}
            />
            {pinError && <p className="text-red-400 text-xs text-center">Wrong PIN, try again</p>}
            <button
              type="submit"
              disabled={!pin}
              className="bg-yellow-600/40 hover:bg-yellow-600/60 border border-yellow-500/30 disabled:opacity-40 text-yellow-200 font-semibold py-2.5 rounded-2xl transition-colors"
            >
              Unlock 👑
            </button>
          </form>
        )}
      </div>

      <p className="text-xs text-gray-600 text-center">v1.0 — Boss Mood Tracker</p>
    </div>
  )
}
