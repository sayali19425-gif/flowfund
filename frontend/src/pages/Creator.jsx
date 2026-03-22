import { useState, useRef } from 'react'
import MilestoneCard from '../components/MilestoneCard'

export default function Creator({ wallet, projects, setProjects }) {
  const [step, setStep] = useState('form')
  const [title, setTitle] = useState('')
  const [xlm, setXlm] = useState('')
  const [description, setDescription] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [milestoneLabels, setMilestoneLabels] = useState([''])
  const [activeProject, setActiveProject] = useState(null)
  const [toast, setToast] = useState(null)
  const [pendingMilestoneIdx, setPendingMilestoneIdx] = useState(null)
  const fileRef = useRef()

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const addMilestone = () => setMilestoneLabels(prev => [...prev, ''])
  const updateMilestone = (i, v) => setMilestoneLabels(prev => prev.map((m, j) => j === i ? v : m))
  const removeMilestone = (i) => { if (milestoneLabels.length > 1) setMilestoneLabels(prev => prev.filter((_, j) => j !== i)) }

  const createProject = () => {
    if (!title.trim()) { showToast('Please enter a project title', 'error'); return }
    if (!xlm || Number(xlm) <= 0) { showToast('Please enter valid XLM amount', 'error'); return }
    if (!description.trim()) { showToast('Please enter a project description', 'error'); return }
    const filtered = milestoneLabels.filter(m => m.trim() !== '')
    if (filtered.length === 0) { showToast('Please add at least one milestone', 'error'); return }

    const proj = {
      id: Date.now(),
      creator: wallet,
      title: title.trim(),
      description: description.trim(),
      projectUrl: projectUrl.trim(),
      milestones: filtered.map(label => ({ label, status: 'pending', photo: null, submittedUrl: '', submittedNote: '' })),
      totalXLM: Number(xlm),
      funded: false,
      completedAt: null,
      createdAt: new Date().toISOString().slice(0, 10),
    }

    setProjects(prev => [...prev, proj])
    setActiveProject(proj)
    setStep('project')
    showToast('Project created successfully!')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 500 * 1024) { showToast('Image too large! Use image under 500KB', 'error'); e.target.value = ''; return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const photo = ev.target.result
        const mIdx = pendingMilestoneIdx
        setProjects(ps => ps.map(p => p.id !== activeProject.id ? p : { ...p, milestones: p.milestones.map((m, i) => i !== mIdx ? m : { ...m, status: 'submitted', photo }) }))
        setActiveProject(prev => ({ ...prev, milestones: prev.milestones.map((m, i) => i !== mIdx ? m : { ...m, status: 'submitted', photo }) }))
        showToast('Milestone submitted for funder review!')
      } catch (err) { showToast('Failed to upload. Try smaller image.', 'error') }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const openFilePicker = (index) => { setPendingMilestoneIdx(index); setTimeout(() => fileRef.current.click(), 100) }
  const currentProject = activeProject ? projects.find(p => p.id === activeProject.id) || activeProject : null
  const myProjects = projects.filter(p => p.creator === wallet)

  if (!wallet) return (
    <Wrap>
      <div style={{ textAlign: 'center', color: '#5a7090', paddingTop: '6rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <p>Connect your wallet first to create a project.</p>
      </div>
    </Wrap>
  )

  return (
    <Wrap>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {step === 'form' && (
        <div style={{ maxWidth: '580px', margin: '0 auto', animation: 'fadeUp 0.5s ease both' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#5a7090', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>NEW PROJECT</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Launch Your Project</h2>
          <p style={{ color: '#5a7090', marginBottom: '2rem', lineHeight: 1.6 }}>Funds stay in escrow until each milestone is approved by your funder.</p>

          <Field label="Project Title">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. DeFi Portfolio Dashboard" style={inputStyle} />
          </Field>

          <Field label="Project Description">
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your project, what you will build and deliver..." rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
          </Field>

          <Field label="Project URL (optional)">
            <input value={projectUrl} onChange={e => setProjectUrl(e.target.value)} placeholder="https://github.com/yourproject or demo link" style={inputStyle} />
          </Field>

          <Field label="Total Funding Required (XLM)">
            <input type="number" value={xlm} onChange={e => setXlm(e.target.value)} placeholder="e.g. 500" style={inputStyle} />
          </Field>

          <Field label="Milestones">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {milestoneLabels.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#5a7090', minWidth: '20px' }}>{i + 1}.</span>
                  <input value={m} onChange={e => updateMilestone(i, e.target.value)} placeholder={`Milestone ${i + 1} name`} style={{ ...inputStyle, flex: 1 }} />
                  {milestoneLabels.length > 1 && (
                    <button onClick={() => removeMilestone(i)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.5rem 0.7rem', color: '#ef4444', cursor: 'pointer', fontFamily: 'Syne, sans-serif' }}>✕</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addMilestone} style={{ ...ghostBtn, marginTop: '0.6rem' }}>+ Add Milestone</button>
          </Field>

          <button onClick={createProject} style={primaryBtn}>Deploy Escrow Contract →</button>

          {myProjects.length > 0 && (
            <div style={{ marginTop: '2.5rem' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#5a7090', letterSpacing: '0.12em', marginBottom: '1rem' }}>MY PROJECTS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {myProjects.map(p => {
                  const approved = p.milestones.filter(m => m.status === 'approved').length
                  return (
                    <button key={p.id} onClick={() => { setActiveProject(p); setStep('project') }} style={{ background: '#0f1520', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1rem 1.2rem', textAlign: 'left', cursor: 'pointer', fontFamily: 'Syne, sans-serif', color: '#e8edf5', transition: 'all 0.2s' }}>
                      <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{p.title}</div>
                      {p.description && <div style={{ color: '#5a7090', fontSize: '0.82rem', marginBottom: '0.4rem', lineHeight: 1.4 }}>{p.description.slice(0, 80)}{p.description.length > 80 ? '...' : ''}</div>}
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#5a7090', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span>{p.totalXLM} XLM</span>
                        <span style={{ color: '#10b981' }}>{approved}/{p.milestones.length} approved</span>
                        <span style={{ color: p.funded ? '#10b981' : '#f59e0b' }}>{p.funded ? '✅ Completed' : '⏳ In Progress'}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 'project' && currentProject && (
        <div style={{ maxWidth: '640px', margin: '0 auto', animation: 'fadeUp 0.5s ease both' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#5a7090', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>ACTIVE PROJECT</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{currentProject.title}</h2>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9rem', color: '#00e5ff', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', padding: '0.3rem 0.8rem', borderRadius: '8px' }}>{currentProject.totalXLM} XLM</span>
          </div>

          {currentProject.description && (
            <div style={{ background: '#0f1520', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '1rem', color: '#5a7090', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {currentProject.description}
            </div>
          )}

          {currentProject.projectUrl && (
            <div style={{ marginBottom: '1rem' }}>
              <a href={currentProject.projectUrl} target="_blank" rel="noreferrer" style={{ color: '#00e5ff', fontSize: '0.85rem', fontFamily: 'DM Mono, monospace', textDecoration: 'none', borderBottom: '1px dashed #00e5ff55' }}>
                🔗 {currentProject.projectUrl}
              </a>
            </div>
          )}

          <Progress milestones={currentProject.milestones} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.5rem' }}>
            {currentProject.milestones.map((m, i) => (
              <MilestoneCard key={i} milestone={m} index={i} isFunder={false} onSubmit={m.status === 'pending' || m.status === 'rejected' ? () => openFilePicker(i) : null} />
            ))}
          </div>

          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

          <button onClick={() => { setStep('form'); setActiveProject(null) }} style={{ ...ghostBtn, marginTop: '1.5rem' }}>← Back to Projects</button>
        </div>
      )}
    </Wrap>
  )
}

function Progress({ milestones }) {
  const done = milestones.filter(m => m.status === 'approved').length
  const pct = Math.round((done / milestones.length) * 100)
  return (
    <div style={{ background: '#0f1520', border: '1px solid #1e2d45', borderRadius: '12px', padding: '1rem 1.2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.85rem', color: '#5a7090', fontFamily: 'DM Mono, monospace' }}>
        <span>{done}/{milestones.length} milestones approved</span><span>{pct}%</span>
      </div>
      <div style={{ height: '6px', background: '#1e2d45', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #00e5ff, #7c3aed)', borderRadius: '3px', transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

function Wrap({ children }) { return <div style={{ paddingTop: '88px', minHeight: '100vh', padding: '88px 2rem 4rem' }}>{children}</div> }
function Field({ label, children }) { return <div style={{ marginBottom: '1.2rem' }}><div style={{ fontSize: '0.8rem', color: '#5a7090', marginBottom: '0.4rem', fontWeight: 600 }}>{label}</div>{children}</div> }
function Toast({ msg, type }) { return <div style={{ position: 'fixed', top: '80px', right: '1.5rem', background: type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`, color: type === 'success' ? '#10b981' : '#ef4444', padding: '0.75rem 1.2rem', borderRadius: '10px', zIndex: 999, fontWeight: 600, fontSize: '0.9rem' }}>{msg}</div> }
const inputStyle = { width: '100%', background: '#0f1520', border: '1px solid #1e2d45', borderRadius: '10px', padding: '0.75rem 1rem', color: '#e8edf5', fontSize: '0.95rem', fontFamily: 'Syne, sans-serif', outline: 'none', display: 'block' }
const primaryBtn = { width: '100%', padding: '0.9rem', borderRadius: '12px', background: 'linear-gradient(135deg, #00e5ff22, #7c3aed22)', border: '1px solid #00e5ff55', color: '#00e5ff', fontWeight: 700, fontSize: '1rem', fontFamily: 'Syne, sans-serif', cursor: 'pointer', marginTop: '0.5rem' }
const ghostBtn = { background: 'transparent', border: '1px dashed #1e2d45', borderRadius: '8px', padding: '0.6rem 1rem', color: '#5a7090', fontSize: '0.85rem', fontFamily: 'Syne, sans-serif', cursor: 'pointer', width: '100%' }