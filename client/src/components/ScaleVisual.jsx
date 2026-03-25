import { useEffect, useRef } from 'react'

function ScaleVisual() {
  const leftRef  = useRef(null)
  const rightRef = useRef(null)
  const armRef   = useRef(null)
  const tickRef  = useRef(null)

  useEffect(() => {
    let t = 0
    const id = setInterval(() => {
      t += 0.018
      const tilt = Math.sin(t) * 9
      if (armRef.current)   armRef.current.setAttribute('transform',  `rotate(${tilt}, 190, 118)`)
      if (leftRef.current)  leftRef.current.setAttribute('transform', `translate(${-Math.sin(t) * 10}, ${Math.abs(Math.sin(t)) * 8})`)
      if (rightRef.current) rightRef.current.setAttribute('transform',`translate(${Math.sin(t) * 10}, ${Math.abs(Math.sin(t)) * 8})`)
      if (tickRef.current)  tickRef.current.setAttribute('transform', `rotate(${-tilt * 0.5}, 190, 118)`)
    }, 25)
    return () => clearInterval(id)
  }, [])

  return (
    <svg
      viewBox="0 0 380 420"
      width="380" height="420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 40px rgba(37,99,235,0.15))' }}
    >
      {/* Outer rings */}
      <circle cx="190" cy="210" r="178" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      <circle cx="190" cy="210" r="148" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
      <circle cx="190" cy="210" r="118" stroke="rgba(37,99,235,0.08)"   strokeWidth="1" strokeDasharray="4 8"/>

      {/* Dot grid in background */}
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) => {
          const x = 70 + col * 36
          const y = 70 + row * 36
          const dx = x - 190, dy = y - 210
          if (dx * dx + dy * dy > 170 * 170) return null
          return <circle key={`${row}-${col}`} cx={x} cy={y} r="1" fill="rgba(255,255,255,0.08)" />
        })
      )}

      {/* Vertical column */}
      <line x1="190" y1="80"  x2="190" y2="370" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>

      {/* Column detail marks */}
      {[100,130,160,190,220,250,280,310,340].map(y => (
        <line key={y} x1="185" y1={y} x2="195" y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      ))}

      {/* Base */}
      <rect x="152" y="368" width="76" height="6"  rx="1" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5"/>
      <rect x="166" y="360" width="48" height="10" rx="1" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"  strokeWidth="0.5"/>

      {/* Pivot circle */}
      <circle cx="190" cy="118" r="5" fill="#2563eb" opacity="0.9"/>
      <circle cx="190" cy="118" r="8" stroke="#2563eb" strokeWidth="1" opacity="0.3"/>

      {/* Arm */}
      <g ref={armRef}>
        <line x1="70" y1="118" x2="310" y2="118" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Tick mark at center */}
        <line ref={tickRef} x1="190" y1="108" x2="190" y2="128" stroke="#2563eb" strokeWidth="1.5"/>
      </g>

      {/* Left pan chain */}
      <g ref={leftRef}>
        <line x1="70"  y1="118" x2="68"  y2="175" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3"/>
        <line x1="68"  y1="175" x2="48"  y2="195" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
        <line x1="68"  y1="175" x2="88"  y2="195" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
        {/* Left pan */}
        <ellipse cx="68" cy="197" rx="28" ry="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        <path d="M40 197 Q68 210 96 197" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none"/>
        {/* Document icon in pan */}
        <rect x="58" y="174" width="20" height="16" rx="2" fill="rgba(37,99,235,0.2)" stroke="rgba(37,99,235,0.5)" strokeWidth="0.8"/>
        <line x1="62" y1="179" x2="74" y2="179" stroke="rgba(37,99,235,0.6)" strokeWidth="0.8"/>
        <line x1="62" y1="182" x2="74" y2="182" stroke="rgba(37,99,235,0.6)" strokeWidth="0.8"/>
        <line x1="62" y1="185" x2="70" y2="185" stroke="rgba(37,99,235,0.6)" strokeWidth="0.8"/>
        <text x="68" y="201" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="Courier New">CLAUSE</text>
      </g>

      {/* Right pan chain */}
      <g ref={rightRef}>
        <line x1="310" y1="118" x2="312" y2="175" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3"/>
        <line x1="312" y1="175" x2="292" y2="195" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
        <line x1="312" y1="175" x2="332" y2="195" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
        {/* Right pan */}
        <ellipse cx="312" cy="197" rx="28" ry="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        <path d="M284 197 Q312 210 340 197" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none"/>
        {/* Checkmark / clarity icon in pan */}
        <rect x="302" y="174" width="20" height="16" rx="2" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.4)" strokeWidth="0.8"/>
        <polyline points="306,182 310,186 318,178" stroke="rgba(34,197,94,0.8)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="312" y="201" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="Courier New">CLARITY</text>
      </g>

      {/* Corner markers */}
      {[[22,22],[358,22],[22,398],[358,398]].map(([x,y],i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x + (x < 190 ? 12 : -12)} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          <line x1={x} y1={y} x2={x} y2={y + (y < 210 ? 12 : -12)} stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        </g>
      ))}

      {/* Label: CLEARCLAUSE */}
      <text x="190" y="340" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.2)" letterSpacing="6" fontFamily="Courier New">CLEARCLAUSE</text>

      {/* Scanning line animation */}
      <line x1="12" y1="210" x2="368" y2="210" stroke="rgba(37,99,235,0.08)" strokeWidth="1"/>
    </svg>
  )
}

export default ScaleVisual