import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import './Report.css'
import reportContent from '../../reports.md?raw'

function Report() {
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load the report content
    setContent(reportContent)
    setIsLoading(false)
  }, [])

  return (
    <div className="report-page">
      <header className="report-header">
        <div className="container">
          <nav className="report-nav">
            <Link to="/" className="report-back-link">← Back to Home</Link>
            <h1 className="report-title">Project Report</h1>
          </nav>
        </div>
      </header>

      <main className="report-main">
        <div className="container">
          {isLoading ? (
            <div className="report-loading">Loading report...</div>
          ) : (
            <div className="report-content">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Report

