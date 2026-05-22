import { db } from './firebase'
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore'

// Team member votes on boss
export async function submitTeamVote(userId, userName, date, emoji) {
  const id = `${date}_${userId}`
  await setDoc(doc(db, 'teamVotes', id), {
    userId,
    userName,
    emoji,
    date,
    updatedAt: serverTimestamp(),
  })
}

export async function getMyTeamVote(userId, date) {
  const snap = await getDoc(doc(db, 'teamVotes', `${date}_${userId}`))
  return snap.exists() ? snap.data() : null
}

export async function getTodayTeamVotes(date) {
  const q = query(collection(db, 'teamVotes'), where('date', '==', date))
  const snap = await getDocs(q)
  return snap.docs.map((d) => d.data())
}

// Boss votes on team
export async function submitBossVote(date, emoji) {
  await setDoc(doc(db, 'bossVotes', date), {
    emoji,
    date,
    updatedAt: serverTimestamp(),
  })
}

export async function getBossVote(date) {
  const snap = await getDoc(doc(db, 'bossVotes', date))
  return snap.exists() ? snap.data() : null
}

// Trend: last N days
export async function getTrend(days = 30) {
  const dates = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    )
  }

  const [teamSnap, bossSnap] = await Promise.all([
    getDocs(query(collection(db, 'teamVotes'), where('date', 'in', dates.slice(-10)))),
    getDocs(query(collection(db, 'bossVotes'), where('date', 'in', dates.slice(-10)))),
  ])

  // Firestore 'in' max 10 — fetch in two halves if needed
  const teamVotes = teamSnap.docs.map((d) => d.data())
  const bossVotes = bossSnap.docs.map((d) => d.data())

  return dates.slice(-10).map((date) => {
    const dayTeam = teamVotes.filter((v) => v.date === date)
    const bossDay = bossVotes.find((v) => v.date === date)
    const love = dayTeam.filter((v) => v.emoji === 'love').length
    const bad = dayTeam.filter((v) => v.emoji === 'bad').length
    return {
      date,
      label: date.slice(5),
      teamLove: love,
      teamBad: bad,
      bossEmoji: bossDay?.emoji ?? null,
    }
  })
}
