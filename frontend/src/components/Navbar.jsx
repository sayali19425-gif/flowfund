const s = {
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '64px', background: 'rgba(8,11,16,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(30,45,69,0.6)' },
  logo: { fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #00e5ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' },
  links: { display: 'flex', gap: '0.25rem' },
  link: (active) => ({ background: active ? 'rgba(0,229,255,0.1)' : 'transparent', color: active ? '#00e5ff' : '#5a7090', border: active ? '1px solid rgba(0,229,255,0.2)' : '1px solid transparent', borderRadius: '6px', padding: '0.4rem 0.9rem', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'Syne, sans-serif', cursor: 'pointer', transition: 'all 0.2s' }),
  wallet: { fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#5a7090', background: 'rgba(15,21,32,0.8)', border: '1px solid rgba(30,45,69,0.8)', borderRadius: '6px', padding: '0.3rem 0.7rem' },
  disconnect: { fontFamily: 'Syne, sans-serif', fontSize: '0.75rem', color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer', marginLeft: '0.5rem' },
  roleBadge: (role) => ({ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: role === 'creator' ? '#00e5ff' : '#7c3aed', background: role === 'creator' ? 'rgba(0,229,255,0.08)' : 'rgba(124,58,237,0.08)', border: `1px solid ${role === 'creator' ? 'rgba(0,229,255,0.2)' : 'rgba(124,58,237,0.2)'}`, borderRadius: '6px', padding: '0.3rem 0.7rem', marginRight: '0.5rem' }),
}

export default function Navbar({ page, nav, wallet, role, onDisconnect }) {
  const links = ['home', 'history']
  if (role === 'creator') links.splice(1, 0, 'creator')
  if (role === 'funder') links.splice(1, 0, 'funder')

  return (
    <nav style={s.nav}>
      <span style={s.logo} onClick={() => nav('home')}>⬡ FlowFund</span>
      <div style={s.links}>
        {links.map(p => (
          <button key={p} style={s.link(page === p)} onClick={() => nav(p)}>
            {p === 'home' ? 'Home' : p === 'creator' ? 'Creator' : p === 'funder' ? 'Funder' : 'History'}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {role && <span style={s.roleBadge(role)}>{role.toUpperCase()}</span>}
        {wallet && <span style={s.wallet}>{wallet.slice(0, 6)}...{wallet.slice(-4)}</span>}
        {wallet && <button style={s.disconnect} onClick={onDisconnect}>Disconnect</button>}
      </div>
    </nav>
  )
}