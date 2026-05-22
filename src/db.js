import { db } from './firebase'
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'

// PIN management
export async function getBossPin() {
  const snap = await getDoc(doc(db, 'config', 'app'))
  return snap.exists() ? (snap.data().bossPin ?? '12345') : '12345'
}

export async function setBossPin(newPin) {
  await setDoc(doc(db, 'config', 'app'), { bossPin: newPin }, { merge: true })
}

// Team member votes on boss (anonymous — no name stored)
export async function submitTeamVote(userId, date, emoji) {
  const id = `${date}_${userId}`
  await setDoc(doc(db, 'teamVotes', id), {
    userId,
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

// Trend: last 10 days
export async function getTrend() {
  const dates = []
  for (let i = 9; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    )
  }

  const [teamSnap, bossSnap] = await Promise.all([
    getDocs(query(collection(db, 'teamVotes'), where('date', 'in', dates))),
    getDocs(query(collection(db, 'bossVotes'), where('date', 'in', dates))),
  ])

  const teamVotes = teamSnap.docs.map((d) => d.data())
  const bossVotes = bossSnap.docs.map((d) => d.data())

  return dates.map((date) => {
    const dayTeam = teamVotes.filter((v) => v.date === date)
    const bossDay = bossVotes.find((v) => v.date === date)
    return {
      date,
      label: date.slice(5),
      teamLove: dayTeam.filter((v) => v.emoji === 'love').length,
      teamBad: dayTeam.filter((v) => v.emoji === 'bad').length,
      bossEmoji: bossDay?.emoji ?? null,
    }
  })
}
