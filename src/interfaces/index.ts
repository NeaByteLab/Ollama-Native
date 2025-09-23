/**
 * Interface for Ollama client configuration.
 * @description Configuration options for Ollama API connection.
 */
export interface OllamaConfig {
  /** The Ollama server host URL */
  host: string
  /** Optional HTTP headers to include in requests */
  headers?: Record<string, string>
  /** Optional request timeout in milliseconds */
  timeout?: number
  /** Optional number of retry attempts for failed requests */
  retries?: number
}

/**
 * Re-export all interfaces
 * @description Re-export all interfaces from their respective files.
 */
export * from '@interfaces/Model'
export * from '@interfaces/Tool'
