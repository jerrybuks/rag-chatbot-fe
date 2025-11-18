import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import ChatButton from './components/ChatButton'
import ChatWindow from './components/ChatWindow'
import Docs from './pages/Docs'
import Metrics from './pages/Metrics'
import Report from './pages/Report'

function Home() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <h1>HRCare</h1>
            </div>
            <div className="nav-links">
              <Link to="/docs">Documentation</Link>
              <Link to="/metrics">Metrics</Link>
              <Link to="/report">Report</Link>
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
          <p>&copy; 2024 HRCare. All rights reserved.</p>
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
  const location = useLocation()

  useEffect(() => {
    // Auto-open chat on home page after 3 seconds (only if not already opened)
    if (location.pathname === '/' && !isChatOpen) {
      const timer = setTimeout(() => {
        setIsChatOpen(true)
        sessionStorage.setItem('chatOpen', 'true')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [location.pathname, isChatOpen])

  const handleChatToggle = () => {
    const newState = !isChatOpen
    setIsChatOpen(newState)
    sessionStorage.setItem('chatOpen', String(newState))
  }

  return (
    <>
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
