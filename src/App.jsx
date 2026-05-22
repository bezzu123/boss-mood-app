import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { useUser } from './useStore'
import NameSetup from './pages/NameSetup'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'

function Nav() {
  const linkClass = ({ isActive }) =>
    `flex-1 py-3 text-center text-sm font-medium transition-colors ${
      isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
    }`
  return (
    <nav className="flex border-t border-white/10 bg-[#0f0f1a] sticky bottom-0">
      <NavLink to="/" end className={linkClass}>
        🏠 Today
      </NavLink>
      <NavLink to="/dashboard" className={linkClass}>
        📊 Trend
      </NavLink>
      <NavLink to="/settings" className={linkClass}>
        ⚙️ Settings
      </NavLink>
    </nav>
  )
}

export default function App() {
  const { user } = useUser()

  if (!user) return <NameSetup />

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
