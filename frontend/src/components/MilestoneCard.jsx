const STATUS_STYLE = {
  pending:   { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  color: '#f59e0b', label: '⏳ Pending' },
  submitted: { bg: 'rgba(0,229,255,0.08)',   border: 'rgba(0,229,255,0.25)',   color: '#00e5ff', label: '📤 Submitted' },
  approved:  { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  color: '#10b981', label: '✅ Approved' },
  rejected:  { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   color: '#ef4444', label: '❌ Rejected' },
}

export default function MilestoneCard({ milestone, index, onApprove, onReject, isFunder, onSubmit }) {
  const st = STATUS_STYLE[milestone.status] || STATUS_STYLE.pending

  return (
    <div style={{ background: st.bg, border: `1px solid ${st.border}`, borderRadius: '14px', padding: '1.2rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeUp 0.4s ease both', animationDelay: `${index * 0.07}s` }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: `${st.color}22`, border: `1px solid ${st.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', color: st.color, fontFamily: 'DM Mono, monospace' }}>
            {index + 1}
          </span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{milestone.label}</span>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: st.color, fontFamily: 'DM Mono, monospace' }}>
          {st.label}
        </span>
      </div>

      {/* Photo preview — shown to BOTH creator and funder */}
      {milestone.photo && (
        <div style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${st.border}` }}>
          <img
            src={milestone.photo}
            alt="milestone proof"
            style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>
      )}

      {/* Submitted but no photo — show placeholder */}
      {milestone.status === 'submitted' && !milestone.photo && (
        <div style={{ background: 'rgba(0,229,255,0.05)', border: '1px dashed rgba(0,229,255,0.2)', borderRadius: '10px', padding: '1rem', textAlign: 'center', color: '#5a7090', fontSize: '0.82rem', fontFamily: 'DM Mono, monospace' }}>
          📎 Proof submitted — image only visible in same session
        </div>
      )}

      {/* Funder approve/reject buttons */}
      {isFunder && milestone.status === 'submitted' && (
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={onApprove}
            style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}
          >
            ✓ Approve & Release
          </button>
          <button
            onClick={onReject}
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}
          >
            ✗
          </button>
        </div>
      )}

      {/* Creator submit button */}
      {!isFunder && (milestone.status === 'pending' || milestone.status === 'rejected') && onSubmit && (
        <button
          onClick={onSubmit}
          style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)', color: '#00e5ff', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Syne, sans-serif', cursor: 'pointer' }}
        >
          {milestone.status === 'rejected' ? '🔄 Resubmit Proof' : '+ Upload Proof & Submit'}
        </button>
      )}
    </div>
  )
}