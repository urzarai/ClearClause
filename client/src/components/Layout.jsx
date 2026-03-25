import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content" id="main-content">
        <div style={{ position: 'fixed', top: '20px', right: '24px', zIndex: 50 }}>
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  )
}

export default Layout