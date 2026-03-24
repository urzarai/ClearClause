import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.3rem' }}>
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Upload a legal document to get started.
        </p>
      </div>

      <div
        className="card"
        onClick={() => navigate('/upload')}
        style={{
          padding: '2rem', cursor: 'pointer', border: '1.5px dashed var(--border-strong)',
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
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Recent documents
        </h2>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No documents analysed yet.</p>
        </div>
      </div>
    </div>
  )
}

export default Home