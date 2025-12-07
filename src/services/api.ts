const API_BASE_URL = 'https://rag-based-chatbot-96uz.onrender.com'

export interface QueryFilters {
  product_area?: string
  section?: string
}

export interface QueryRequest {
  filters?: QueryFilters
  question: string
}

export interface ContextItem {
  content: string
  section: string
  section_id: string
  similarity_score: number
}

export interface QueryResponse {
  answer: string
  context_used: ContextItem[]
  no_context_found: boolean
  query_id: string
  sources: string[]
}

export interface EvaluationResponse {
  query_id: string
  question: string
  answer: string
  verdict: 'RELIABLE' | string
  confidence: number
  possible_hallucination: boolean
  reasoning: string
}

export async function queryAPI(request: QueryRequest): Promise<QueryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export async function evaluateQuery(queryId: string): Promise<EvaluationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/query/evaluate/${queryId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export interface RecentQuery {
  timestamp: string
  latencyMs: number
  total_tokens: number
  tokens_prompt: number
  tokens_completion: number
  costUsd: number
  embeddingCostUsd: number
  llmCostUsd: number
  success: boolean
  error: string | null
  questionSnippet: string
  queryId: string
}

export interface MetricsResponse {
  totalRequests: number
  successes: number
  failures: number
  errorRate: number
  avgLatency: number
  p50Latency: number
  p95Latency: number
  throughput: number
  totalTokens: number
  totalPrompt: number
  totalCompletion: number
  totalCost: number
  totalEmbeddingCost: number
  totalLlmCost: number
  insights: string[]
  recent: RecentQuery[]
}

export async function getMetrics(): Promise<MetricsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/query/metrics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export interface HealthResponse {
  status: string
}

export async function checkHealth(): Promise<HealthResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'HEAD',
    })

    if (response.ok) {
      // HEAD request returns no body, so we just check the status
      // response.ok is true for all 2xx status codes (200-299)
      return { status: 'ok' }
    }
    return null
  } catch (error) {
    return null
  }
}

