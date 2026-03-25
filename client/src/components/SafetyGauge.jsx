function SafetyGauge({ score }) {
  const radius = 54
  const stroke = 8
  const normalised = radius - stroke / 2
  const circumference = 2 * Math.PI * normalised
  const progress = circumference - (score / 100) * circumference

  const color = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)'
  const label = score >= 75 ? 'Safe' : score >= 50 ? 'Review Advised' : 'High Risk'
  const bg = score >= 75 ? 'var(--success-subtle)' : score >= 50 ? 'var(--warning-subtle)' : 'var(--danger-subtle)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px' }}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="65" cy="65" r={normalised}
            fill="none"
            stroke="var(--bg-tertiary)"
            strokeWidth={stroke}
          />
          <circle
            cx="65" cy="65" r={normalised}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.75rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>/ 100</span>
        </div>
      </div>
      <span style={{
        fontSize: '0.8rem', fontWeight: '600',
        padding: '4px 14px', borderRadius: '20px',
        background: bg, color: color,
      }}>
        {label}
      </span>
    </div>
  )
}

export default SafetyGauge