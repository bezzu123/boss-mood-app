import { useState, useEffect } from 'react'
import { Heart, Frown, Loader2, Unplug, Users, Crown } from 'lucide-react'
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
      Icon: Heart,
      bg: active ? 'bg-pink-600' : 'bg-white/5',
      border: active ? 'border-pink-400' : 'border-white/10',
      text: active ? 'text-white' : 'text-gray-400',
      glow: active ? 'shadow-[0_0_24px_rgba(236,72,153,0.5)]' : '',
    },
    bad: {
      Icon: Frown,
      bg: active ? 'bg-orange-600' : 'bg-white/5',
      border: active ? 'border-orange-400' : 'border-white/10',
      text: active ? 'text-white' : 'text-gray-400',
      glow: active ? 'shadow-[0_0_24px_rgba(234,88,12,0.5)]' : '',
    },
  }
  const { Icon, ...c } = configs[emoji]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-3xl border-2 transition-all duration-200 ${c.bg} ${c.border} ${c.text} ${c.glow} disabled:opacity-40 active:scale-95`}
    >
      <Icon size={44} strokeWidth={1.5} />
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
        <span className="flex items-center gap-1"><Heart size={12} /> {love} love</span>
        <span className="flex items-center gap-1">{bad} bad <Frown size={12} /></span>
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

const WEATHER = [
  {
    icon: '☀️',
    label: 'Sunny & Clear',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-400/30',
    text: 'text-yellow-300',
    vibe: 'Today is the day to ask for a budget increase, sign off on expenses, or ask for a vacation day.',
    versions: [
      '"ฟ้าเปิด ท้องฟ้าแจ่มใส ไหว้พระแล้วได้ผล"\nThe sky is open, weather is clear, praying to the holy spirits finally paid off.',
      '"อารมณ์ดีระดับพรีเมียม / บอสสวมร่างทอง"\nPremium mood level / Boss is in "Golden Form" mode.',
    ],
  },
  {
    icon: '🌤️',
    label: 'Partly Cloudy',
    bg: 'bg-sky-500/10',
    border: 'border-sky-400/30',
    text: 'text-sky-300',
    vibe: 'Approach with caution. Keep your updates short, sweet, and metric-backed. Do not test their patience.',
    versions: [
      '"ทรงดีแต่เริ่มมีทรงอย่างแบด / ลมเพลมพัด"\nLooking okay but starting to look bad / Whimsical as the wind.',
      '"สวดยอด... แต่สวดมนต์รอไว้ก่อนก็ดี"\nAwesome... but better start praying just in case.',
    ],
  },
  {
    icon: '⛈️',
    label: 'Thunderstorm Incoming',
    bg: 'bg-red-500/10',
    border: 'border-red-400/30',
    text: 'text-red-300',
    vibe: 'Put on your noise-canceling headphones, double-check your emails for typos, and nod gracefully to everything.',
    versions: [
      '"ตัวใครตัวมัน! บอสรวบรวมพลังทำลายล้าง"\nEvery man for himself! Boss is gathering destructive energy.',
      '"เข้าสู่โหมด \'งานเร่ง ด่วนที่สุด ยอดแย่\'"\nEntering \'Urgent, Most Urgent, Worst Ever\' mode.',
    ],
  },
]

const EMPTY_WEATHER = {
  icon: '🌫️',
  label: 'No Data Yet',
  bg: 'bg-white/5',
  border: 'border-white/10',
  text: 'text-gray-400',
  vibe: 'Absolute mystery. Tread lightly until the first cup of coffee has been consumed.',
  versions: [
    '"ช่วงวัดดวง / วันนี้หวยจะออกอะไร"\nThe betting period / What will today\'s lottery results look like?',
    '"บอสยังไม่ตื่นขึ้นมาเซ็ตระบบ"\nBoss hasn\'t woken up to boot up the system yet.',
  ],
}

function getWeather(love, bad) {
  const total = love + bad
  if (total === 0) return null
  const pct = love / total
  if (pct >= 0.65) return WEATHER[0]
  if (pct >= 0.40) return WEATHER[1]
  return WEATHER[2]
}

function WeatherWidget({ love, bad }) {
  const w = getWeather(love, bad) ?? EMPTY_WEATHER
  // pick randomly between the two desc variants, stable per render
  const variant = w.versions[Math.random() < 0.5 ? 0 : 1]

  return (
    <div className={`${w.bg} border ${w.border} rounded-3xl p-5 flex flex-col gap-3`}>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest text-center">Team Climate</p>

      <div className="flex items-center gap-4">
        <div className="text-6xl leading-none flex-shrink-0">{w.icon}</div>
        <p className={`font-bold text-lg leading-tight ${w.text}`}>{w.label}</p>
      </div>

      <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line">{variant}</p>

      <div className={`border-t ${w.border} pt-3`}>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">The Vibe</p>
        <p className="text-gray-400 text-xs leading-relaxed">{w.vibe}</p>
      </div>
    </div>
  )
}

// Boss view: see how team rated her + rate the team
function BossView({ allVotes, love, bad, bossVote, submitting, handleBossVote, user }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Crown size={18} className="text-yellow-400" strokeWidth={1.5} />
          <span className="text-yellow-400 text-sm font-semibold">Boss View</span>
        </div>
        <h1 className="text-xl font-bold text-white">{user.name}</h1>
      </div>

      <WeatherWidget love={love} bad={bad} />

      {/* Team's votes on boss — read only */}
      <div className="bg-white/5 rounded-3xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-400" strokeWidth={1.5} />
          <h2 className="font-bold text-white text-base">Team's vibe on you today</h2>
        </div>
        {allVotes.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-4">No votes yet today</p>
        ) : (
          <>
            <ScoreBar love={love} bad={bad} />
            <p className="text-xs text-gray-500 text-center">
              {allVotes.length} anonymous {allVotes.length === 1 ? 'vote' : 'votes'} today
            </p>
          </>
        )}
      </div>

      {/* Boss rates team */}
      <div className="bg-white/5 rounded-3xl p-5 flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-white text-base">Your verdict on the team</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {bossVote ? `You rated: ${bossVote.emoji === 'love' ? 'Love' : 'Not ok'} — tap to change` : 'How is the team today?'}
          </p>
        </div>
        <div className="flex gap-3">
          <VoteButton emoji="love" label="Good job" active={bossVote?.emoji === 'love'} disabled={submitting} onClick={() => handleBossVote('love')} />
          <VoteButton emoji="bad" label="Not ok" active={bossVote?.emoji === 'bad'} disabled={submitting} onClick={() => handleBossVote('bad')} />
        </div>
      </div>
    </div>
  )
}

// Team view: rate boss + see boss's verdict
function TeamView({ myVote, allVotes, love, bad, bossVote, submitting, handleTeamVote }) {
  return (
    <div className="flex flex-col gap-6">
      <WeatherWidget love={love} bad={bad} />

      {/* Rate boss */}
      <div className="bg-white/5 rounded-3xl p-5 flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-white text-base">How's the boss vibe today?</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {myVote ? `You voted: ${myVote.emoji === 'love' ? 'Love' : 'Bad'} — you can change it` : 'Cast your vote'}
          </p>
        </div>
        <div className="flex gap-3">
          <VoteButton emoji="love" label="Love it" active={myVote?.emoji === 'love'} disabled={submitting} onClick={() => handleTeamVote('love')} />
          <VoteButton emoji="bad" label="Not ok" active={myVote?.emoji === 'bad'} disabled={submitting} onClick={() => handleTeamVote('bad')} />
        </div>
        {allVotes.length > 0 && <ScoreBar love={love} bad={bad} />}
        {allVotes.length > 0 && (
          <p className="text-xs text-gray-500 text-center">
            {allVotes.length} {allVotes.length === 1 ? 'vote' : 'votes'} today
          </p>
        )}
      </div>

      {/* Boss verdict — read only */}
      <div className="bg-white/5 rounded-3xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Crown size={16} className="text-yellow-400" strokeWidth={1.5} />
          <h2 className="font-bold text-white text-base">Boss's verdict on the team</h2>
        </div>
        <div className="flex items-center justify-center py-4">
          {bossVote ? (
            <div className="text-center flex flex-col items-center gap-2">
              {bossVote.emoji === 'love'
                ? <Heart size={56} strokeWidth={1.5} className="text-pink-400" />
                : <Frown size={56} strokeWidth={1.5} className="text-orange-400" />}
              <p className="text-gray-400 text-sm">
                {bossVote.emoji === 'love' ? 'Boss loves the team today!' : 'Boss is not ok with the team today'}
              </p>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No verdict yet</p>
          )}
        </div>
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
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [mv, av, bv] = await Promise.all([
          getMyTeamVote(user.id, today),
          getTodayTeamVotes(today),
          getBossVote(today),
        ])
        setMyVote(mv)
        setAllVotes(av)
        setBossVote(bv)
      } catch (e) {
        setError(e.message || 'Failed to connect to database')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user.id, today])

  const handleTeamVote = async (emoji) => {
    setSubmitting(true)
    try {
      await submitTeamVote(user.id, today, emoji)
      const [mv, av] = await Promise.all([
        getMyTeamVote(user.id, today),
        getTodayTeamVotes(today),
      ])
      setMyVote(mv)
      setAllVotes(av)
    } catch (e) {
      alert('Could not save vote: ' + e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleBossVote = async (emoji) => {
    setSubmitting(true)
    try {
      await submitBossVote(today, emoji)
      const bv = await getBossVote(today)
      setBossVote(bv)
    } catch (e) {
      alert('Could not save vote: ' + e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const love = allVotes.filter((v) => v.emoji === 'love').length
  const bad = allVotes.filter((v) => v.emoji === 'bad').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={36} className="text-purple-400 animate-spin" strokeWidth={1.5} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 gap-4 text-center">
        <Unplug size={48} className="text-gray-500" strokeWidth={1.5} />
        <p className="text-white font-semibold">Firebase not connected</p>
        <p className="text-gray-400 text-sm">Make sure your <code className="text-purple-400 bg-white/10 px-1 rounded">.env</code> file has the correct Firebase config values, then restart the dev server.</p>
        <p className="text-red-400 text-xs bg-red-900/20 border border-red-500/20 rounded-xl px-4 py-2 break-all">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-2 bg-white/10 hover:bg-white/20 text-white text-sm px-5 py-2 rounded-xl transition-colors">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-2">
      <p className="text-gray-500 text-sm text-center mb-2">{dateLabel}</p>
      {isAdmin
        ? <BossView allVotes={allVotes} love={love} bad={bad} bossVote={bossVote} submitting={submitting} handleBossVote={handleBossVote} user={user} />
        : <TeamView myVote={myVote} allVotes={allVotes} love={love} bad={bad} bossVote={bossVote} submitting={submitting} handleTeamVote={handleTeamVote} />
      }
    </div>
  )
}
