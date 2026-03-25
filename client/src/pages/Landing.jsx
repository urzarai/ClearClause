import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ScaleVisual from '../components/ScaleVisual'

const FEATURES = [
  'CLAUSE EXTRACTION',
  'RISK RATING',
  'PLAIN ENGLISH',
  'SAFETY SCORE',
  'PDF REPORT',
]

const TICKS = Array.from({ length: 18 })

function Landing() {
  const navigate  = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleAnalyse = () => navigate(isAuthenticated ? '/upload' : '/login')
  const handleLogin   = () => navigate('/login')
  const handleSignup  = () => navigate('/register')

  return (
    <div className="landing">
      <div className="landing-grid" />
      <div className="landing-noise" />

      {/* Ruler marks on left edge */}
      <div className="landing-rule">
        {TICKS.map((_, i) => <div key={i} className="landing-rule-tick" />)}
      </div>

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="landing-nav-logo-mark">CC</div>
          CLEARCLAUSE
        </div>
        <div className="landing-nav-links">
          {!isAuthenticated ? (
            <>
              <button className="landing-nav-link" onClick={handleLogin}>SIGN IN</button>
              <button className="landing-nav-btn"  onClick={handleSignup}>GET STARTED</button>
            </>
          ) : (
            <button className="landing-nav-btn" onClick={() => navigate('/dashboard')}>DASHBOARD →</button>
          )}
        </div>
      </nav>

      {/* Body */}
      <div className="landing-body">
        <div className="landing-left">
          <div className="landing-eyebrow">001 — AI LEGAL ANALYSIS</div>

          <h1 className="landing-title">
            LEGAL<br/>
            DOCS,<br/>
            <span>DECODED.</span>
          </h1>

          <p className="landing-desc">
            Upload any legal document — rent agreement, employment contract, NDA,
            or loan document — and ClearClause breaks it down clause by clause,
            flags every risk, and rewrites it in plain English. In under 90 seconds.
          </p>

          <div className="landing-actions">
            <button className="landing-cta" onClick={handleAnalyse}>
              ANALYSE A DOCUMENT →
            </button>
            {!isAuthenticated && (
              <button className="landing-cta-secondary" onClick={handleLogin}>
                SIGN IN
              </button>
            )}
          </div>

          <div className="landing-features">
            {FEATURES.map(f => (
              <div key={f} className="landing-feature">
                <div className="landing-feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="landing-right">
          <ScaleVisual />
        </div>
      </div>

      {/* Status bar */}
      <div className="landing-statusbar">
        <span>SYSTEM.ACTIVE</span>
        <div className="landing-statusbar-right">
          <span>V1.0.0</span>
          <span>CLEARCLAUSE.AI</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>RENDERING</span>
            <div className="status-blink" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing