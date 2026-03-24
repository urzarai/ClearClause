import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const ACCEPTED = ['application/pdf', 'text/plain']
const MAX_SIZE = 5 * 1024 * 1024

function Upload() {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const inputRef = useRef()
  const navigate = useNavigate()

  const validate = (f) => {
    if (!ACCEPTED.includes(f.type)) return 'Only PDF and TXT files are supported'
    if (f.size > MAX_SIZE) return 'File size must be under 5MB'
    return null
  }

  const handleFile = (f) => {
    const err = validate(f)
    if (err) { setError(err); return }
    setError('')
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleChange = (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setProgress(0)
    setError('')

    const formData = new FormData()
    formData.append('document', file)

    try {
      const res = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      navigate(`/results/${res.data.documentId}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
      setUploading(false)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.4rem' }}>
          Analyse a document
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Upload a legal document and ClearClause will break it down clause by clause,
          flag risks, and generate a plain-English summary.
        </p>
      </div>

      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        {!file ? (
          <div style={{ pointerEvents: 'none' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'var(--accent-subtle)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              Drop your document here
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              or click to browse
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {['PDF', 'TXT'].map(type => (
                <span key={type} className="badge badge-neutral">{type}</span>
              ))}
              <span className="badge badge-neutral">Max 5MB</span>
            </div>
          </div>
        ) : (
          <div style={{ pointerEvents: 'none' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '12px',
              background: 'var(--success-subtle)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p style={{ fontWeight: '500', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{file.name}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{formatSize(file.size)}</p>
            <button
              style={{
                pointerEvents: 'auto', background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={(e) => { e.stopPropagation(); setFile(null) }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="auth-error" style={{ marginTop: '1rem' }}>{error}</div>
      )}

      {uploading && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Uploading...</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{progress}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'var(--accent)', borderRadius: '2px',
              transition: 'width 0.2s ease',
            }} />
          </div>
        </div>
      )}

      {file && !uploading && (
        <button
          onClick={handleUpload}
          style={{
            marginTop: '1.5rem', width: '100%', padding: '0.8rem',
            background: 'var(--accent)', color: '#fff', border: 'none',
            borderRadius: 'var(--radius-md)', fontSize: '0.95rem',
            fontWeight: '500', cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseOver={e => e.target.style.background = 'var(--accent-hover)'}
          onMouseOut={e => e.target.style.background = 'var(--accent)'}
        >
          Analyse document →
        </button>
      )}

      <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        {[
          { label: 'Clause extraction', desc: 'Every clause identified and separated' },
          { label: 'Risk flagging', desc: 'High-risk terms highlighted in red' },
          { label: 'Plain English', desc: 'Legal language rewritten simply' },
        ].map(item => (
          <div key={item.label} className="card" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Upload