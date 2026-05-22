import { useState, useEffect } from 'react'
import { getTrend } from '../db'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'

function BossEmoji({ emoji }) {
  if (!emoji) return <span className="text-gray-600">—</span>
  return <span>{emoji === 'love' ? '❤️' : '💢'}</span>
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrend(10).then((data) => {
      setTrend(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-4xl animate-pulse">📊</div>
      </div>
    )
  }

  const totalLove = trend.reduce((s, d) => s + d.teamLove, 0)
  const totalBad = trend.reduce((s, d) => s + d.teamBad, 0)
  const bossLoveDays = trend.filter((d) => d.bossEmoji === 'love').length
  const bossBadDays = trend.filter((d) => d.bossEmoji === 'bad').length

  // Streak: consecutive love days ending today
  let streak = 0
  for (let i = trend.length - 1; i >= 0; i--) {
    const d = trend[i]
    if (d.teamLove > 0 && d.teamBad === 0) streak++
    else break
  }

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <h1 className="text-xl font-bold text-white text-center">Vibe Trend 📈</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-pink-600/20 border border-pink-500/30 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-pink-400">{totalLove}</div>
          <div className="text-xs text-gray-400 mt-1">❤️ Love votes (10d)</div>
        </div>
        <div className="bg-red-700/20 border border-red-500/30 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-red-400">{totalBad}</div>
          <div className="text-xs text-gray-400 mt-1">💢 Bad votes (10d)</div>
        </div>
        <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">{streak}</div>
          <div className="text-xs text-gray-400 mt-1">🔥 Love streak (days)</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-xl font-bold text-white">
            {bossLoveDays}❤️ / {bossBadDays}💢
          </div>
          <div className="text-xs text-gray-400 mt-1">Boss ratings (10d)</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white/5 rounded-3xl p-4">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Team votes per day</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={trend} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
            <Bar dataKey="teamLove" name="❤️ Love" fill="#ec4899" radius={[4, 4, 0, 0]} />
            <Bar dataKey="teamBad" name="💢 Bad" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily breakdown table */}
      <div className="bg-white/5 rounded-3xl p-4">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">Day by day</h2>
        <div className="flex flex-col gap-2">
          {[...trend].reverse().map((d) => (
            <div
              key={d.date}
              className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0"
            >
              <span className="text-gray-400 text-xs w-14">{d.label}</span>
              <span className="text-pink-400">❤️ {d.teamLove}</span>
              <span className="text-red-400">💢 {d.teamBad}</span>
              <span className="w-8 text-center">
                <BossEmoji emoji={d.bossEmoji} />
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 text-center mt-3">Last column = boss's rating of team</p>
      </div>
    </div>
  )
}
