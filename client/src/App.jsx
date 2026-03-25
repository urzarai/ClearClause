import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Upload from './pages/Upload'
import Results from './pages/Results'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"            element={<Landing />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/upload"      element={<ProtectedRoute><Layout><Upload /></Layout></ProtectedRoute>} />
            <Route path="/results/:id" element={<ProtectedRoute><Layout><Results /></Layout></ProtectedRoute>} />
            <Route path="/history"     element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App