import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Creator from './pages/Creator'
import Funder from './pages/Funder'
import History from './pages/History'

// Store photos in memory (not localStorage)
const photoStore = {}

const saveProjects = (projects) => {
  try {
    const toStore = projects.map(p => ({
      ...p,
      milestones: p.milestones.map(m => ({ ...m, photo: null }))
    }))
    localStorage.setItem('flowfund_projects', JSON.stringify(toStore))
  } catch (err) {
    console.error('Storage error:', err)
  }
}

const mergePhotos = (projects) => {
  return projects.map(p => ({
    ...p,
    milestones: p.milestones.map((m, i) => ({
      ...m,
      photo: photoStore[`${p.id}_${i}`] || m.photo || null
    }))
  }))
}

export default function App() {
  const [page, setPage] = useState('home')
  const [wallet, setWallet] = useState(null)
  const [role, setRole] = useState(null)

  const [projects, setProjectsState] = useState(() => {
    try {
      const saved = localStorage.getItem('flowfund_projects')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => {
    const savedWallet = localStorage.getItem('flowfund_wallet')
    const savedRole = localStorage.getItem('flowfund_role')
    if (savedWallet) setWallet(savedWallet)
    if (savedRole) setRole(savedRole)
  }, [])

  useEffect(() => {
    if (wallet) localStorage.setItem('flowfund_wallet', wallet)
  }, [wallet])

  useEffect(() => {
    if (role) localStorage.setItem('flowfund_role', role)
  }, [role])

  const setProjects = (updater) => {
    setProjectsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater

      // Save photos to memory store
      next.forEach(p => {
        p.milestones.forEach((m, i) => {
          if (m.photo) {
            photoStore[`${p.id}_${i}`] = m.photo
          }
        })
      })

      saveProjects(next)
      return next
    })
  }

  // Merge photos from memory into projects
  const projectsWithPhotos = mergePhotos(projects)

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setPage(selectedRole)
  }

  const handleDisconnect = () => {
    setWallet(null)
    setRole(null)
    setPage('home')
    localStorage.removeItem('flowfund_wallet')
    localStorage.removeItem('flowfund_role')
  }

  const nav = (p) => {
    if (p === 'creator' && role === 'funder') return
    if (p === 'funder' && role === 'creator') return
    setPage(p)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <Navbar page={page} nav={nav} wallet={wallet} role={role} onDisconnect={handleDisconnect} />
      {page === 'home' && <Home nav={nav} wallet={wallet} setWallet={setWallet} role={role} onRoleSelect={handleRoleSelect} />}
      {page === 'creator' && role === 'creator' && <Creator wallet={wallet} projects={projectsWithPhotos} setProjects={setProjects} />}
      {page === 'funder' && role === 'funder' && <Funder wallet={wallet} projects={projectsWithPhotos} setProjects={setProjects} />}
      {page === 'history' && <History projects={projectsWithPhotos} nav={nav} />}
    </>
  )
}