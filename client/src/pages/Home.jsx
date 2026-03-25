import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const ScorePill = ({ score }) => {
  if (score === null || score === undefined) return (
    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Analysing…</span>
  )
  const color = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)'
  const bg = score >= 75 ? 'var(--success-subtle)' : score >= 50 ? 'var(--warning-subtle)' : 'var(--danger-subtle)'
  return (
    <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: bg, color }}>
      {score}
    </span>
  )
}

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    api.get('/documents/history')
      .then(res => setHistory(res.data.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.3rem' }}>
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Upload a legal document to get a plain-English breakdown.
        </p>
      </div>

      <div
        className="card"
        onClick={() => navigate('/upload')}
        style={{
          padding: '1.5rem 2rem', cursor: 'pointer',
          border: '1.5px dashed var(--border-strong)',
          display: 'flex', alignItems: 'center', gap: '1.25rem',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
      >
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: 'var(--accent-subtle)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7-7 7 7"/>
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: '500', marginBottom: '0.2rem' }}>Analyse a new document</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>PDF or TXT · Up to 5MB</div>
        </div>
        <div style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Recent documents
        </h2>

        {loading ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading…</p>
          </div>
        ) : history.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No documents analysed yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.map(doc => (
              <div
                key={doc._id}
                className="card"
                onClick={() => navigate(`/results/${doc._id}`)}
                style={{ padding: '0.875rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'box-shadow 0.15s' }}
                onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: doc.fileType === 'pdf' ? 'var(--danger-subtle)' : 'var(--accent-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: doc.fileType === 'pdf' ? 'var(--danger)' : 'var(--accent)' }}>
                    {doc.fileType.toUpperCase()}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '500', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doc.fileName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                    {doc.clauseCount} clauses · {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <ScorePill score={doc.safetyScore} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home