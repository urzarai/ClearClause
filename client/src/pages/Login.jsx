import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>ClearClause</h1>
        <h2 style={styles.subtitle}>Sign in to your account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="arjun@example.com"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Your password"
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={styles.switchText}>
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card: { background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e5e5', width: '100%', maxWidth: '400px' },
  title: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' },
  subtitle: { fontSize: '1rem', fontWeight: '400', color: '#666', marginBottom: '1.5rem' },
  error: { background: '#fff0f0', color: '#cc0000', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.375rem' },
  label: { fontSize: '0.875rem', fontWeight: '500', color: '#333' },
  input: { padding: '0.625rem 0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', outline: 'none' },
  button: { padding: '0.75rem', borderRadius: '8px', background: '#1a1a1a', color: '#fff', border: 'none', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', marginTop: '0.5rem' },
  switchText: { textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#666' },
}

export default Login