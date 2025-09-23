/**
 * API endpoint mappings for Ollama server communication.
 * @description Centralized endpoint definitions for all Ollama API operations.
 */
export const apiEndpoints: Record<string, string> = {
  /** Endpoint for chat completion requests */
  chat: '/api/chat',
  /** Endpoint for text generation requests */
  generate: '/api/generate',
  /** Endpoint for listing available models */
  list: '/api/tags'
}
