import { useState } from 'react'
import * as StellarSdk from '@stellar/stellar-sdk'
import MilestoneCard from '../components/MilestoneCard'

export default function Funder({ wallet, projects, setProjects }) {
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)
  const [sending, setSending] = useState(false)
  const [fundModal, setFundModal] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 5000)
  }

  const sendXLM = async (toAddress, amount) => {
  try {
    const freighterModule = await import('@stellar/freighter-api')
    const freighter = freighterModule.default || freighterModule

    // Check connection
    const connResult = await freighter.isConnected()
    if (!connResult?.isConnected) {
      showToast('Freighter not connected!', 'error')
      return false
    }

    // Get address
    const addrResult = await freighter.getAddress()
    const publicKey = addrResult?.address
    if (!publicKey) {
      showToast('Could not get wallet address.', 'error')
      return false
    }

    console.log('Sending from:', publicKey)
    console.log('Sending to:', toAddress)
    console.log('Amount:', amount)

    showToast('Building transaction...')

    const server = new StellarSdk.Horizon.Server(
      'https://horizon-testnet.stellar.org'
    )

    // Load account
    const sourceAccount = await server.loadAccount(publicKey)
    console.log('Account loaded:', sourceAccount.accountId())

    // Use fixed fee
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: toAddress,
          asset: StellarSdk.Asset.native(),
          amount: String(amount),
        })
      )
      .setTimeout(180)
      .build()

    console.log('Transaction built, XDR:', transaction.toXDR().slice(0, 50))

    showToast('Please confirm in Freighter...')

    // Sign with Freighter
    const signResult = await freighter.signTransaction(
      transaction.toXDR(),
      {
        networkPassphrase: StellarSdk.Networks.TESTNET,
        address: publicKey,
      }
    )

    console.log('Signed:', signResult)

    if (signResult?.error) {
      showToast('Signing failed: ' + signResult.error, 'error')
      return false
    }

    const signedXDR = signResult?.signedTxXdr || signResult

    // Submit transaction
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXDR,
      StellarSdk.Networks.TESTNET
    )

    showToast('Submitting transaction...')
    const result = await server.submitTransaction(signedTx)
    console.log('Transaction hash:', result.hash)

    showToast('XLM sent! TX: ' + result.hash.slice(0, 16) + '...')
    return true

  } catch (err) {
    console.error('Full error:', err)

    // Get detailed error from Stellar
    if (err?.response?.data?.extras?.result_codes) {
      const codes = err.response.data.extras.result_codes
      console.error('Result codes:', codes)
      showToast('Transaction error: ' + JSON.stringify(codes), 'error')
    } else if (err.message?.includes('cancel') || err.message?.includes('decline')) {
      showToast('Transaction cancelled.', 'error')
    } else {
      showToast('Error: ' + (err.message || 'Failed'), 'error')
    }
    return false
  }
}

  const handleApprove = (projId, mIdx) => {
    const project = projects.find(p => p.id === projId)
    if (!project) return
    const xlmAmount = Number((project.totalXLM / project.milestones.length).toFixed(2))
    setFundModal({ projId, mIdx, creatorAddress: project.creator, amount: xlmAmount })
  }

  const confirmFund = async () => {
    if (!fundModal) return
    const { projId, mIdx, creatorAddress, amount } = fundModal
    setFundModal(null)
    setSending(true)
    const success = await sendXLM(creatorAddress, amount)
    if (success) {
      setProjects(ps => ps.map(p => {
        if (p.id !== projId) return p
        const updated = p.milestones.map((m, i) =>
          i !== mIdx ? m : { ...m, status: 'approved' }
        )
        const allDone = updated.every(m => m.status === 'approved')
        return { ...p, milestones: updated, funded: allDone, completedAt: allDone ? new Date().toISOString().slice(0, 10) : null }
      }))
      setSelected(p => p ? {
        ...p,
        milestones: p.milestones.map((m, i) =>
          i !== mIdx ? m : { ...m, status: 'approved' }
        )
      } : p)
    }
    setSending(false)
  }

  const reject = (projId, mIdx) => {
    setProjects(ps => ps.map(p =>
      p.id !== projId ? p : {
        ...p,
        milestones: p.milestones.map((m, i) =>
          i !== mIdx ? m : { ...m, status: 'rejected' }
        )
      }
    ))
    setSelected(p => p ? {
      ...p,
      milestones: p.milestones.map((m, i) =>
        i !== mIdx ? m : { ...m, status: 'rejected' }
      )
    } : p)
    showToast('Milestone rejected.', 'error')
  }

  const pendingProjects = projects.filter(p => !p.funded)

  if (!wallet) return (
    <Wrap>
      <div style={{ textAlign: 'center', color: '#5a7090', paddingTop: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <p>Connect your wallet to review projects.</p>
      </div>
    </Wrap>
  )

  return (
    <Wrap>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {sending && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0f1520', border: '1px solid rgba(0,229,255,0.3)', borderRadius: '16px', padding: '2.5rem 3rem', textAlign: 'center', maxWidth: '320px' }}>
            <div style={{ width: 44, height: 44, border: '3px solid #00e5ff22', borderTop: '3px solid #00e5ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.2rem' }} />
            <div style={{ color: '#00e5ff', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem' }}>Sending XLM...</div>
            <div style={{ color: '#5a7090', fontSize: '0.85rem' }}>Please confirm in Freighter popup</div>
          </div>
        </div>
      )}

      {fundModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0f1520', border: '1px solid rgba(0,229,255,0.25)', borderRadius: '20px', padding: '2rem', maxWidth: '420px', width: '100%', animation: 'fadeUp 0.3s ease both' }}>
            <div style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: '1.2rem' }}>Confirm Payment</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <InfoRow label="From (You)" value={wallet.slice(0, 10) + '...' + wallet.slice(-6)} />
              <InfoRow label="To (Creator)" value={fundModal.creatorAddress.slice(0, 10) + '...' + fundModal.creatorAddress.slice(-6)} />
              <InfoRow label="Amount" value={fundModal.amount + ' XLM'} highlight />
              <InfoRow label="Network" value="Stellar Testnet" />
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '0.8rem 1rem', color: '#f59e0b', fontSize: '0.82rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Freighter will open to confirm. Make sure your wallet is unlocked and set to Testnet.
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button onClick={() => setFundModal(null)} style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', background: 'transparent', border: '1px solid #1e2d45', color: '#5a7090', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={confirmFund} style={{ flex: 2, padding: '0.8rem', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(0,229,255,0.1))', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}>
                Confirm & Send {fundModal.amount} XLM
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#7c3aed', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>FUNDER DASHBOARD</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.3rem' }}>Review Projects</h2>
        <p style={{ color: '#5a7090', marginBottom: '2rem' }}>Review milestone submissions and send XLM via Freighter on approval.</p>

        {pendingProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#5a7090', border: '1px dashed #1e2d45', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💤</div>
            <p>No active projects awaiting review.</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {pendingProjects.map(p => {
              const submitted = p.milestones.filter(m => m.status === 'submitted').length
              const approved = p.milestones.filter(m => m.status === 'approved').length
              const isSelected = selected?.id === p.id
              return (
                <button key={p.id} onClick={() => setSelected(projects.find(x => x.id === p.id))}
                  style={{ background: isSelected ? 'rgba(124,58,237,0.12)' : '#0f1520', border: `1px solid ${isSelected ? 'rgba(124,58,237,0.4)' : '#1e2d45'}`, borderRadius: '14px', padding: '1.1rem 1.2rem', textAlign: 'left', cursor: 'pointer', fontFamily: 'Syne, sans-serif', color: '#e8edf5', transition: 'all 0.2s' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.3rem', fontSize: '0.95rem' }}>{p.title}</div>
                  {p.description && <div style={{ color: '#5a7090', fontSize: '0.8rem', marginBottom: '0.4rem' }}>{p.description.slice(0, 60)}...</div>}
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#5a7090', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#f59e0b' }}>{submitted} pending</span>
                    <span style={{ color: '#10b981' }}>{approved}/{p.milestones.length} done</span>
                    <span>{p.totalXLM} XLM</span>
                  </div>
                </button>
              )
            })}
          </div>

          {selected && (
            <div style={{ flex: '2 1 340px', animation: 'fadeUp 0.35s ease both' }}>
              <div style={{ background: '#0f1520', border: '1px solid #1e2d45', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.3rem' }}>{selected.title}</div>
                {selected.description && <div style={{ color: '#5a7090', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.8rem' }}>{selected.description}</div>}
                {selected.projectUrl && (
                  <a href={selected.projectUrl} target="_blank" rel="noreferrer" style={{ color: '#00e5ff', fontSize: '0.8rem', fontFamily: 'DM Mono, monospace', textDecoration: 'none', display: 'inline-block', marginBottom: '0.8rem', borderBottom: '1px dashed #00e5ff44' }}>
                    🔗 {selected.projectUrl}
                  </a>
                )}
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#5a7090', marginBottom: '0.4rem', wordBreak: 'break-all' }}>
                  Creator: {selected.creator}
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#00e5ff', marginBottom: '1.2rem' }}>
                  {selected.totalXLM} XLM total · {(selected.totalXLM / selected.milestones.length).toFixed(2)} XLM per milestone
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {projects.find(p => p.id === selected.id)?.milestones.map((m, i) => (
                    <MilestoneCard key={i} milestone={m} index={i} isFunder={true}
                      onApprove={() => handleApprove(selected.id, i)}
                      onReject={() => reject(selected.id, i)} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrap>
  )
}

function InfoRow({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: '#161e2e', borderRadius: '8px' }}>
      <span style={{ color: '#5a7090', fontSize: '0.82rem', fontFamily: 'DM Mono, monospace' }}>{label}</span>
      <span style={{ color: highlight ? '#10b981' : '#e8edf5', fontWeight: highlight ? 800 : 600, fontSize: '0.85rem', fontFamily: 'DM Mono, monospace' }}>{value}</span>
    </div>
  )
}

function Wrap({ children }) {
  return <div style={{ paddingTop: '88px', minHeight: '100vh', padding: '88px 2rem 4rem' }}>{children}</div>
}

function Toast({ msg, type }) {
  return (
    <div style={{ position: 'fixed', top: '80px', right: '1.5rem', background: type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`, color: type === 'success' ? '#10b981' : '#ef4444', padding: '0.75rem 1.2rem', borderRadius: '10px', zIndex: 999, fontWeight: 600, fontSize: '0.9rem', maxWidth: '360px' }}>
      {msg}
    </div>
  )
}