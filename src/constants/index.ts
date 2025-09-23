/**
 * The base URL for the Ollama web API.
 * @description Base URL for web search and fetch endpoints.
 */
export const ollamaBase: string = 'https://ollama.com/api'

/**
 * API endpoint mappings for Ollama server communication.
 * @description Centralized endpoint definitions for all Ollama API operations.
 */
export const apiEndpoints: Record<string, string> = {
  /** Endpoint for chat completion requests */
  chat: '/api/chat',
  /** Endpoint for copying models */
  copy: '/api/copy',
  /** Endpoint for creating models */
  create: '/api/create',
  /** Endpoint for deleting models */
  delete: '/api/delete',
  /** Endpoint for embedding requests */
  embed: '/api/embed',
  /** Endpoint for text generation requests */
  generate: '/api/generate',
  /** Endpoint for listing available models */
  list: '/api/tags',
  /** Endpoint for listing running processes */
  ps: '/api/ps',
  /** Endpoint for pulling models from registry */
  pull: '/api/pull',
  /** Endpoint for pushing models to registry */
  push: '/api/push',
  /** Endpoint for showing model information */
  show: '/api/show'
}
