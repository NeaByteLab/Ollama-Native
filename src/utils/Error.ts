/**
 * Error class for Ollama API operations.
 * @description Extends Error to include HTTP status codes.
 */
export class OllamaError extends Error {
  /** HTTP status code associated with the error */
  status: number
  /** Error message describing what went wrong */
  override message: string

  /**
   * Creates an OllamaError instance.
   * @description Initializes error with status code and message.
   * @param status - HTTP status code (defaults to 500)
   * @param message - Error message (defaults to 'Unknown error')
   */
  constructor(status?: number, message?: string) {
    super(message)
    this.name = 'OllamaError'
    this.status = status ?? 500
    this.message = message ?? 'Unknown error'
  }
}
