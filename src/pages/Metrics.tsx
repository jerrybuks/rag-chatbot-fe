import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getMetrics } from '../services/api'
import './Metrics.css'

function Metrics() {
  const { data: metrics, isLoading, error, refetch } = useQuery({
    queryKey: ['metrics'],
    queryFn: getMetrics,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    }).format(value)
  }

  const formatNumber = (value: number, minDecimals: number = 2, maxDecimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
    }).format(value)
  }

  const formatLatency = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="metrics-page">
      <header className="metrics-header">
        <div className="container">
          <nav className="metrics-nav">
            <Link to="/" className="metrics-back-link">← Back to Home</Link>
            <h1 className="metrics-title">Query Metrics</h1>
            <button onClick={() => refetch()} className="metrics-refresh-button">
              🔄 Refresh
            </button>
          </nav>
        </div>
      </header>

      <main className="metrics-main">
        <div className="container">
          {isLoading ? (
            <div className="metrics-loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Loading metrics...</p>
            </div>
          ) : error ? (
            <div className="metrics-error">
              <p>Failed to load metrics. Please try again.</p>
            </div>
          ) : metrics ? (
            <>
              {/* Overview Cards */}
              <div className="metrics-overview">
                <div className="metric-card">
                  <div className="metric-card-icon">📊</div>
                  <div className="metric-card-content">
                    <h3>Total Requests</h3>
                    <p className="metric-value">{metrics.totalRequests}</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-card-icon">✅</div>
                  <div className="metric-card-content">
                    <h3>Successes</h3>
                    <p className="metric-value metric-success">{metrics.successes}</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-card-icon">❌</div>
                  <div className="metric-card-content">
                    <h3>Failures</h3>
                    <p className="metric-value metric-error">{metrics.failures}</p>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-card-icon">⚠️</div>
                  <div className="metric-card-content">
                    <h3>Error Rate</h3>
                    <p className="metric-value">{(metrics.errorRate * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>

              {/* Latency Metrics */}
              <div className="metrics-section">
                <h2>Latency Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-box">
                    <h4>Average Latency</h4>
                    <p className="metric-large">{formatLatency(metrics.avgLatency)}</p>
                  </div>
                  <div className="metric-box">
                    <h4>P50 Latency</h4>
                    <p className="metric-large">{formatLatency(metrics.p50Latency)}</p>
                  </div>
                  <div className="metric-box">
                    <h4>P95 Latency</h4>
                    <p className="metric-large">{formatLatency(metrics.p95Latency)}</p>
                  </div>
                  <div className="metric-box">
                    <h4>Throughput</h4>
                    <p className="metric-large">{formatNumber(metrics.throughput, 0, 5)} req/s</p>
                  </div>
                </div>
              </div>

              {/* Token Usage */}
              <div className="metrics-section">
                <h2>Token Usage</h2>
                <div className="metrics-grid">
                  <div className="metric-box">
                    <h4>Total Tokens</h4>
                    <p className="metric-large">{metrics.totalTokens.toLocaleString()}</p>
                  </div>
                  <div className="metric-box">
                    <h4>Prompt Tokens</h4>
                    <p className="metric-large">{metrics.totalPrompt.toLocaleString()}</p>
                  </div>
                  <div className="metric-box">
                    <h4>Completion Tokens</h4>
                    <p className="metric-large">{metrics.totalCompletion.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Cost Metrics */}
              <div className="metrics-section">
                <h2>Cost Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-box">
                    <h4>Total Cost</h4>
                    <p className="metric-large metric-cost">{formatCurrency(metrics.totalCost)}</p>
                  </div>
                  <div className="metric-box">
                    <h4>LLM Generation Cost</h4>
                    <p className="metric-large">{formatCurrency(metrics.totalLlmCost)}</p>
                  </div>
                  <div className="metric-box">
                    <h4>Embedding Cost</h4>
                    <p className="metric-large">{formatCurrency(metrics.totalEmbeddingCost)}</p>
                  </div>
                </div>
              </div>

              {/* Insights */}
              {metrics.insights && metrics.insights.length > 0 && (
                <div className="metrics-section">
                  <h2>Insights</h2>
                  <div className="insights-list">
                    {metrics.insights.map((insight, index) => (
                      <div key={index} className="insight-item">
                        <span className="insight-icon">💡</span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Queries */}
              {metrics.recent && metrics.recent.length > 0 && (
                <div className="metrics-section">
                  <h2>Recent Queries</h2>
                  <div className="recent-queries">
                    <table className="queries-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Question</th>
                          <th>Latency</th>
                          <th>Tokens</th>
                          <th>Cost</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.recent.map((query, index) => (
                          <tr key={index}>
                            <td>{formatDate(query.timestamp)}</td>
                            <td className="question-cell">{query.questionSnippet}</td>
                            <td>{formatLatency(query.latencyMs)}</td>
                            <td>{query.total_tokens.toLocaleString()}</td>
                            <td>{formatCurrency(query.costUsd)}</td>
                            <td>
                              <span className={`status-badge ${query.success ? 'status-success' : 'status-error'}`}>
                                {query.success ? '✓ Success' : '✗ Failed'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default Metrics

