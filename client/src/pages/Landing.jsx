import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ScaleVisual from '../components/ScaleVisual'
import ThemeToggle from '../components/ThemeToggle'

const FEATURES = ['CLAUSE EXTRACTION','RISK RATING','SAFETY SCORE','PDF REPORT']
const TICKS    = Array.from({length: 18})

function Landing() {
  const navigate         = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleAnalyse = () => navigate(isAuthenticated ? '/upload' : '/login')
  const handleLogin   = () => navigate('/login')
  const handleSignup  = () => navigate('/register')

  return (
    <div className="landing">
      <div className="landing-grid" aria-hidden="true"/>
      <div className="landing-noise" aria-hidden="true"/>

      <div className="landing-rule" aria-hidden="true">
        {TICKS.map((_,i) => <div key={i} className="landing-rule-tick"/>)}
      </div>

      {/* Nav */}
      <nav className="landing-nav" aria-label="Site navigation">
        <div className="landing-nav-logo">
          <div className="landing-nav-logo-mark" aria-hidden="true">CC</div>
          CLEARCLAUSE
        </div>

        <div className="landing-nav-links">
          {isAuthenticated ? (
            <ThemeToggle variant="landing" />
          ) : (
            <>
              <button className="landing-nav-btn"  onClick={handleSignup}>GET STARTED</button>
            </>
          )}
        </div>
      </nav>

      {/* Body */}
      <main className="landing-body">
        <div className="landing-left">
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
            <button
              className="landing-cta"
              onClick={handleAnalyse}
              aria-label={isAuthenticated ? 'Go to document upload' : 'Sign in to analyse a document'}
            >
              ANALYSE A DOCUMENT →
            </button>
            {!isAuthenticated && (
              <button className="landing-cta-secondary" onClick={handleLogin}>
                LOG IN
              </button>
            )}
          </div>

          <div className="landing-features" role="list" aria-label="Features">
            {FEATURES.map(f => (
              <div key={f} className="landing-feature" role="listitem">
                <div className="landing-feature-dot" aria-hidden="true"/>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="landing-right" aria-hidden="true">
          <ScaleVisual />
        </div>
      </main>
    </div>
  )
}

export default Landing