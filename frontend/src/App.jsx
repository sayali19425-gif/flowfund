import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Creator from './pages/Creator'
import Funder from './pages/Funder'
import History from './pages/History'

// Store photos in memory only
const photoStore = {}

export default function App() {
  const [page, setPage] = useState('home')
  const [wallet, setWallet] = useState(null)
  const [role, setRole] = useState(null)
  const [projects, setProjectsState] = useState([])
  const [loading, setLoading] = useState(true)

  // Load wallet and role from localStorage
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

  // Load projects from Supabase + real time updates
  useEffect(() => {
    loadProjects()

    const subscription = supabase
      .channel('projects-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects'
      }, () => {
        loadProjects()
      })
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  const loadProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false })

    if (error) { console.error('Load error:', error); return }

    const formatted = (data || []).map(p => ({
      ...p,
      totalXLM: p.total_xlm,
      projectUrl: p.project_url,
      completedAt: p.completed_at,
      createdAt: p.created_at,
      milestones: typeof p.milestones === 'string'
        ? JSON.parse(p.milestones)
        : p.milestones || [],
    }))

    setProjectsState(formatted)
  } catch (err) {
    console.error('Load error:', err)
  } finally {
    setLoading(false)
  }
}

  // Merge photos from memory into projects
  const projectsWithPhotos = projects.map(p => ({
    ...p,
    milestones: (p.milestones || []).map((m, i) => ({
      ...m,
      photo: photoStore[`${p.id}_${i}`] || m.photo || null
    }))
  }))

  const setProjects = (updater) => {
    setProjectsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater

      // Save photos to memory
      next.forEach(p => {
        p.milestones.forEach((m, i) => {
          if (m.photo) photoStore[`${p.id}_${i}`] = m.photo
        })
      })

      // Sync to Supabase
      next.forEach(async newP => {
        const old = prev.find(p => p.id === newP.id)

        const toStore = {
          id: newP.id,
          creator: newP.creator,
          title: newP.title,
          description: newP.description || '',
          project_url: newP.projectUrl || newP.project_url || '',
          milestones: newP.milestones.map(m => ({ ...m, photo: null })),
          total_xlm: newP.totalXLM || newP.total_xlm,
          funded: newP.funded || false,
          completed_at: newP.completedAt || newP.completed_at || null,
          created_at: newP.createdAt || newP.created_at || new Date().toISOString().slice(0, 10),
        }

        if (!old) {
          // New project — insert
          const { error } = await supabase.from('projects').insert([toStore])
          if (error) console.error('Insert error:', error)
          else loadProjects()
        } else {
          // Check if milestones or funded changed
          const milestonesChanged = JSON.stringify(old.milestones) !== JSON.stringify(newP.milestones)
          const fundedChanged = old.funded !== newP.funded

          if (milestonesChanged || fundedChanged) {
            const { error } = await supabase
              .from('projects')
              .update({
                milestones: toStore.milestones,
                funded: toStore.funded,
                completed_at: toStore.completed_at,
              })
              .eq('id', newP.id)
            if (error) console.error('Update error:', error)
            else loadProjects()
          }
        }
      })

      return next
    })
  }

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

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#020f0a',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{
        width: 44,
        height: 44,
        border: '3px solid rgba(16,185,129,0.2)',
        borderTop: '3px solid #10b981',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <div style={{
        color: '#10b981',
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.9rem'
      }}>
        Loading FlowFund...
      </div>
    </div>
  )

  return (
    <>
      <Navbar
        page={page}
        nav={nav}
        wallet={wallet}
        role={role}
        onDisconnect={handleDisconnect}
      />
      {page === 'home' && (
        <Home
          nav={nav}
          wallet={wallet}
          setWallet={setWallet}
          role={role}
          onRoleSelect={handleRoleSelect}
        />
      )}
      {page === 'creator' && role === 'creator' && (
        <Creator
          wallet={wallet}
          projects={projectsWithPhotos}
          setProjects={setProjects}
        />
      )}
      {page === 'funder' && role === 'funder' && (
        <Funder
          wallet={wallet}
          projects={projectsWithPhotos}
          setProjects={setProjects}
        />
      )}
      {page === 'history' && (
        <History
          projects={projectsWithPhotos}
          nav={nav}
        />
      )}
    </>
  )
}