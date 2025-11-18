import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import './ChatWindow.css'
import ContextModal from './ContextModal'
import EvaluationModal from './EvaluationModal'
import { queryAPI, evaluateQuery } from '../services/api'
import type { QueryResponse } from '../services/api'
import { PRODUCT_AREAS, SECTIONS } from '../utils/filterOptions'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  contextData?: QueryResponse | null
}

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: 'Hello! 👋 I\'m your HRCare RAG-powered assistant. I\'m designed to help answer questions based on HRCare\'s internal documentation using Retrieval-Augmented Generation (RAG) technology. Feel free to ask me anything about HRCare features, account management, SSO, billing, hiring, onboarding, and more!\n\nYou can also browse our full documentation: <a href="/docs">View Documentation</a>',
  sender: 'bot',
  timestamp: new Date()
}

function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  // Load messages from sessionStorage or use initial message
  // sessionStorage persists on page reload but clears when tab closes
  const loadMessages = (): Message[] => {
    try {
      const saved = sessionStorage.getItem('chatMessages')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Convert timestamp strings back to Date objects and preserve contextData
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          contextData: msg.contextData || null
        }))
      }
    } catch (e) {
      console.error('Error loading messages:', e)
    }
    return [INITIAL_MESSAGE]
  }

  const [messages, setMessages] = useState<Message[]>(loadMessages)
  const [inputValue, setInputValue] = useState('')
  const [productArea, setProductArea] = useState<string>('')
  const [section, setSection] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedContext, setSelectedContext] = useState<QueryResponse | null>(null)
  const [isContextModalOpen, setIsContextModalOpen] = useState(false)
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null)
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Query for evaluation data
  const { data: evaluationData, isLoading: isEvaluationLoading } = useQuery({
    queryKey: ['evaluate', selectedQueryId],
    queryFn: () => evaluateQuery(selectedQueryId!),
    enabled: !!selectedQueryId && isEvaluationModalOpen,
  })

  // Save messages to sessionStorage whenever they change
  // sessionStorage persists on page reload but clears when tab closes
  useEffect(() => {
    try {
      sessionStorage.setItem('chatMessages', JSON.stringify(messages))
    } catch (e) {
      console.error('Error saving messages:', e)
    }
  }, [messages])

  const mutation = useMutation({
    mutationFn: queryAPI,
    onSuccess: (data: QueryResponse) => {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: data.answer,
        sender: 'bot',
        timestamp: new Date(),
        contextData: data
      }
      setMessages(prev => [...prev, botMessage])
    },
    onError: (error: Error) => {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = () => {
    if (!inputValue.trim() || mutation.isPending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const question = inputValue
    setInputValue('')

    // Build filters object only if values are selected
    const filters: { product_area?: string; section?: string } = {}
    if (productArea) filters.product_area = productArea
    if (section) filters.section = section

    mutation.mutate({
      question,
      filters: Object.keys(filters).length > 0 ? filters : undefined
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleContextClick = (contextData: QueryResponse) => {
    setSelectedContext(contextData)
    setIsContextModalOpen(true)
  }

  const handleEvaluateClick = (queryId: string) => {
    setSelectedQueryId(queryId)
    setIsEvaluationModalOpen(true)
  }

  const clearFilters = () => {
    setProductArea('')
    setSection('')
  }

  const suggestedQuestions = [
    'How do I create an account?',
    'How do I invite users?',
    'What SSO providers are supported?',
    'How does billing work?',
    'How do I manage time-off requests?',
    'What payroll integrations are available?'
  ]

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    // Auto-focus the input
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="chat-window">
        <div className="chat-window-header">
          <div className="chat-window-header-info">
            <div className="chat-window-avatar">💬</div>
            <div>
              <h3>HRCare Support</h3>
              <p className="chat-window-status">Online</p>
            </div>
          </div>
          <button 
            className="chat-window-close"
            onClick={onClose}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        {showFilters && (
          <div className="chat-filters">
            <div className="chat-filter-row">
              <label htmlFor="product-area-filter">Product Area:</label>
              <select
                id="product-area-filter"
                value={productArea}
                onChange={(e) => setProductArea(e.target.value)}
                className="chat-filter-select"
              >
                <option value="">All</option>
                {PRODUCT_AREAS.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
            <div className="chat-filter-row">
              <label htmlFor="section-filter">Section:</label>
              <select
                id="section-filter"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="chat-filter-select"
              >
                <option value="">All</option>
                {SECTIONS.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>
            <div className="chat-filter-actions">
              <button onClick={clearFilters} className="chat-filter-clear">Clear Filters</button>
              <button onClick={() => setShowFilters(false)} className="chat-filter-close">Hide Filters</button>
            </div>
          </div>
        )}

        <div className="chat-window-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div 
                className="chat-message-content"
                dangerouslySetInnerHTML={{ 
                  __html: message.text.replace(/\n/g, '<br />')
                }}
              />
              {message.sender === 'bot' && message.contextData && (
                <div className="chat-message-actions">
                  <button
                    className="chat-context-button"
                    onClick={() => handleContextClick(message.contextData!)}
                  >
                    View Context
                  </button>
                  {message.contextData.query_id && (
                    <button
                      className="chat-evaluate-button"
                      onClick={() => handleEvaluateClick(message.contextData!.query_id)}
                    >
                      Evaluate
                    </button>
                  )}
                </div>
              )}
              <div className="chat-message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {mutation.isPending && (
            <div className="chat-message bot-message">
              <div className="chat-message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-suggested-questions">
          <p className="suggested-questions-label">Suggested questions:</p>
          <div className="suggested-questions-list">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="suggested-question-button"
                onClick={() => handleSuggestedQuestion(question)}
                disabled={mutation.isPending}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="chat-window-input-container">
          <button
            className="chat-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
            title="Toggle filters"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill="currentColor"/>
            </svg>
          </button>
          <div className="chat-window-input">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={mutation.isPending}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || mutation.isPending}
              className="chat-send-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {selectedContext && (
        <ContextModal
          isOpen={isContextModalOpen}
          onClose={() => {
            setIsContextModalOpen(false)
            setSelectedContext(null)
          }}
          contextItems={selectedContext.context_used}
          sources={selectedContext.sources}
          noContextFound={selectedContext.no_context_found}
        />
      )}

      <EvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => {
          setIsEvaluationModalOpen(false)
          setSelectedQueryId(null)
        }}
        evaluation={evaluationData || null}
        isLoading={isEvaluationLoading}
      />
    </>
  )
}

export default ChatWindow
