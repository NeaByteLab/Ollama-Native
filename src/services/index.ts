import type {
  OllamaConfig,
  ModelData,
  RequestGenerate,
  ResponseGenerate,
  ResponseGenerateStream,
  RequestChat,
  ResponseChat,
  ResponseChatStream
} from '@interfaces/index'
import { OllamaClient } from './Client'
import { isValidConfig } from '@utils/index'

/**
 * Service class for interacting with Ollama API.
 * @description High-level interface for Ollama operations.
 */
export class OllamaService {
  /** The internal Ollama client instance */
  private readonly client: OllamaClient

  /**
   * Creates a new OllamaService instance.
   * @description Initializes service with validated configuration.
   * @param config - The Ollama configuration object
   * @throws {Error} When configuration validation fails
   */
  constructor(config: OllamaConfig) {
    isValidConfig(config)
    this.client = new OllamaClient(config)
  }

  /**
   * Retrieves a list of available models from the Ollama server.
   * @description Fetches all available models with metadata.
   * @returns Promise that resolves to an array of model data objects
   * @throws {Error} When the request fails or times out
   */
  list(): Promise<ModelData[]> {
    return this.client.list()
  }

  /**
   * Generates text using the specified Ollama model.
   * @description Sends a generation request to the Ollama server and returns the complete response.
   * @param request - The generation request parameters
   * @returns Promise that resolves to the generation response
   * @throws {Error} When the request fails or times out
   */
  generate(request: RequestGenerate): Promise<ResponseGenerate> {
    return this.client.generate(request)
  }

  /**
   * Generates text using the specified Ollama model with streaming response.
   * @description Sends a streaming generation request to the Ollama server and returns an async iterator.
   * @param request - The generation request parameters (stream will be forced to true)
   * @returns Promise that resolves to an async iterator of streaming responses
   * @throws {Error} When the request fails or times out
   */
  generateStream(
    request: Omit<RequestGenerate, 'stream'>
  ): Promise<AsyncIterable<ResponseGenerateStream>> {
    return this.client.generateStream(request)
  }

  /**
   * Chat completion with tool calling support.
   * @description Sends a chat request to the Ollama server and returns the complete response.
   * @param request - The chat request parameters
   * @returns Promise that resolves to the chat response
   * @throws {Error} When the request fails or times out
   */
  chat(request: RequestChat): Promise<ResponseChat> {
    return this.client.chat(request)
  }

  /**
   * Chat completion with streaming and tool calling support.
   * @description Sends a streaming chat request to the Ollama server and returns an async iterator.
   * @param request - The chat request parameters (stream will be forced to true)
   * @returns Promise that resolves to an async iterator of streaming chat responses
   * @throws {Error} When the request fails or times out
   */
  chatStream(request: Omit<RequestChat, 'stream'>): Promise<AsyncIterable<ResponseChatStream>> {
    return this.client.chatStream(request)
  }

  /**
   * Aborts the current request if one is active.
   * @description Cancels the ongoing request immediately.
   * @returns True if request was aborted, false if no request was active
   */
  abort(): boolean {
    return this.client.abort()
  }

  /**
   * Checks if there's an active request that can be aborted.
   * @description Returns true if a request is currently in progress.
   * @returns True if request is active, false otherwise
   */
  get isActive(): boolean {
    return this.client.isActive
  }
}
