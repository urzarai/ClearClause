import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <ThemeToggle />
        {children}
      </main>
    </div>
  )
}

export default Layout