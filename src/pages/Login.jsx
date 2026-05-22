import { Crown, User } from 'lucide-react'
import { useUser } from '../UserContext'

export default function Login() {
  const { chooseBoss, chooseEmployee } = useUser()

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 gap-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Mood Tracker</h1>
        <p className="text-gray-400 text-sm">Daily vibe check for the team</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={chooseBoss}
          className="flex items-center gap-4 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-3xl px-6 py-5 transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <Crown size={24} strokeWidth={1.5} className="text-yellow-400" />
          </div>
          <div className="text-left">
            <p className="font-bold text-white">I'm the Boss</p>
            <p className="text-xs text-gray-400 mt-0.5">Requires PIN to enter</p>
          </div>
        </button>

        <button
          onClick={chooseEmployee}
          className="flex items-center gap-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-3xl px-6 py-5 transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <User size={24} strokeWidth={1.5} className="text-purple-400" />
          </div>
          <div className="text-left">
            <p className="font-bold text-white">I'm an Employee</p>
            <p className="text-xs text-gray-400 mt-0.5">Pick a name and vote</p>
          </div>
        </button>
      </div>
    </div>
  )
}
