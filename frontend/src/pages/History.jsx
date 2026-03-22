const BADGES = ['🏆', '🥇', '🎖️', '⭐', '💎', '🌟', '🔥', '👑']

export default function History({ projects, nav }) {
  const allProjects = [...projects].reverse()
  const completed = projects.filter(p => p.funded).length
  const inProgress = projects.filter(p => !p.funded).length
  const totalXLM = projects.reduce((s, p) => s + Number(p.totalXLM || p.total_xlm || 0), 0)
  const totalMilestones = projects.reduce((s, p) => s + (p.milestones?.length || 0), 0)

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', padding: '88px 2rem 4rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#10b981', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>ALL PROJECTS</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' }}>Project History</h2>
        <p style={{ color: '#4b7a63', marginBottom: '2rem' }}>All projects created on FlowFund — completed and in progress.</p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem', marginBottom: '2rem' }}>
          <StatCard label="Total Projects" value={allProjects.length} />
          <StatCard label="Completed" value={completed} color="#10b981" />
          <StatCard label="In Progress" value={inProgress} color="#f59e0b" />
          <StatCard label="Total XLM" value={totalXLM + ' XLM'} color="#10b981" />
          <StatCard label="Milestones" value={totalMilestones} />
        </div>

        {allProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#4b7a63', border: '1px dashed rgba(16,185,129,0.2)', borderRadius: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
            <p style={{ marginBottom: '1.5rem' }}>No projects yet. Be the first to create one!</p>
            <button onClick={() => nav('home')} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '0.7rem 1.5rem', color: '#10b981', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}>
              Get Started
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {allProjects.map((p, i) => {
            const approved = (p.milestones || []).filter(m => m.status === 'approved').length
            const total = (p.milestones || []).length
            const pct = total > 0 ? Math.round((approved / total) * 100) : 0
            const xlm = Number(p.totalXLM || p.total_xlm || 0)
            const isFunded = p.funded
            const statusColor = isFunded ? '#10b981' : '#f59e0b'
            const statusBg = isFunded ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)'
            const statusBorder = isFunded ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'
            const statusLabel = isFunded ? 'Completed' : 'In Progress'

            return (
              <div key={p.id || i} style={{ background: statusBg, border: '1px solid ' + statusBorder, borderRadius: '16px', padding: '1.5rem 1.8rem', animation: 'fadeUp 0.4s ease both', animationDelay: (i * 0.06) + 's' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem', flexWrap: 'wrap' }}>

                  <div style={{ fontSize: '2rem', minWidth: '44px', textAlign: 'center' }}>
                    {BADGES[i % BADGES.length]}
                  </div>

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{p.title}</div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: statusColor, background: statusBg, border: '1px solid ' + statusBorder, padding: '0.2rem 0.7rem', borderRadius: '999px', fontFamily: 'DM Mono, monospace' }}>
                        {statusLabel}
                      </span>
                    </div>

                    {p.description && (
                      <div style={{ color: '#4b7a63', fontSize: '0.85rem', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                        {p.description.slice(0, 100)}{p.description.length > 100 ? '...' : ''}
                      </div>
                    )}

                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#4b7a63', display: 'flex', gap: '1.2rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                      <span>Creator: {(p.creator || '').slice(0, 8)}...{(p.creator || '').slice(-4)}</span>
                      <span>{total} milestones</span>
                      {(p.completedAt || p.completed_at) && <span>Completed {p.completedAt || p.completed_at}</span>}
                      {(p.createdAt || p.created_at) && <span>Created {p.createdAt || p.created_at}</span>}
                    </div>

                    {(p.projectUrl || p.project_url) && (
                      <a href={p.projectUrl || p.project_url} target="_blank" rel="noreferrer" style={{ color: '#10b981', fontSize: '0.78rem', fontFamily: 'DM Mono, monospace', textDecoration: 'none', borderBottom: '1px dashed rgba(16,185,129,0.4)', display: 'inline-block', marginBottom: '0.8rem' }}>
                        {(p.projectUrl || p.project_url).slice(0, 50)}
                      </a>
                    )}

                    {/* Progress bar */}
                    <div style={{ marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#4b7a63', fontFamily: 'DM Mono, monospace', marginBottom: '0.3rem' }}>
                        <span>{approved}/{total} approved</span>
                        <span>{pct}%</span>
                      </div>
                      <div style={{ height: '5px', background: 'rgba(16,185,129,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: pct + '%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '3px', transition: 'width 0.6s ease' }} />
                      </div>
                    </div>

                    {/* Milestone badges */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {(p.milestones || []).map((m, j) => {
                        const mc = m.status === 'approved' ? '#10b981' : m.status === 'submitted' ? '#00e5ff' : m.status === 'rejected' ? '#ef4444' : '#f59e0b'
                        const mb = m.status === 'approved' ? 'rgba(16,185,129,0.12)' : m.status === 'submitted' ? 'rgba(0,229,255,0.08)' : m.status === 'rejected' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)'
                        const mbd = m.status === 'approved' ? 'rgba(16,185,129,0.25)' : m.status === 'submitted' ? 'rgba(0,229,255,0.2)' : m.status === 'rejected' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'
                        const mi = m.status === 'approved' ? '✓' : m.status === 'submitted' ? '📤' : m.status === 'rejected' ? '✗' : '⏳'
                        return (
                          <span key={j} style={{ fontSize: '0.68rem', background: mb, border: '1px solid ' + mbd, color: mc, padding: '0.2rem 0.6rem', borderRadius: '999px', fontFamily: 'DM Mono, monospace' }}>
                            {mi} {m.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {/* XLM */}
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#10b981' }}>{xlm}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#4b7a63' }}>XLM</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: 'rgba(4,26,16,0.8)', border: '1px solid rgba(13,61,37,0.8)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
      <div style={{ fontWeight: 800, fontSize: '1.4rem', color: color || '#ecfdf5' }}>
        {value}
      </div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#4b7a63', marginTop: '0.2rem' }}>
        {label}
      </div>
    </div>
  )
}