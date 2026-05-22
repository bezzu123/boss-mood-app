import { useState, useEffect } from 'react'
import { useUser } from '../UserContext'
import { useToday } from '../useStore'
import {
  submitTeamVote,
  getMyTeamVote,
  getTodayTeamVotes,
  submitBossVote,
  getBossVote,
} from '../db'

function VoteButton({ emoji, label, active, onClick, disabled }) {
  const configs = {
    love: {
      icon: '❤️',
      bg: active ? 'bg-pink-600' : 'bg-white/5',
      border: active ? 'border-pink-400' : 'border-white/10',
      text: active ? 'text-white' : 'text-gray-400',
      glow: active ? 'shadow-[0_0_24px_rgba(236,72,153,0.5)]' : '',
    },
    bad: {
      icon: '💢',
      bg: active ? 'bg-red-700' : 'bg-white/5',
      border: active ? 'border-red-400' : 'border-white/10',
      text: active ? 'text-white' : 'text-gray-400',
      glow: active ? 'shadow-[0_0_24px_rgba(239,68,68,0.5)]' : '',
    },
  }
  const c = configs[emoji]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-3xl border-2 transition-all duration-200 ${c.bg} ${c.border} ${c.text} ${c.glow} disabled:opacity-40 active:scale-95`}
    >
      <span className="text-5xl">{c.icon}</span>
      <span className="font-semibold text-sm uppercase tracking-widest">{label}</span>
    </button>
  )
}

function ScoreBar({ love, bad }) {
  const total = love + bad
  const lovePct = total === 0 ? 50 : Math.round((love / total) * 100)
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>❤️ {love} love</span>
        <span>{bad} bad 💢</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all duration-500"
          style={{ width: `${lovePct}%` }}
        />
      </div>
    </div>
  )
}

export default function Home() {
  const { user, isAdmin } = useUser()
  const today = useToday()

  const [myVote, setMyVote] = useState(null)
  const [allVotes, setAllVotes] = useState([])
  const [bossVote, setBossVote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [mv, av, bv] = await Promise.all([
        getMyTeamVote(user.id, today),
        getTodayTeamVotes(today),
        getBossVote(today),
      ])
      setMyVote(mv)
      setAllVotes(av)
      setBossVote(bv)
      setLoading(false)
    }
    load()
  }, [user.id, today])

  const handleTeamVote = async (emoji) => {
    setSubmitting(true)
    await submitTeamVote(user.id, user.name, today, emoji)
    const [mv, av] = await Promise.all([
      getMyTeamVote(user.id, today),
      getTodayTeamVotes(today),
    ])
    setMyVote(mv)
    setAllVotes(av)
    setSubmitting(false)
  }

  const handleBossVote = async (emoji) => {
    setSubmitting(true)
    await submitBossVote(today, emoji)
    const bv = await getBossVote(today)
    setBossVote(bv)
    setSubmitting(false)
  }

  const love = allVotes.filter((v) => v.emoji === 'love').length
  const bad = allVotes.filter((v) => v.emoji === 'bad').length

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-4xl animate-pulse">✨</div>
      </div>
    )
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <div className="text-center">
        <p className="text-gray-500 text-sm">{dateLabel}</p>
        <h1 className="text-xl font-bold text-white mt-1">
          Hey, <span className="text-purple-400">{user.name}</span> 👋
        </h1>
      </div>

      {/* Team rates boss */}
      <div className="bg-white/5 rounded-3xl p-5 flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-white text-base">How's the boss vibe today?</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {myVote ? `You voted: ${myVote.emoji === 'love' ? '❤️ Love' : '💢 Bad'} — you can change it` : 'Cast your vote'}
          </p>
        </div>
        <div className="flex gap-3">
          <VoteButton
            emoji="love"
            label="Love it"
            active={myVote?.emoji === 'love'}
            disabled={submitting}
            onClick={() => handleTeamVote('love')}
          />
          <VoteButton
            emoji="bad"
            label="Not ok"
            active={myVote?.emoji === 'bad'}
            disabled={submitting}
            onClick={() => handleTeamVote('bad')}
          />
        </div>
        {allVotes.length > 0 && <ScoreBar love={love} bad={bad} />}
        {allVotes.length > 0 && (
          <p className="text-xs text-gray-500 text-center">
            {allVotes.length} {allVotes.length === 1 ? 'vote' : 'votes'} today
          </p>
        )}
      </div>

      {/* Boss rates team */}
      <div className="bg-white/5 rounded-3xl p-5 flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-white text-base">Boss's verdict on the team</h2>
          {isAdmin ? (
            <p className="text-gray-400 text-xs mt-0.5">
              {bossVote ? `You rated: ${bossVote.emoji === 'love' ? '❤️ Love' : '💢 Not ok'} — tap to change` : 'Rate the team today'}
            </p>
          ) : (
            <p className="text-gray-400 text-xs mt-0.5">Only the boss can rate here</p>
          )}
        </div>

        {isAdmin ? (
          <div className="flex gap-3">
            <VoteButton
              emoji="love"
              label="Good job"
              active={bossVote?.emoji === 'love'}
              disabled={submitting}
              onClick={() => handleBossVote('love')}
            />
            <VoteButton
              emoji="bad"
              label="Not ok"
              active={bossVote?.emoji === 'bad'}
              disabled={submitting}
              onClick={() => handleBossVote('bad')}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-4">
            {bossVote ? (
              <div className="text-center">
                <div className="text-6xl">{bossVote.emoji === 'love' ? '❤️' : '💢'}</div>
                <p className="text-gray-400 text-sm mt-2">
                  {bossVote.emoji === 'love' ? 'Boss loves the team today!' : 'Boss is not ok with team today'}
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No verdict yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
