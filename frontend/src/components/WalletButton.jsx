import { useState } from 'react'
import { isConnected, requestAccess, getPublicKey } from '@stellar/freighter-api'

export default function WalletButton({ wallet, setWallet }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [manual, setManual] = useState(false)
  const [address, setAddress] = useState('')

  const connect = async () => {
    setLoading(true)
    setError(null)
    try {
      const connected = await isConnected()
      if (!connected) {
        setManual(true)
        setLoading(false)
        return
      }
      await requestAccess()
      const publicKey = await getPublicKey()
      if (publicKey) {
        setWallet(publicKey)
      }
    } catch (err) {
      console.error(err)
      setManual(true)
    }
    setLoading(false)
  }

  const connectManual = () => {
    if (address.startsWith('G') && address.length === 56) {
      setWallet(address)
      setError(null)
      setManual(false)
    } else {
      setError('Invalid address. Must start with G and be 56 characters long.')
    }
  }

  if (wallet) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
        <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '10px', padding: '0.6rem 1.5rem', color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>
          Wallet Connected Successfully!
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '999px', padding: '0.5rem 1.2rem', color: '#10b981', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block' }} />
          {wallet.slice(0, 8)}...{wallet.slice(-8)}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem', width: '100%', maxWidth: '440px' }}>
      {!manual && (
        <button
          onClick={connect}
          disabled={loading}
          style={{ padding: '0.9rem 2.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: loading ? 'wait' : 'pointer', background: 'linear-gradient(135deg, #00e5ff22, #7c3aed22)', border: '1px solid #00e5ff66', color: '#00e5ff', transition: 'all 0.3s', letterSpacing: '0.02em', width: '100%' }}
        >
          {loading ? 'Connecting...' : 'Connect Freighter Wallet'}
        </button>
      )}

      {manual && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ color: '#f59e0b', fontSize: '0.82rem', textAlign: 'center', fontFamily: 'DM Mono, monospace', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '0.6rem 1rem' }}>
            Freighter not detected — enter your Stellar wallet address manually
          </div>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            style={{ width: '100%', background: '#0f1520', border: '1px solid #1e2d45', borderRadius: '10px', padding: '0.75rem 1rem', color: '#e8edf5', fontSize: '0.82rem', fontFamily: 'DM Mono, monospace', outline: 'none' }}
          />
          <button
            onClick={connectManual}
            style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', color: '#00e5ff', fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Connect with Address
          </button>
          <button
            onClick={() => { setManual(false); setError(null) }}
            style={{ padding: '0.5rem', borderRadius: '8px', background: 'transparent', border: '1px dashed #1e2d45', color: '#5a7090', fontFamily: 'Syne, sans-serif', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            Try Freighter again
          </button>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.7rem 1.2rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, maxWidth: '380px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <a href="https://freighter.app" target="_blank" rel="noreferrer" style={{ color: '#5a7090', fontSize: '0.75rem', fontFamily: 'DM Mono, monospace', textDecoration: 'none', borderBottom: '1px dashed #5a7090' }}>
        Get Freighter Wallet →
      </a>
    </div>
  )
}