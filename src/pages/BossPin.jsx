import { useState } from 'react'
import { Crown, Loader2, ArrowLeft } from 'lucide-react'
import { useUser } from '../UserContext'
import { getBossPin } from '../db'

export default function BossPin() {
  const { loginBoss, logout } = useUser()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const correct = await getBossPin()
      if (pin === correct) {
        loginBoss()
      } else {
        setError(true)
        setPin('')
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 gap-8">
      <button onClick={logout} className="absolute top-6 left-6 text-gray-500 hover:text-gray-300 flex items-center gap-1 text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
          <Crown size={40} strokeWidth={1.5} className="text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Boss Login</h1>
        <p className="text-gray-400 text-sm">Enter your PIN to continue</p>
      </div>

      <form onSubmit={submit} className="w-full max-w-xs flex flex-col gap-4">
        <input
          type="password"
          inputMode="numeric"
          className={`w-full bg-white/10 border rounded-2xl px-4 py-3 text-white text-center text-2xl tracking-widest placeholder-gray-600 focus:outline-none transition-colors ${
            error ? 'border-red-400' : 'border-white/20 focus:border-yellow-400'
          }`}
          placeholder="• • • • •"
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(false) }}
          maxLength={10}
          autoFocus
        />
        {error && <p className="text-red-400 text-xs text-center">Wrong PIN — try again</p>}
        <button
          type="submit"
          disabled={!pin || loading}
          className="w-full bg-yellow-600/50 hover:bg-yellow-600/70 border border-yellow-500/40 disabled:opacity-40 text-yellow-100 font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Crown size={18} strokeWidth={1.5} />}
          Enter
        </button>
      </form>
    </div>
  )
}
