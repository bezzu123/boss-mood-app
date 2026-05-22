import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Home as HomeIcon, BarChart2, Settings as SettingsIcon } from 'lucide-react'
import { UserProvider, useUser } from './UserContext'
import Login from './pages/Login'
import BossPin from './pages/BossPin'
import NameSetup from './pages/NameSetup'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'

function Nav() {
  const linkClass = ({ isActive }) =>
    `flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
      isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
    }`
  return (
    <nav className="flex border-t border-white/10 bg-[#0f0f1a] sticky bottom-0">
      <NavLink to="/" end className={linkClass}>
        <HomeIcon size={20} strokeWidth={1.5} /> Today
      </NavLink>
      <NavLink to="/dashboard" className={linkClass}>
        <BarChart2 size={20} strokeWidth={1.5} /> Trend
      </NavLink>
      <NavLink to="/settings" className={linkClass}>
        <SettingsIcon size={20} strokeWidth={1.5} /> Settings
      </NavLink>
    </nav>
  )
}

function Inner() {
  const { screen } = useUser()

  if (screen === 'landing') return <Login />
  if (screen === 'boss-pin') return <BossPin />
  if (screen === 'employee-name') return <NameSetup />

  return (
    <BrowserRouter>
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto pb-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <Nav />
      </div>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <UserProvider>
      <Inner />
    </UserProvider>
  )
}
