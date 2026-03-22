import WalletButton from '../components/WalletButton'

const FEATURES = [
  { icon: '🔐', title: 'Escrow-Secured', desc: 'Funds locked in Soroban smart contracts until milestones are approved.' },
  { icon: '📊', title: 'Milestone Tracking', desc: 'Transparent on-chain progress. Each phase verified before payout.' },
  { icon: '⚡', title: 'Instant Settlement', desc: 'Stellar 5-second finality means creators get paid instantly on approval.' },
]

export default function Home({ nav, wallet, setWallet, role, onRoleSelect }) {
  return (
    <div style={{ paddingTop: '64px' }}>
      <section style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem' }}>

        <div style={{ animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ display: 'inline-block', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.25)', borderRadius: '999px', padding: '0.3rem 1rem', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
            BUILT ON STELLAR · SOROBAN ESCROW
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.2rem' }}>
            Fund with<br />
            <span style={{ background: 'linear-gradient(135deg, #00e5ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Proof, Not Faith</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#5a7090', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            FlowFund releases payments only when milestones are delivered and verified — trustless, transparent, and on-chain.
          </p>
        </div>

        {/* Step 1 - Connect Wallet */}
        {!wallet && (
          <div style={{ animation: 'fadeUp 0.6s ease 0.15s both' }}>
            <div style={{ color: '#5a7090', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', marginBottom: '1rem', letterSpacing: '0.08em' }}>STEP 1 — CONNECT YOUR WALLET</div>
            <WalletButton wallet={wallet} setWallet={setWallet} />
          </div>
        )}

        {/* Step 2 - Select Role */}
        {wallet && !role && (
          <div style={{ animation: 'fadeUp 0.5s ease both' }}>
            <div style={{ color: '#5a7090', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', marginBottom: '1.5rem', letterSpacing: '0.08em' }}>STEP 2 — SELECT YOUR ROLE</div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <RoleCard
                icon="🎨"
                title="I am a Creator"
                desc="Create projects, submit milestone proofs and receive funds"
                color="#00e5ff"
                points={['Create milestone projects', 'Upload proof for each milestone', 'Receive XLM on approval']}
                onClick={() => onRoleSelect('creator')}
              />
              <RoleCard
                icon="💎"
                title="I am a Funder"
                desc="Review milestone proofs and release payments to creators"
                color="#7c3aed"
                points={['View all creator projects', 'Review milestone submissions', 'Send XLM on approval']}
                onClick={() => onRoleSelect('funder')}
              />
            </div>
          </div>
        )}

        {/* Already has role */}
        {wallet && role && (
          <div style={{ animation: 'fadeUp 0.5s ease both', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '0.8rem 1.5rem', color: '#10b981', fontWeight: 700 }}>
              Connected as {role.toUpperCase()} ✅
            </div>
            <button
              onClick={() => nav(role)}
              style={{ padding: '0.9rem 2.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg, #00e5ff22, #7c3aed22)', border: '1px solid #00e5ff55', color: '#00e5ff', cursor: 'pointer' }}
            >
              Go to {role === 'creator' ? 'Creator Dashboard' : 'Funder Dashboard'} →
            </button>
          </div>
        )}
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: '#0f1520', border: '1px solid #1e2d45', borderRadius: '16px', padding: '1.8rem', animation: 'fadeUp 0.5s ease both', animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{f.title}</div>
              <div style={{ color: '#5a7090', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '3rem 2rem', borderTop: '1px solid #1e2d45', borderBottom: '1px solid #1e2d45', display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
        {[['3', 'Projects Funded'], ['2.5K XLM', 'Total Released'], ['5+', 'Testnet Users'], ['100%', 'On-Chain']].map(([val, lbl]) => (
          <div key={lbl} style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: '2rem', background: 'linear-gradient(135deg, #00e5ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</div>
            <div style={{ color: '#5a7090', fontSize: '0.85rem', fontFamily: 'DM Mono, monospace' }}>{lbl}</div>
          </div>
        ))}
      </section>
    </div>
  )
}

function RoleCard({ icon, title, desc, color, points, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ background: `${color}0a`, border: `1px solid ${color}33`, borderRadius: '20px', padding: '2rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s', width: '260px', fontFamily: 'Syne, sans-serif' }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 40px ${color}1a` }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}0a`; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: '1.1rem', color, marginBottom: '0.4rem' }}>{title}</div>
      <div style={{ color: '#5a7090', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>{desc}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {points.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#5a7090' }}>
            <span style={{ color, fontSize: '0.7rem' }}>✓</span> {p}
          </div>
        ))}
      </div>
    </button>
  )
}