import './ContextModal.css'
import type { ContextItem } from '../services/api'

interface ContextModalProps {
  isOpen: boolean
  onClose: () => void
  contextItems: ContextItem[]
  sources: string[]
  noContextFound: boolean
}

function ContextModal({ isOpen, onClose, contextItems, sources, noContextFound }: ContextModalProps) {
  if (!isOpen) return null

  return (
    <div className="context-modal-overlay" onClick={onClose}>
      <div className="context-modal" onClick={(e) => e.stopPropagation()}>
        <div className="context-modal-header">
          <h3>Context & Sources</h3>
          <button className="context-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="context-modal-content">
          {noContextFound ? (
            <div className="context-no-context">
              <p>No context found for this query.</p>
            </div>
          ) : (
            <>
              <div className="context-section">
                <h4>Context Used</h4>
                {contextItems.map((item, index) => (
                  <div key={index} className="context-item">
                    <div className="context-item-header">
                      <span className="context-section-name">{item.section}</span>
                      <span className="context-section-id">{item.section_id}</span>
                      <span className="context-similarity-score">
                        Similarity: {(item.similarity_score * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="context-item-content">{item.content}</div>
                  </div>
                ))}
              </div>
              <div className="context-section">
                <h4>Sources</h4>
                <div className="context-sources">
                  {sources.map((source, index) => (
                    <span key={index} className="context-source-tag">{source}</span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContextModal

