import type { OllamaConfig } from '@interfaces/index'
import { AbortController } from '@services/Controller'
import { errorHandler } from '@utils/index'

/**
 * Global fetch is available in Node.js 18+
 * @description Global fetch is available in Node.js 18+
 */
declare const fetch: typeof globalThis.fetch

/**
 * Interface for fetch request options.
 * @description Configuration options for HTTP requests.
 */
interface FetchOptions {
  /** HTTP method (GET, POST, PUT, DELETE, etc.) */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  /** Request body data (automatically JSON stringified for POST/PUT/PATCH) */
  data?: unknown
  /** Additional headers to include */
  headers?: Record<string, string>
  /** Request timeout in milliseconds */
  timeout?: number
}

/**
 * Simplified fetch client for making HTTP requests.
 * @description Provides an easy-to-use interface for HTTP requests with automatic JSON handling and timeout management.
 */
export class FetchClient {
  /** The configuration for the fetch client */
  private readonly config: Required<OllamaConfig>
  /** Current abort controller for manual abort */
  private currentController: AbortController | null = null

  /**
   * Creates a new FetchClient instance.
   * @description Initializes the client with the provided configuration.
   * @param config - The configuration for the fetch client
   */
  constructor(config: OllamaConfig) {
    this.config = {
      host: config.host,
      headers: {
        'User-Agent': 'Ollama-Native/1.0.0',
        'Content-Type': 'application/json',
        ...config.headers
      },
      timeout: config.timeout ?? 30000,
      retries: config.retries ?? 1
    }
  }

  /**
   * Makes an HTTP request to the specified endpoint.
   * @description Sends HTTP request with automatic JSON handling and timeout management.
   * @param endpoint - The API endpoint path (e.g., '/api/tags')
   * @param options - Request configuration options
   * @returns Promise that resolves to the response data
   * @throws {Error} When the request fails or times out
   */
  async request<T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const {
      method = 'GET',
      data,
      headers = {},
      timeout = this.config.timeout
    }: FetchOptions = options
    let lastError: unknown = null
    for (let attempt: number = 0; attempt <= this.config.retries; attempt++) {
      try {
        const result: T = await this.executeRequest<T>(endpoint, method, data, headers, timeout)
        return result
      } catch (error: unknown) {
        lastError = error
        this.cleanupController()
        if (this.shouldRetry(error, attempt)) {
          await this.waitForRetry(attempt)
          continue
        }
        break
      }
    }
    errorHandler(lastError, `FetchClient.request() -> ${endpoint}`)
    return null as T
  }

  /**
   * Executes a single HTTP request with timeout and abort control.
   * @description Performs the actual HTTP request with proper error handling and response parsing.
   * @param endpoint - The API endpoint path
   * @param method - The HTTP method to use
   * @param data - The request body data
   * @param headers - Additional headers to include
   * @param timeout - Request timeout in milliseconds
   * @returns Promise that resolves to the parsed response data
   * @throws {Error} When the request fails or times out
   */
  private async executeRequest<T>(
    endpoint: string,
    method: string,
    data: unknown,
    headers: Record<string, string>,
    timeout: number
  ): Promise<T> {
    this.currentController = new AbortController()
    this.currentController.setTimeout(timeout)
    const url: string = `${this.config.host}${endpoint}`
    const requestHeaders: Record<string, string> = { ...this.config.headers, ...headers }
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: this.currentController.signal
    }
    if (data !== undefined && method !== 'GET') {
      fetchOptions.body = JSON.stringify(data)
    }
    const response: Response = await fetch(url, fetchOptions)
    this.cleanupController()
    if (!response.ok) {
      errorHandler(
        new Error(`HTTP ${response.status}: ${response.statusText}`),
        `FetchClient.executeRequest() -> ${url}`
      )
      return null as T
    }
    return this.parseResponse<T>(response)
  }

  /**
   * Parses the HTTP response based on content type.
   * @description Automatically detects content type and parses JSON or text accordingly.
   * @param response - The HTTP response object
   * @returns Promise that resolves to the parsed response data
   * @throws {Error} When content type is invalid or parsing fails
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType: string | null = response.headers.get('content-type')
    if (contentType !== null) {
      const isJson: boolean = contentType.includes('application/json')
      if (isJson) {
        return (await response.json()) as T
      } else {
        return (await response.text()) as T
      }
    }
    errorHandler(
      new Error('Invalid content type'),
      `FetchClient.parseResponse() -> ${response.url}`
    )
    return null as T
  }

  /**
   * Determines if a request should be retried based on error type and attempt count.
   * @description Checks if the error is retryable and if we haven't exceeded max retry attempts.
   * @param error - The error that occurred
   * @param attempt - The current attempt number (0-based)
   * @returns True if the request should be retried, false otherwise
   */
  private shouldRetry(error: unknown, attempt: number): boolean {
    if (error instanceof Error && error.name === 'AbortError') {
      return false
    }
    return attempt < this.config.retries
  }

  /**
   * Waits before retrying a failed request with exponential backoff.
   * @description Implements exponential backoff strategy with a maximum delay cap.
   * @param attempt - The current attempt number (0-based)
   * @returns Promise that resolves after the calculated delay
   */
  private async waitForRetry(attempt: number): Promise<void> {
    const delay: number = Math.min(1000 * Math.pow(2, attempt), 5000)
    await new Promise<void>((resolve: () => void) => setTimeout(resolve, delay))
  }

  /**
   * Cleans up the current abort controller.
   * @description Clears the timeout and sets the controller to null.
   * @returns void
   */
  private cleanupController(): void {
    if (this.currentController !== null) {
      this.currentController.clearTimeout()
      this.currentController = null
    }
  }

  /**
   * Makes a GET request to the specified endpoint.
   * @description Convenience method for GET requests.
   * @param endpoint - The API endpoint path
   * @param options - Optional request configuration
   * @returns Promise that resolves to the response data
   * @throws {Error} When the request fails or times out
   */
  async get<T = unknown>(
    endpoint: string,
    options: Omit<FetchOptions, 'method' | 'data'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * Makes a POST request to the specified endpoint.
   * @description Convenience method for POST requests with data.
   * @param endpoint - The API endpoint path
   * @param data - The data to send in the request body
   * @param options - Optional request configuration
   * @returns Promise that resolves to the response data
   * @throws {Error} When the request fails or times out
   */
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options: Omit<FetchOptions, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', data })
  }

  /**
   * Makes a PUT request to the specified endpoint.
   * @description Convenience method for PUT requests with data.
   * @param endpoint - The API endpoint path
   * @param data - The data to send in the request body
   * @param options - Optional request configuration
   * @returns Promise that resolves to the response data
   * @throws {Error} When the request fails or times out
   */
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options: Omit<FetchOptions, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data })
  }

  /**
   * Makes a DELETE request to the specified endpoint.
   * @description Convenience method for DELETE requests.
   * @param endpoint - The API endpoint path
   * @param options - Optional request configuration
   * @returns Promise that resolves to the response data
   * @throws {Error} When the request fails or times out
   */
  async delete<T = unknown>(
    endpoint: string,
    options: Omit<FetchOptions, 'method' | 'data'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * Manually aborts the current request.
   * @description Cancels the ongoing request immediately.
   * @returns True if request was aborted, false if no request was active
   */
  abort(): boolean {
    if (this.currentController !== null) {
      this.currentController.abort()
      this.cleanupController()
      return true
    }
    return false
  }

  /**
   * Checks if there's an active request that can be aborted.
   * @description Returns true if a request is currently in progress.
   * @returns True if request is active, false otherwise
   */
  get isActive(): boolean {
    return this.currentController !== null
  }

  /**
   * Makes a streaming POST request to the specified endpoint.
   * @description Convenience method for streaming POST requests with data.
   * @param endpoint - The API endpoint path
   * @param data - The data to send in the request body
   * @param options - Optional request configuration
   * @returns Promise that resolves to an async iterator of streaming responses
   * @throws {Error} When the request fails or times out
   */
  async postStream<T = unknown>(
    endpoint: string,
    data?: unknown,
    options: Omit<FetchOptions, 'method'> = {}
  ): Promise<AsyncIterable<T>> {
    const { headers = {}, timeout = this.config.timeout }: Omit<FetchOptions, 'method'> = options
    this.currentController = new AbortController()
    this.currentController.setTimeout(timeout)
    const url: string = `${this.config.host}${endpoint}`
    const requestHeaders: Record<string, string> = { ...this.config.headers, ...headers }
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: requestHeaders,
      signal: this.currentController.signal
    }
    if (data !== undefined) {
      fetchOptions.body = JSON.stringify(data)
    }
    try {
      const response: Response = await fetch(url, fetchOptions)
      if (!response.ok) {
        this.cleanupController()
        errorHandler(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          `FetchClient.postStream() -> ${url}`
        )
        return this.createEmptyIterator<T>()
      }
      if (!response.body) {
        this.cleanupController()
        errorHandler(new Error('Response body is null'), `FetchClient.postStream() -> ${url}`)
        return this.createEmptyIterator<T>()
      }
      return this.createStreamIterator<T>(response.body)
    } catch (error: unknown) {
      this.cleanupController()
      errorHandler(error, `FetchClient.postStream() -> ${url}`)
      return this.createEmptyIterator<T>()
    }
  }

  /**
   * Creates an empty async iterator for error cases.
   * @description Returns an empty async iterator when streaming fails.
   * @returns Empty async iterator
   */
  private async *createEmptyIterator<T>(): AsyncIterableIterator<T> {
    // Empty iterator - no items to yield
  }

  /**
   * Creates an async iterator from a ReadableStream for streaming responses.
   * @description Parses streaming JSON responses line by line with abort support.
   * @param body - The response body ReadableStream
   * @returns Async iterator that yields parsed JSON objects
   */
  private async *createStreamIterator<T>(
    body: ReadableStream<Uint8Array>
  ): AsyncIterableIterator<T> {
    const reader: ReadableStreamDefaultReader<Uint8Array> = body.getReader()
    const decoder: TextDecoder = new TextDecoder()
    let buffer: string = ''
    try {
      while (true) {
        if (this.shouldAbortStream()) {
          break
        }
        const { done, value }: ReadableStreamReadResult<Uint8Array> = await reader.read()
        if (done) {
          break
        }
        buffer += decoder.decode(value, { stream: true })
        const lines: string[] = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const parsed of this.processStreamLines<T>(lines)) {
          yield parsed
        }
      }
      if (buffer.trim() !== '') {
        try {
          const parsed: T = JSON.parse(buffer.trim()) as T
          yield parsed
        } catch {
          // Skip invalid JSON
        }
      }
    } finally {
      reader.releaseLock()
      this.cleanupController()
    }
  }

  /**
   * Checks if the stream should be aborted.
   * @description Determines if the current request should be aborted.
   * @returns True if the stream should be aborted, false otherwise
   */
  private shouldAbortStream(): boolean {
    if (this.currentController === null) {
      return false
    }
    return this.currentController.signal.aborted
  }

  /**
   * Processes stream lines and yields parsed JSON objects.
   * @description Parses and yields JSON objects from stream lines.
   * @param lines - Array of lines to process
   */
  private *processStreamLines<T>(lines: string[]): IterableIterator<T> {
    for (const line of lines) {
      const trimmedLine: string = line.trim()
      if (trimmedLine === '') {
        continue
      }
      try {
        const parsed: T = JSON.parse(trimmedLine) as T
        yield parsed
      } catch {
        continue
      }
    }
  }
}
