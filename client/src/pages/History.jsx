import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const ScorePill = ({ score, status }) => {
    if (status === 'processing') return (
        <span style={{ fontSize: '12px', color: 'var(--warning)', background: 'var(--warning-subtle)', padding: '2px 10px', borderRadius: '20px' }}>
            Analysing…
        </span>
    )
    if (status === 'error') return (
        <span style={{ fontSize: '12px', color: 'var(--danger)', background: 'var(--danger-subtle)', padding: '2px 10px', borderRadius: '20px' }}>
            Error
        </span>
    )
    if (score === null || score === undefined) return null
    const color = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)'
    const bg = score >= 75 ? 'var(--success-subtle)' : score >= 50 ? 'var(--warning-subtle)' : 'var(--danger-subtle)'
    const label = score >= 75 ? 'Safe' : score >= 50 ? 'Review' : 'High Risk'
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color }}>{score}</span>
            <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', background: bg, color, fontWeight: '500' }}>
                {label}
            </span>
        </div>
    )
}

function History() {
    const [docs, setDocs] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(null)
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const fetchHistory = async () => {
        try {
            const res = await api.get('/documents/history')
            setDocs(res.data)
        } catch { }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchHistory() }, [])

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!window.confirm('Remove this document from history?')) return
        setDeleting(id)
        try {
            await api.delete(`/documents/${id}`)
            setDocs(d => d.filter(doc => doc._id !== id))
        } catch {
            alert('Failed to delete document.')
        } finally { setDeleting(null) }
    }

    const filtered = docs.filter(d =>
        d.fileName.toLowerCase().includes(search.toLowerCase())
    )

    const highRisk = docs.filter(d => d.safetyScore !== null && d.safetyScore < 50).length
    const reviewing = docs.filter(d => d.safetyScore !== null && d.safetyScore >= 50 && d.safetyScore < 75).length
    const safe = docs.filter(d => d.safetyScore !== null && d.safetyScore >= 75).length

    return (
        <div style={{ maxWidth: '900px' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.3rem' }}>History</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    All documents you've analysed. Click any row to view the full results.
                </p>
            </div>

            {/* Stats row */}
            {docs.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                        { label: 'Total', value: docs.length, color: 'var(--text-primary)', bg: 'var(--bg-secondary)' },
                        { label: 'High Risk', value: highRisk, color: 'var(--danger)', bg: 'var(--danger-subtle)' },
                        { label: 'Review', value: reviewing, color: 'var(--warning)', bg: 'var(--warning-subtle)' },
                        { label: 'Safe', value: safe, color: 'var(--success)', bg: 'var(--success-subtle)' },
                    ].map(item => (
                        <div key={item.label} style={{ background: item.bg, borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: item.color }}>{item.value}</div>
                            <div style={{ fontSize: '12px', color: item.color, opacity: 0.75, marginTop: '2px' }}>{item.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Search */}
            {docs.length > 0 && (
                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                    <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search documents…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="auth-input"
                        style={{ paddingLeft: '38px' }}
                    />
                </div>
            )}

            {/* List */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0 }} />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div className="skeleton" style={{ height: '14px', width: `${55 + (i * 7) % 30}%` }} />
                                <div className="skeleton" style={{ height: '11px', width: '30%' }} />
                            </div>
                            <div className="skeleton" style={{ width: '52px', height: '22px', borderRadius: '20px' }} />
                        </div>
                    ))}
                </div>
            ) :  filtered.length === 0 ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>No documents match "{search}"</p>
            </div>
            ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Table header */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px 90px 80px 90px 40px',
                    gap: '12px',
                    padding: '0.5rem 1.25rem',
                    fontSize: '11px', fontWeight: '600',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                }}>
                    <span>Document</span>
                    <span>Type</span>
                    <span>Date</span>
                    <span>Clauses</span>
                    <span>Score</span>
                    <span></span>
                </div>

                {filtered.map(doc => (
                    <div
                        key={doc._id}
                        className="card"
                        onClick={() => navigate(`/results/${doc._id}`)}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 80px 90px 80px 90px 40px',
                            gap: '12px',
                            padding: '0.875rem 1.25rem',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'box-shadow 0.15s',
                        }}
                        onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                        onMouseOut={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                    >
                        {/* Filename */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                                background: doc.fileType === 'pdf' ? 'var(--danger-subtle)' : 'var(--accent-subtle)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <span style={{ fontSize: '9px', fontWeight: '700', color: doc.fileType === 'pdf' ? 'var(--danger)' : 'var(--accent)' }}>
                                    {doc.fileType?.toUpperCase()}
                                </span>
                            </div>
                            <span style={{ fontWeight: '500', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {doc.fileName}
                            </span>
                        </div>

                        {/* Type */}
                        <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                            {doc.fileType?.toUpperCase()}
                        </span>

                        {/* Date */}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </span>

                        {/* Clause count */}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {doc.clauseCount} clauses
                        </span>

                        {/* Score */}
                        <ScorePill score={doc.safetyScore} status={doc.status} />

                        {/* Delete */}
                        <button
                            onClick={e => handleDelete(e, doc._id)}
                            disabled={deleting === doc._id}
                            style={{
                                background: 'none', border: 'none',
                                color: 'var(--text-muted)', cursor: 'pointer',
                                padding: '4px', borderRadius: 'var(--radius-sm)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'color 0.15s, background 0.15s',
                                opacity: deleting === doc._id ? 0.4 : 1,
                            }}
                            onMouseOver={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-subtle)' }}
                            onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
                            title="Delete"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
      )}
        </div>
    )
}

export default History