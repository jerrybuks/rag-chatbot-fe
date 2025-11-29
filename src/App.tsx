import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import ChatButton from './components/ChatButton'
import ChatWindow from './components/ChatWindow'
import ServerWakeUp from './components/ServerWakeUp'
import Docs from './pages/Docs'
import Metrics from './pages/Metrics'
import Report from './pages/Report'
import { checkHealth } from './services/api'

function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <h1>HRCare</h1>
            </div>
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className={`nav-links ${isMobileMenuOpen ? 'nav-links-open' : ''}`}>
              <Link to="/docs" onClick={closeMobileMenu}>Documentation</Link>
              <Link to="/metrics" onClick={closeMobileMenu}>Metrics</Link>
              <Link to="/report" onClick={closeMobileMenu}>Report</Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Streamline Your HR Operations
              </h1>
              <p className="hero-subtitle">
                HRCare is your all-in-one HR SaaS platform for managing hiring, onboarding, 
                payroll integrations, time-off, performance, compliance, and employee lifecycle workflows.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary">Get Started</button>
                <button className="btn btn-secondary">Learn More</button>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="container">
            <h2 className="section-title">Everything You Need to Manage Your Workforce</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Hiring & Recruitment</h3>
                <p>Streamline your hiring process with our comprehensive recruitment tools.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Onboarding</h3>
                <p>Create seamless onboarding experiences for new employees.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h3>Payroll Integration</h3>
                <p>Integrate with leading payroll providers for seamless processing.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📅</div>
                <h3>Time-Off Management</h3>
                <p>Efficiently manage employee time-off requests and approvals.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Performance Reviews</h3>
                <p>Track and manage employee performance with comprehensive review tools.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">✅</div>
                <h3>Compliance</h3>
                <p>Stay compliant with automated compliance tracking and reporting.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <h2>Ready to Transform Your HR Operations?</h2>
            <p>Join thousands of companies using HRCare to manage their workforce.</p>
            <button className="btn btn-primary btn-large">Start Free Trial</button>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} HRCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function AppContent() {
  const [isChatOpen, setIsChatOpen] = useState(() => {
    // Load chat open state from sessionStorage
    // sessionStorage persists on page reload but clears when tab closes
    const saved = sessionStorage.getItem('chatOpen')
    return saved === 'true'
  })
  const [isServerReady, setIsServerReady] = useState(false)
  const location = useLocation()

  // Health check on mount - quietly wake up the server
  useEffect(() => {
    let pollInterval: ReturnType<typeof setInterval> | null = null
    let isMounted = true

    const performHealthCheck = async () => {
      if (!isMounted) return
      
      try {
        const health = await checkHealth()
        if (health && health.status === 'ok') {
          setIsServerReady(true)
          if (pollInterval) {
            clearInterval(pollInterval)
            pollInterval = null
          }
        }
      } catch (error) {
        // Silently handle errors - server might be sleeping
      }
    }

    // Initial check
    performHealthCheck()

    // Poll every 3 seconds until server is ready
    pollInterval = setInterval(() => {
      performHealthCheck()
    }, 3000)

    return () => {
      isMounted = false
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [])

  // Add/remove class to body for styling adjustments
  useEffect(() => {
    if (!isServerReady) {
      document.body.classList.add('server-waking')
    } else {
      document.body.classList.remove('server-waking')
    }
    return () => {
      document.body.classList.remove('server-waking')
    }
  }, [isServerReady])

  useEffect(() => {
    // Auto-open chat on home page after 3 seconds (only on first load ever)
    if (location.pathname === '/' && !isChatOpen) {
      // Check if this is the first load ever using localStorage
      const hasOpenedBefore = localStorage.getItem('chatHasOpenedBefore')
      if (!hasOpenedBefore) {
        const timer = setTimeout(() => {
          setIsChatOpen(true)
          sessionStorage.setItem('chatOpen', 'true')
          localStorage.setItem('chatHasOpenedBefore', 'true')
        }, 3000)

        return () => clearTimeout(timer)
      }
    }
  }, [location.pathname, isChatOpen])

  const handleChatToggle = () => {
    const newState = !isChatOpen
    setIsChatOpen(newState)
    sessionStorage.setItem('chatOpen', String(newState))
  }

  return (
    <>
      {!isServerReady && <ServerWakeUp />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/report" element={<Report />} />
      </Routes>
      <ChatButton onClick={handleChatToggle} isOpen={isChatOpen} />
      <ChatWindow isOpen={isChatOpen} onClose={handleChatToggle} />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
