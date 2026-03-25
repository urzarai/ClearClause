import { useState } from 'react'

const RISK_CONFIG = {
  High:   { color: 'var(--danger)',  bg: 'var(--danger-subtle)',  label: 'High Risk' },
  Medium: { color: 'var(--warning)', bg: 'var(--warning-subtle)', label: 'Medium Risk' },
  Low:    { color: 'var(--success)', bg: 'var(--success-subtle)', label: 'Low Risk' },
}

const ChevronIcon = ({ open }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

function ClauseCard({ clause, index }) {
  const [open, setOpen] = useState(false)
  const risk = RISK_CONFIG[clause.riskLevel] || RISK_CONFIG.Low

  const sectionLabel = clause.section?.length > 40
    ? clause.section.substring(0, 40) + '…'
    : clause.section

  return (
    <div className={`clause-card risk-${clause.riskLevel?.toLowerCase()}`}>
      <div className="clause-header" onClick={() => setOpen(o => !o)}>
        <span style={{
          width: '24px', height: '24px', borderRadius: '50%',
          background: 'var(--bg-tertiary)', color: 'var(--text-muted)',
          fontSize: '11px', fontWeight: '600', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {index + 1}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '2px' }}>
            {sectionLabel}
          </div>
          <div style={{
            fontSize: '0.875rem', color: 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {clause.plainEnglish || clause.originalText}
          </div>
        </div>

        <span style={{
          padding: '3px 10px', borderRadius: '20px',
          fontSize: '11px', fontWeight: '600', flexShrink: 0,
          background: risk.bg, color: risk.color,
        }}>
          {risk.label}
        </span>

        <ChevronIcon open={open} />
      </div>

      <div className={`clause-body ${open ? 'open' : ''}`}>
        <div className="clause-original">
          <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Original text
          </div>
          {clause.originalText}
        </div>
        <div className="clause-plain">
          <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Plain English
          </div>
          <p style={{ marginBottom: clause.riskReason ? '0.75rem' : 0 }}>
            {clause.plainEnglish}
          </p>
          {clause.riskReason && (
            <p className="clause-risk-reason">
              ⚠ {clause.riskReason}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClauseCard