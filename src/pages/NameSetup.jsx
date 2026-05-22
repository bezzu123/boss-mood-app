import { useState } from 'react'
import { Smile } from 'lucide-react'
import { useUser } from '../UserContext'

export default function NameSetup() {
  const { saveUser } = useUser()
  const [name, setName] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) return
    saveUser(trimmed)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 gap-8">
      <div className="text-center">
        <Smile size={72} strokeWidth={1} className="text-purple-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Pick your name</h1>
        <p className="text-gray-400 text-sm">Choose something fun — it'll stick with you</p>
      </div>

      <form onSubmit={submit} className="w-full max-w-xs flex flex-col gap-4">
        <input
          className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white text-center text-lg placeholder-gray-500 focus:outline-none focus:border-purple-400"
          placeholder="e.g. ChaosGremlin"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          autoFocus
        />
        <button
          type="submit"
          disabled={name.trim().length < 2}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-2xl transition-colors"
        >
          Let's go
        </button>
      </form>
    </div>
  )
}
