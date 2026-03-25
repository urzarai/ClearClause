 import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import SafetyGauge from '../components/SafetyGauge'
import ClauseCard from '../components/ClauseCard'

const POLL_INTERVAL = 4000

function ProcessingScreen({ fileName }) {
  const stages = [
    'Extracting clauses…',
    'Identifying risk terms…',
    'Generating plain English explanations…',
    'Computing safety score…',
  ]
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStage(s => (s + 1) % stages.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '16px',
        background: 'var(--accent-subtle)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.3rem' }}>
          Analysing {fileName}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {stages[stage]}
        </p>
        <div className="processing-pulse">
          <div className="processing-dot" />
          <div className="processing-dot" />
          <div className="processing-dot" />
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        This usually takes 30–90 seconds depending on document length.
      </p>
    </div>
  )
}

function ScoreBreakdown({ clauses }) {
  const counts = clauses.reduce((acc, c) => {
    acc[c.riskLevel] = (acc[c.riskLevel] || 0) + 1
    return acc
  }, {})

  const items = [
    { label: 'High Risk',   count: counts.High || 0,   color: 'var(--danger)',  bg: 'var(--danger-subtle)' },
    { label: 'Medium Risk', count: counts.Medium || 0, color: 'var(--warning)', bg: 'var(--warning-subtle)' },
    { label: 'Low Risk',    count: counts.Low || 0,    color: 'var(--success)', bg: 'var(--success-subtle)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {items.map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: item.bg, color: item.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '700', flexShrink: 0,
          }}>
            {item.count}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${clauses.length ? (item.count / clauses.length) * 100 : 0}%`,
                background: item.color, borderRadius: '3px', transition: 'width 0.8s ease',
              }} />
            </div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '80px', textAlign: 'right' }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function EntitiesPanel({ namedEntities, flaggedKeywords }) {
  if (!namedEntities && !flaggedKeywords?.length) return null

  const { parties = [], dates = [], amounts = [], jurisdictions = [] } = namedEntities || {}

  const sections = [
    { label: 'Parties', items: parties, color: 'var(--accent)', bg: 'var(--accent-subtle)' },
    { label: 'Dates', items: dates, color: 'var(--warning)', bg: 'var(--warning-subtle)' },
    { label: 'Amounts', items: amounts, color: 'var(--success)', bg: 'var(--success-subtle)' },
    { label: 'Jurisdictions', items: jurisdictions, color: 'var(--text-secondary)', bg: 'var(--bg-tertiary)' },
  ].filter(s => s.items.length > 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {sections.map(section => (
        <div key={section.label}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            {section.label}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {section.items.map((item, i) => (
              <span key={i} style={{
                padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                background: section.bg, color: section.color, border: `1px solid ${section.color}22`,
              }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}

      {flaggedKeywords?.length > 0 && (
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
            Flagged Legal Terms
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {flaggedKeywords.map((kw, i) => (
              <span key={i} style={{
                padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                background: 'var(--danger-subtle)', color: 'var(--danger)',
                border: '1px solid var(--danger)22',
              }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const FILTERS = ['All', 'High', 'Medium', 'Low']

function Results() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [expandAll, setExpandAll] = useState(false)
  const pollRef = useRef(null)

  const fetchDoc = async () => {
    try {
      const res = await api.get(`/documents/${id}`)
      setDoc(res.data)

      if (res.data.status === 'complete' || res.data.status === 'error') {
        clearInterval(pollRef.current)
      }
    } catch (err) {
      setError('Could not load document.')
      clearInterval(pollRef.current)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoc()
    pollRef.current = setInterval(fetchDoc, POLL_INTERVAL)
    return () => clearInterval(pollRef.current)
  }, [id])

  const filteredClauses = (doc?.clauses || []).filter(c =>
    filter === 'All' ? true : c.riskLevel === filter
  )

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
    </div>
  )

  if (error) return (
    <div style={{ maxWidth: '600px' }}>
      <div className="auth-error">{error}</div>
      <button onClick={() => navigate('/upload')} style={{ marginTop: '1rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
        ← Upload another document
      </button>
    </div>
  )

  if (!doc) return null

  if (doc.status === 'processing') {
    return <ProcessingScreen fileName={doc.fileName} />
  }

  if (doc.status === 'error') {
    return (
      <div style={{ maxWidth: '600px' }}>
        <div className="auth-error">
          Analysis failed: {doc.errorMessage || 'An unknown error occurred.'}
        </div>
        <button onClick={() => navigate('/upload')} style={{ marginTop: '1rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Try another document
        </button>
      </div>
    )
  }

  const highCount   = doc.clauses.filter(c => c.riskLevel === 'High').length
  const mediumCount = doc.clauses.filter(c => c.riskLevel === 'Medium').length
  const lowCount    = doc.clauses.filter(c => c.riskLevel === 'Low').length

  return (
    <div style={{ maxWidth: '960px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '0.5rem', padding: 0 }}
          >
            ← Dashboard
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' }}>
            {doc.fileName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {doc.clauses.length} clauses analysed · {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Top grid: score + summary */}
      <div className="results-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card gauge-wrap">
          <SafetyGauge score={doc.safetyScore ?? 0} />
          <div style={{ marginTop: '1.25rem', width: '100%' }}>
            <ScoreBreakdown clauses={doc.clauses} />
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              Executive Summary
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
              {doc.summary || 'Summary not available.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            {[
              { count: highCount, label: 'High', color: 'var(--danger)', bg: 'var(--danger-subtle)' },
              { count: mediumCount, label: 'Medium', color: 'var(--warning)', bg: 'var(--warning-subtle)' },
              { count: lowCount, label: 'Low', color: 'var(--success)', bg: 'var(--success-subtle)' },
            ].map(item => (
              <div key={item.label} style={{
                flex: 1, textAlign: 'center', padding: '0.6rem',
                borderRadius: 'var(--radius-md)',
                background: item.bg,
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: item.color }}>{item.count}</div>
                <div style={{ fontSize: '11px', color: item.color, opacity: 0.8 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Entities panel */}
      {(doc.namedEntities || doc.flaggedKeywords?.length > 0) && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <EntitiesPanel
            namedEntities={doc.namedEntities}
            flaggedKeywords={doc.flaggedKeywords}
          />
        </div>
      )}

      {/* Clause list */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>
            Clauses
            {filter !== 'All' && (
              <span style={{ marginLeft: '8px', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                — showing {filteredClauses.length} of {doc.clauses.length}
              </span>
            )}
          </h2>
          <button
            onClick={() => setExpandAll(e => !e)}
            style={{ background: 'none', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', padding: '4px 12px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            {expandAll ? 'Collapse all' : 'Expand all'}
          </button>
        </div>

        <div className="filter-bar">
          {FILTERS.map(f => {
            const isActive = filter === f
            const activeClass = isActive
              ? f === 'All' ? 'active'
              : f === 'High' ? 'active-high'
              : f === 'Medium' ? 'active-medium'
              : 'active-low'
              : ''
            return (
              <button
                key={f}
                className={`filter-btn ${isActive ? activeClass : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'All' ? `All (${doc.clauses.length})` : `${f} (${f === 'High' ? highCount : f === 'Medium' ? mediumCount : lowCount})`}
              </button>
            )
          })}
        </div>

        {filteredClauses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No {filter.toLowerCase()} risk clauses found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredClauses.map((clause, i) => (
              <ExpandableClauseCard
                key={i}
                clause={clause}
                index={doc.clauses.indexOf(clause)}
                forceOpen={expandAll}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ExpandableClauseCard({ clause, index, forceOpen }) {
  const [localOpen, setLocalOpen] = useState(false)
  const open = forceOpen || localOpen

  const risk = {
    High:   { color: 'var(--danger)',  bg: 'var(--danger-subtle)',  label: 'High Risk' },
    Medium: { color: 'var(--warning)', bg: 'var(--warning-subtle)', label: 'Medium Risk' },
    Low:    { color: 'var(--success)', bg: 'var(--success-subtle)', label: 'Low Risk' },
  }[clause.riskLevel] || { color: 'var(--text-muted)', bg: 'var(--bg-tertiary)', label: 'Unknown' }

  const sectionLabel = clause.section?.length > 45
    ? clause.section.substring(0, 45) + '…'
    : clause.section

  return (
    <div className={`clause-card risk-${clause.riskLevel?.toLowerCase()}`}>
      <div className="clause-header" onClick={() => setLocalOpen(o => !o)}>
        <span style={{
          width: '24px', height: '24px', borderRadius: '50%',
          background: 'var(--bg-tertiary)', color: 'var(--text-muted)',
          fontSize: '11px', fontWeight: '600', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {index + 1}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '2px' }}>
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

        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {open && (
        <div className="clause-body open">
          <div className="clause-original">
            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Original
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
              <p className="clause-risk-reason">⚠ {clause.riskReason}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Results