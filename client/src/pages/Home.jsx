import { useEffect, useState } from 'react'
import axios from 'axios'

function Home() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    axios.get('/api/health')
      .then(res => setStatus(res.data.message))
      .catch(() => setStatus('backend not reachable'))
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ClearClause</h1>
      <p>API status: <strong>{status}</strong></p>
    </div>
  )
}

export default Home