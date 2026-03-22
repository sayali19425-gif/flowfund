import WalletButton from '../components/WalletButton'

const FEATURES = [
  { icon: '🔐', title: 'Escrow-Secured', desc: 'Funds locked in Soroban smart contracts until milestones are approved.' },
  { icon: '📊', title: 'Milestone Tracking', desc: 'Transparent on-chain progress. Each phase verified before payout.' },
  { icon: '⚡', title: 'Instant Settlement', desc: 'Stellar 5-second finality means creators get paid instantly on approval.' },
]

export default function Home({ nav, wallet, setWallet, role, onRoleSelect }) {
  return (
    <div style={{ paddingTop: '64px' }}>

      {/* HERO */}
      <section style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem', position: 'relative' }}>

        {/* Grid background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div style={{ animation: 'fadeUp 0.6s ease both', position: 'relative' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '999px', padding: '0.35rem 1.2rem', marginBottom: '2rem', letterSpacing: '0.1em', background: 'rgba(16,185,129,0.06)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            BUILT ON STELLAR · SOROBAN ESCROW
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.2rem' }}>
            Fund with<br />
            <span style={{ background: 'linear-gradient(135deg, #10b981, #34d399, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Proof, Not Faith
            </span>
          </h1>

          {/* Subheading */}
          <p style={{ fontSize: '1.1rem', color: '#4b7a63', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            FlowFund releases payments only when milestones are delivered and verified — trustless, transparent, and on-chain.
          </p>
        </div>

        {/* Step 1 - Connect Wallet */}
        {!wallet && (
          <div style={{ animation: 'fadeUp 0.6s ease 0.15s both', position: 'relative' }}>
            <div style={{ color: '#4b7a63', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', marginBottom: '1rem', letterSpacing: '0.1em' }}>
              STEP 1 — CONNECT YOUR WALLET
            </div>
            <WalletButton wallet={wallet} setWallet={setWallet} />
          </div>
        )}

        {/* Step 2 - Select Role */}
        {wallet && !role && (
          <div style={{ animation: 'fadeUp 0.5s ease both', position: 'relative' }}>
            <div style={{ color: '#4b7a63', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
              STEP 2 — SELECT YOUR ROLE
            </div>
            <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <RoleCard
                icon="🎨"
                title="I am a Creator"
                desc="Create projects, submit milestone proofs and receive funds"
                color="#10b981"
                points={['Create milestone projects', 'Upload proof for each milestone', 'Receive XLM on approval']}
                onClick={() => onRoleSelect('creator')}
              />
              <RoleCard
                icon="💎"
                title="I am a Funder"
                desc="Review milestone proofs and release payments to creators"
                color="#34d399"
                points={['View all creator projects', 'Review milestone submissions', 'Send XLM on approval']}
                onClick={() => onRoleSelect('funder')}
              />
            </div>
          </div>
        )}

        {/* Already has role */}
        {wallet && role && (
          <div style={{ animation: 'fadeUp 0.5s ease both', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', position: 'relative' }}>
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '0.8rem 1.5rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block' }} />
              Connected as {role.toUpperCase()} ✅
            </div>
            <button
              onClick={() => nav(role)}
              style={{ padding: '0.9rem 2.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.1))', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(52,211,153,0.15))'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(16,185,129,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.1))'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              Go to {role === 'creator' ? 'Creator Dashboard' : 'Funder Dashboard'} →
            </button>
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#10b981', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>HOW IT WORKS</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.8rem' }}>Built for Trust</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{ background: 'rgba(4,26,16,0.8)', border: '1px solid rgba(13,61,37,0.8)', borderRadius: '16px', padding: '1.8rem', animation: 'fadeUp 0.5s ease both', animationDelay: `${i * 0.1}s`, transition: 'all 0.25s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(16,185,129,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(16,185,129,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(13,61,37,0.8)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#ecfdf5' }}>{f.title}</div>
              <div style={{ color: '#4b7a63', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '3rem 2rem', borderTop: '1px solid rgba(13,61,37,0.8)', borderBottom: '1px solid rgba(13,61,37,0.8)', display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', background: 'rgba(4,26,16,0.4)' }}>
        {[['3', 'Projects Funded'], ['2.5K XLM', 'Total Released'], ['5+', 'Testnet Users'], ['100%', 'On-Chain']].map(([val, lbl]) => (
          <div key={lbl} style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: '2rem', background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{val}</div>
            <div style={{ color: '#4b7a63', fontSize: '0.85rem', fontFamily: 'DM Mono, monospace' }}>{lbl}</div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '2rem', textAlign: 'center', color: '#4b7a63', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', borderTop: '1px solid rgba(13,61,37,0.4)' }}>
        <span style={{ color: '#10b981' }}>⬡ FlowFund</span> — Built on Stellar · Soroban Smart Contracts · Testnet
      </footer>

    </div>
  )
}

function RoleCard({ icon, title, desc, color, points, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ background: `rgba(16,185,129,0.05)`, border: `1px solid rgba(16,185,129,0.2)`, borderRadius: '20px', padding: '2rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.25s', width: '260px', fontFamily: 'Syne, sans-serif' }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `rgba(16,185,129,0.1)`
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 20px 40px rgba(16,185,129,0.15)`
        e.currentTarget.style.border = `1px solid rgba(16,185,129,0.4)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `rgba(16,185,129,0.05)`
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.border = `1px solid rgba(16,185,129,0.2)`
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: '1.1rem', color, marginBottom: '0.4rem' }}>{title}</div>
      <div style={{ color: '#4b7a63', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>{desc}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {points.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#4b7a63' }}>
            <span style={{ color: '#10b981', fontSize: '0.7rem' }}>✓</span> {p}
          </div>
        ))}
      </div>
    </button>
  )
}