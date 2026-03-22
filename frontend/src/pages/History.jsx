const BADGES = ['🏆', '🥇', '🎖️', '⭐', '💎']

export default function History({ projects, nav }) {
  const funded = projects.filter(p => p.funded)

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', padding: '88px 2rem 4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#f59e0b', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>HALL OF FAME</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' }}>Successfully Funded</h2>
        <p style={{ color: '#5a7090', marginBottom: '2.5rem' }}>Projects that completed all milestones and received full funding.</p>

        {funded.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#5a7090', border: '1px dashed #1e2d45', borderRadius: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
            <p>No completed projects yet. Be the first!</p>
            <button onClick={() => nav('creator')} style={{ marginTop: '1.5rem', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: '10px', padding: '0.7rem 1.5rem', color: '#00e5ff', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}>Create a Project</button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {funded.map((p, i) => (
            <div key={p.id} style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(15,21,32,1))', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', padding: '1.5rem 1.8rem', display: 'flex', alignItems: 'center', gap: '1.5rem', animation: 'fadeUp 0.4s ease both', animationDelay: `${i * 0.08}s` }}>
              <div style={{ fontSize: '2.5rem', minWidth: '52px', textAlign: 'center' }}>{BADGES[i % BADGES.length]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.3rem' }}>{p.title}</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#5a7090', display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                  <span>{p.creator.slice(0,8)}…{p.creator.slice(-4)}</span>
                  <span>{p.milestones.length} milestones</span>
                  {p.completedAt && <span>Completed {p.completedAt}</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                  {p.milestones.map((m, j) => (
                    <span key={j} style={{ fontSize: '0.7rem', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '999px', fontFamily: 'DM Mono, monospace' }}>✓ {m.label}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{p.totalXLM}</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#5a7090' }}>XLM funded</div>
              </div>
            </div>
          ))}
        </div>

        {funded.length > 0 && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#0f1520', border: '1px solid #1e2d45', borderRadius: '14px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
            {[['Total Projects', funded.length], ['XLM Released', `${funded.reduce((s,p) => s+p.totalXLM,0)} XLM`], ['Milestones', funded.reduce((s,p) => s+p.milestones.length,0)]].map(([lbl, val]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: '#00e5ff' }}>{val}</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#5a7090' }}>{lbl}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}