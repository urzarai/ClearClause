import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Home() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>ClearClause</h1>
      {isAuthenticated ? (
        <div style={{ marginTop: '1rem' }}>
          <p>Welcome, <strong>{user.name}</strong></p>
          <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.25rem' }}>{user.email}</p>
          <button
            onClick={handleLogout}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p style={{ marginTop: '1rem', color: '#666' }}>
          <a href="/login">Sign in</a> or <a href="/register">create an account</a>
        </p>
      )}
    </div>
  )
}

export default Home