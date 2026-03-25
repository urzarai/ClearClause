import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

function ScaleVisual() {
  const leftRef  = useRef(null)
  const rightRef = useRef(null)
  const armRef   = useRef(null)
  const { theme } = useTheme()

  const isDark = theme === 'dark'

  const c = {
    ring:      isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
    ringDash:  isDark ? 'rgba(37,99,235,0.1)'    : 'rgba(37,99,235,0.15)',
    dot:       isDark ? 'rgba(255,255,255,0.07)'  : 'rgba(0,0,0,0.06)',
    column:    isDark ? 'rgba(255,255,255,0.12)'  : 'rgba(0,0,0,0.14)',
    tick:      isDark ? 'rgba(255,255,255,0.2)'   : 'rgba(0,0,0,0.18)',
    arm:       isDark ? 'rgba(255,255,255,0.5)'   : 'rgba(0,0,0,0.45)',
    chain:     isDark ? 'rgba(255,255,255,0.22)'  : 'rgba(0,0,0,0.18)',
    pan:       isDark ? 'rgba(255,255,255,0.04)'  : 'rgba(0,0,0,0.04)',
    panStroke: isDark ? 'rgba(255,255,255,0.28)'  : 'rgba(0,0,0,0.22)',
    label:     isDark ? 'rgba(255,255,255,0.2)'   : 'rgba(0,0,0,0.28)',
    corner:    isDark ? 'rgba(255,255,255,0.14)'  : 'rgba(0,0,0,0.14)',
    scan:      isDark ? 'rgba(37,99,235,0.08)'    : 'rgba(37,99,235,0.06)',
    base:      isDark ? 'rgba(255,255,255,0.06)'  : 'rgba(0,0,0,0.06)',
    baseStroke:isDark ? 'rgba(255,255,255,0.18)'  : 'rgba(0,0,0,0.16)',
  }

  useEffect(() => {
    let t = 0
    const id = setInterval(() => {
      t += 0.018
      const tilt = Math.sin(t) * 9
      if (armRef.current)  armRef.current.setAttribute('transform', `rotate(${tilt},190,118)`)
      if (leftRef.current) leftRef.current.setAttribute('transform', `translate(${-Math.sin(t)*10},${Math.abs(Math.sin(t))*8})`)
      if (rightRef.current)rightRef.current.setAttribute('transform',`translate(${Math.sin(t)*10},${Math.abs(Math.sin(t))*8})`)
    }, 25)
    return () => clearInterval(id)
  }, [])

  return (
    <svg
      viewBox="0 0 380 420" width="380" height="420" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: isDark ? 'drop-shadow(0 0 40px rgba(37,99,235,0.15))' : 'drop-shadow(0 0 30px rgba(37,99,235,0.1))' }}
      role="img" aria-label="ClearClause balance scale illustration"
    >
      {/* Rings */}
      <circle cx="190" cy="210" r="178" stroke={c.ring}     strokeWidth="1"/>
      <circle cx="190" cy="210" r="148" stroke={c.ring}     strokeWidth="1"/>
      <circle cx="190" cy="210" r="118" stroke={c.ringDash} strokeWidth="1" strokeDasharray="4 8"/>

      {/* Background dots */}
      {Array.from({length:8},(_,row)=>Array.from({length:8},(_,col)=>{
        const x=70+col*36, y=70+row*36, dx=x-190, dy=y-210
        if(dx*dx+dy*dy>170*170)return null
        return <circle key={`${row}-${col}`} cx={x} cy={y} r="1" fill={c.dot}/>
      }))}

      {/* Column */}
      <line x1="190" y1="80"  x2="190" y2="370" stroke={c.column} strokeWidth="1.5"/>
      {[100,130,160,190,220,250,280,310,340].map(y=>(
        <line key={y} x1="185" y1={y} x2="195" y2={y} stroke={c.tick} strokeWidth="1"/>
      ))}

      {/* Base */}
      <rect x="152" y="368" width="76" height="6"  rx="1" fill={c.base} stroke={c.baseStroke} strokeWidth="0.5"/>
      <rect x="166" y="360" width="48" height="10" rx="1" fill={c.base} stroke={c.ring}       strokeWidth="0.5"/>

      {/* Pivot */}
      <circle cx="190" cy="118" r="5" fill="#2563eb" opacity="0.9"/>
      <circle cx="190" cy="118" r="8" stroke="#2563eb" strokeWidth="1" opacity="0.3"/>

      {/* Arm */}
      <g ref={armRef}>
        <line x1="70" y1="118" x2="310" y2="118" stroke={c.arm} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="190" y1="108" x2="190" y2="128" stroke="#2563eb" strokeWidth="1.5"/>
      </g>

      {/* Left pan */}
      <g ref={leftRef}>
        <line x1="70" y1="118" x2="68" y2="175" stroke={c.chain} strokeWidth="1" strokeDasharray="3 3"/>
        <line x1="68" y1="175" x2="48" y2="195" stroke={c.chain} strokeWidth="1"/>
        <line x1="68" y1="175" x2="88" y2="195" stroke={c.chain} strokeWidth="1"/>
        <ellipse cx="68" cy="197" rx="28" ry="5" fill={c.pan} stroke={c.panStroke} strokeWidth="1"/>
        <path d="M40 197 Q68 210 96 197" stroke={c.ring} strokeWidth="1" fill="none"/>
        <rect x="58" y="174" width="20" height="16" rx="2" fill="rgba(37,99,235,0.18)" stroke="rgba(37,99,235,0.45)" strokeWidth="0.8"/>
        <line x1="62" y1="179" x2="74" y2="179" stroke="rgba(37,99,235,0.55)" strokeWidth="0.8"/>
        <line x1="62" y1="182" x2="74" y2="182" stroke="rgba(37,99,235,0.55)" strokeWidth="0.8"/>
        <line x1="62" y1="185" x2="70" y2="185" stroke="rgba(37,99,235,0.55)" strokeWidth="0.8"/>
        <text x="68" y="207" textAnchor="middle" fontSize="7" fill={c.label} fontFamily="Courier New">CLAUSE</text>
      </g>

      {/* Right pan */}
      <g ref={rightRef}>
        <line x1="310" y1="118" x2="312" y2="175" stroke={c.chain} strokeWidth="1" strokeDasharray="3 3"/>
        <line x1="312" y1="175" x2="292" y2="195" stroke={c.chain} strokeWidth="1"/>
        <line x1="312" y1="175" x2="332" y2="195" stroke={c.chain} strokeWidth="1"/>
        <ellipse cx="312" cy="197" rx="28" ry="5" fill={c.pan} stroke={c.panStroke} strokeWidth="1"/>
        <path d="M284 197 Q312 210 340 197" stroke={c.ring} strokeWidth="1" fill="none"/>
        <rect x="302" y="174" width="20" height="16" rx="2" fill="rgba(34,197,94,0.14)" stroke="rgba(34,197,94,0.38)" strokeWidth="0.8"/>
        <polyline points="306,182 310,186 318,178" stroke="rgba(34,197,94,0.75)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="312" y="207" textAnchor="middle" fontSize="7" fill={c.label} fontFamily="Courier New">CLARITY</text>
      </g>

      {/* Corner markers */}
      {[[22,22],[358,22],[22,398],[358,398]].map(([x,y],i)=>(
        <g key={i}>
          <line x1={x} y1={y} x2={x+(x<190?12:-12)} y2={y} stroke={c.corner} strokeWidth="1"/>
          <line x1={x} y1={y} x2={x} y2={y+(y<210?12:-12)} stroke={c.corner} strokeWidth="1"/>
        </g>
      ))}

      <text x="190" y="345" textAnchor="middle" fontSize="9" fill={c.label} letterSpacing="6" fontFamily="Courier New">CLEARCLAUSE</text>
      <line x1="12" y1="210" x2="368" y2="210" stroke={c.scan} strokeWidth="1"/>
    </svg>
  )
}

export default ScaleVisual