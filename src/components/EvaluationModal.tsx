import './EvaluationModal.css'
import type { EvaluationResponse } from '../services/api'

interface EvaluationModalProps {
  isOpen: boolean
  onClose: () => void
  evaluation: EvaluationResponse | null
  isLoading: boolean
}

function EvaluationModal({ isOpen, onClose, evaluation, isLoading }: EvaluationModalProps) {
  if (!isOpen) return null

  const isReliable = evaluation?.verdict === 'RELIABLE'

  return (
    <div className="evaluation-modal-overlay" onClick={onClose}>
      <div className="evaluation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="evaluation-modal-header">
          <h3>Query Evaluation</h3>
          <button className="evaluation-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="evaluation-modal-content">
          {isLoading ? (
            <div className="evaluation-loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Evaluating query...</p>
            </div>
          ) : evaluation ? (
            <>
              <div className="evaluation-section">
                <h4>Query ID</h4>
                <p className="evaluation-query-id">{evaluation.query_id}</p>
              </div>

              <div className="evaluation-section">
                <h4>Question</h4>
                <p className="evaluation-question">{evaluation.question}</p>
              </div>

              <div className="evaluation-section">
                <h4>Answer</h4>
                <p className="evaluation-answer">{evaluation.answer}</p>
              </div>

              <div className="evaluation-section">
                <h4>Verdict</h4>
                <div className={`evaluation-verdict ${isReliable ? 'verdict-reliable' : 'verdict-unreliable'}`}>
                  {evaluation.verdict}
                </div>
              </div>

              <div className="evaluation-section">
                <h4>Confidence</h4>
                <div className="evaluation-confidence">
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${evaluation.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="confidence-value">{(evaluation.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="evaluation-section">
                <h4>Possible Hallucination</h4>
                <div className={`evaluation-hallucination ${evaluation.possible_hallucination ? 'hallucination-yes' : 'hallucination-no'}`}>
                  {evaluation.possible_hallucination ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="evaluation-section">
                <h4>Reasoning</h4>
                <p className="evaluation-reasoning">{evaluation.reasoning}</p>
              </div>
            </>
          ) : (
            <div className="evaluation-error">
              <p>Failed to load evaluation data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EvaluationModal

