import type {
  ModelData,
  ModelResponse,
  OllamaConfig,
  RequestChat,
  RequestGenerate,
  ResponseChat,
  ResponseChatStream,
  ResponseGenerate,
  ResponseGenerateStream
} from '@interfaces/index'
import { apiEndpoints } from '@constants/index'
import { FetchClient } from '@services/Fetch'
import { errorHandler } from '@utils/index'

/**
 * Low-level Ollama client for HTTP communication.
 * @description Handles direct API communication with Ollama server.
 */
export class OllamaClient {
  /** The fetch client for making HTTP requests */
  private readonly fetchClient: FetchClient

  /**
   * Creates a new OllamaClient instance.
   * @description Initializes the client with the provided configuration.
   * @param config - The configuration for the Ollama client
   */
  constructor(config: OllamaConfig) {
    this.fetchClient = new FetchClient(config)
  }

  /**
   * Retrieves a list of available models from the Ollama server.
   * @description Fetches all available models with metadata.
   * @returns Promise that resolves to an array of model data objects
   * @throws {Error} When the request fails or times out
   */
  async list(): Promise<ModelData[]> {
    const data: ModelResponse = await this.fetchClient.get<ModelResponse>(
      apiEndpoints['list'] ?? ''
    )
    return data.models
  }

  /**
   * Chat completion with tool calling support.
   * @description Sends a chat request to the Ollama server and returns the complete response.
   * @param request - The chat request parameters
   * @returns Promise that resolves to the chat response
   * @throws {Error} When the request fails or times out
   */
  async chat(request: RequestChat): Promise<ResponseChat> {
    const nonStreamRequest: RequestChat = { ...request, stream: false }
    const stream: AsyncIterable<ResponseChat> = await this.fetchClient.postStream<ResponseChat>(
      apiEndpoints['chat'] ?? '',
      nonStreamRequest
    )
    let finalResponse: ResponseChat | null = null
    for await (const chunk of stream) {
      finalResponse = chunk
      if (chunk.done) {
        break
      }
    }
    if (finalResponse === null) {
      errorHandler(new Error('No response received from Ollama server'), 'OllamaClient.chat()')
    }
    return finalResponse as ResponseChat
  }

  /**
   * Chat completion with streaming and tool calling support.
   * @description Sends a streaming chat request to the Ollama server and returns an async iterator.
   * @param request - The chat request parameters (stream will be forced to true)
   * @returns Promise that resolves to an async iterator of streaming chat responses
   * @throws {Error} When the request fails or times out
   */
  async chatStream(
    request: Omit<RequestChat, 'stream'>
  ): Promise<AsyncIterable<ResponseChatStream>> {
    const streamRequest: RequestChat = { ...request, stream: true }
    return this.fetchClient.postStream<ResponseChatStream>(
      apiEndpoints['chat'] ?? '',
      streamRequest
    )
  }

  /**
   * Generates text using the specified Ollama model.
   * @description Sends a generation request to the Ollama server and returns the complete response.
   * @param request - The generation request parameters
   * @returns Promise that resolves to the generation response
   * @throws {Error} When the request fails or times out
   */
  async generate(request: RequestGenerate): Promise<ResponseGenerate> {
    const nonStreamRequest: RequestGenerate = { ...request, stream: false }
    const stream: AsyncIterable<ResponseGenerate> =
      await this.fetchClient.postStream<ResponseGenerate>(
        apiEndpoints['generate'] ?? '',
        nonStreamRequest
      )
    let finalResponse: ResponseGenerate | null = null
    for await (const chunk of stream) {
      finalResponse = chunk
      if (chunk.done) {
        break
      }
    }
    if (finalResponse === null) {
      errorHandler(new Error('No response received from Ollama server'), 'OllamaClient.generate()')
    }
    return finalResponse as ResponseGenerate
  }

  /**
   * Generates text using the specified Ollama model with streaming response.
   * @description Sends a streaming generation request to the Ollama server and returns an async iterator.
   * @param request - The generation request parameters (stream will be forced to true)
   * @returns Promise that resolves to an async iterator of streaming responses
   * @throws {Error} When the request fails or times out
   */
  async generateStream(
    request: Omit<RequestGenerate, 'stream'>
  ): Promise<AsyncIterable<ResponseGenerateStream>> {
    const streamRequest: RequestGenerate = { ...request, stream: true }
    return this.fetchClient.postStream<ResponseGenerateStream>(
      apiEndpoints['generate'] ?? '',
      streamRequest
    )
  }

  /**
   * Aborts the current request if one is active.
   * @description Cancels the ongoing request immediately.
   * @returns True if request was aborted, false if no request was active
   */
  abort(): boolean {
    return this.fetchClient.abort()
  }

  /**
   * Checks if there's an active request that can be aborted.
   * @description Returns true if a request is currently in progress.
   * @returns True if request is active, false otherwise
   */
  get isActive(): boolean {
    return this.fetchClient.isActive
  }
}
