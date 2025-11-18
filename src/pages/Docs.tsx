import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Docs.css'
import faqDocument from '../data/faq_document.txt?raw'

function Docs() {
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load the FAQ document content
    setContent(faqDocument)
    setIsLoading(false)
  }, [])

  const formatContent = (text: string) => {
    // Split by section separators
    const sections = text.split(/\n---\n/).filter(section => section.trim())
    
    return sections.map((section, index) => {
      const lines = section.split('\n')
      const metadata: Record<string, string> = {}
      let contentStart = 0
      
      // Parse metadata
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.startsWith('content:')) {
          contentStart = i + 1
          break
        }
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':')
          metadata[key.trim()] = valueParts.join(':').trim()
        }
      }
      
      const content = lines.slice(contentStart).join('\n').trim()
      
      return (
        <div 
          key={index} 
          className="doc-section"
        >
          {metadata.section_id && (
            <div className="doc-section-header">
              <h2 className="doc-section-title">{metadata.section || 'Untitled Section'}</h2>
              <div className="doc-section-meta">
                {metadata.section_id && (
                  <span className="doc-meta-item">ID: {metadata.section_id}</span>
                )}
                {metadata.product_area && (
                  <span className="doc-meta-item">Area: {metadata.product_area}</span>
                )}
                {metadata.last_updated && (
                  <span className="doc-meta-item">Updated: {metadata.last_updated}</span>
                )}
              </div>
              {metadata.intent_tags && (
                <div className="doc-tags">
                  {metadata.intent_tags
                    .replace(/[\[\]"]/g, '')
                    .split(',')
                    .map((tag, tagIndex) => (
                      <span key={tagIndex} className="doc-tag">{tag.trim()}</span>
                    ))}
                </div>
              )}
            </div>
          )}
          <div className="doc-content">
            {content.split('\n').map((paragraph, pIndex) => {
              if (!paragraph.trim()) return <br key={pIndex} />
              return <p key={pIndex}>{paragraph.trim()}</p>
            })}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="docs-page">
      <header className="docs-header">
        <div className="container">
          <nav className="docs-nav">
            <Link to="/" className="docs-back-link">← Back to Home</Link>
            <h1 className="docs-title">HRCare Documentation</h1>
          </nav>
        </div>
      </header>

      <main className="docs-main">
        <div className="container">
          {isLoading ? (
            <div className="docs-loading">Loading documentation...</div>
          ) : (
            <div className="docs-content">
              <div className="docs-intro">
                <p>
                  This documentation contains comprehensive information about HRCare's features, 
                  including account management, SSO, billing, hiring, onboarding, time-off, 
                  payroll, performance management, compliance, APIs, and more.
                </p>
              </div>
              {formatContent(content)}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Docs

