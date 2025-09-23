import type {
  EmbedRequest,
  EmbedResponse,
  ModelCopyRequest,
  ModelCreateRequest,
  ModelData,
  ModelDeleteRequest,
  ModelProgress,
  ModelPullRequest,
  ModelPushRequest,
  ModelResponse,
  ModelShowRequest,
  ModelShowResponse,
  ModelStatusResponse,
  OllamaConfig,
  RequestChat,
  RequestGenerate,
  ResponseChat,
  ResponseChatStream,
  ResponseGenerate,
  ResponseGenerateStream,
  WebFetchRequest,
  WebFetchResponse,
  WebSearchRequest,
  WebSearchResponse
} from '@interfaces/index'
import { ollamaBase, apiEndpoints } from '@constants/index'
import { FetchClient } from '@services/Fetch'
import { errorHandler, isValidURL } from '@utils/index'

/**
 * Low-level Ollama client for HTTP communication.
 * @description Handles direct API communication with Ollama server.
 */
export class OllamaClient {
  /** The fetch client for making HTTP requests */
  private readonly fetchClient: FetchClient
  /** The configuration for the Ollama client */
  private readonly config: OllamaConfig

  /**
   * Creates a new OllamaClient instance.
   * @description Initializes the client with the provided configuration.
   * @param config - The configuration for the Ollama client
   */
  constructor(config: OllamaConfig) {
    this.config = config
    this.fetchClient = new FetchClient(config)
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
   * Copies a model to a new name.
   * @description Creates a copy of an existing model with a new name.
   * @param request - The copy request parameters
   * @returns Promise that resolves to the model status response
   * @throws {Error} When the request fails or times out
   */
  async copy(request: ModelCopyRequest): Promise<ModelStatusResponse> {
    return this.fetchClient.post<ModelStatusResponse>(apiEndpoints['copy'] ?? '', request)
  }

  /**
   * Creates a new model from a base model.
   * @description Creates a custom model with specified parameters, quantization, and configuration.
   * @param request - The create request parameters
   * @returns Promise that resolves to an async iterator of progress updates
   * @throws {Error} When the request fails or times out
   */
  async create(request: ModelCreateRequest): Promise<AsyncIterable<ModelProgress>> {
    const streamRequest: ModelCreateRequest = { ...request, stream: true }
    return this.fetchClient.postStream<ModelProgress>(apiEndpoints['create'] ?? '', streamRequest)
  }

  /**
   * Deletes a model from the local registry.
   * @description Removes a model from the local Ollama installation.
   * @param request - The delete request parameters
   * @returns Promise that resolves to the model status response
   * @throws {Error} When the request fails or times out
   */
  async delete(request: ModelDeleteRequest): Promise<ModelStatusResponse> {
    return this.fetchClient.delete<ModelStatusResponse>(apiEndpoints['delete'] ?? '', {
      data: { name: request.model }
    })
  }

  /**
   * Generates embeddings using the specified Ollama model.
   * @description Sends an embedding request to the Ollama server and returns the embeddings.
   * @param request - The embedding request parameters
   * @returns Promise that resolves to the embedding response
   * @throws {Error} When the request fails or times out
   */
  async embed(request: EmbedRequest): Promise<EmbedResponse> {
    return this.fetchClient.post<EmbedResponse>(apiEndpoints['embed'] ?? '', request)
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
   * Checks if there's an active request that can be aborted.
   * @description Returns true if a request is currently in progress.
   * @returns True if request is active, false otherwise
   */
  get isActive(): boolean {
    return this.fetchClient.isActive
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
   * Retrieves a list of running processes from the Ollama server.
   * @description Fetches all currently running model processes with metadata.
   * @returns Promise that resolves to an array of model data objects
   * @throws {Error} When the request fails or times out
   */
  async ps(): Promise<ModelData[]> {
    const data: ModelResponse = await this.fetchClient.get<ModelResponse>(apiEndpoints['ps'] ?? '')
    return data.models
  }

  /**
   * Pulls a model from the Ollama registry.
   * @description Downloads a model from the registry with streaming progress updates.
   * @param request - The pull request parameters
   * @returns Promise that resolves to an async iterator of progress updates
   * @throws {Error} When the request fails or times out
   */
  async pull(request: ModelPullRequest): Promise<AsyncIterable<ModelProgress>> {
    const streamRequest: ModelPullRequest = { ...request, stream: true }
    return this.fetchClient.postStream<ModelProgress>(apiEndpoints['pull'] ?? '', streamRequest)
  }

  /**
   * Pushes a model to the Ollama registry.
   * @description Uploads a model to the registry with streaming progress updates.
   * @param request - The push request parameters
   * @returns Promise that resolves to an async iterator of progress updates
   * @throws {Error} When the request fails or times out
   */
  async push(request: ModelPushRequest): Promise<AsyncIterable<ModelProgress>> {
    const streamRequest: ModelPushRequest = { ...request, stream: true }
    return this.fetchClient.postStream<ModelProgress>(apiEndpoints['push'] ?? '', streamRequest)
  }

  /**
   * Shows model information and configuration.
   * @description Retrieves detailed information about a model including its configuration.
   * @param request - The show request parameters
   * @returns Promise that resolves to the model show response
   * @throws {Error} When the request fails or times out
   */
  async show(request: ModelShowRequest): Promise<ModelShowResponse> {
    return this.fetchClient.post<ModelShowResponse>(apiEndpoints['show'] ?? '', request)
  }

  /**
   * Fetches a single page using the Ollama web fetch API.
   * @description Retrieves content from a URL using Ollama's web fetch service.
   * @param request - The fetch request containing a URL
   * @returns Promise that resolves to the fetch result
   * @throws {Error} When the request is invalid or the server returns an error
   */
  async webFetch(request: WebFetchRequest): Promise<WebFetchResponse> {
    if (!isValidURL(request.url)) {
      errorHandler(
        new Error('Invalid URL: must be a valid HTTP/HTTPS URL'),
        'OllamaClient.webFetch()'
      )
    }
    const webConfig: OllamaConfig = {
      host: ollamaBase,
      ...this.config.headers !== undefined && { headers: this.config.headers },
      ...this.config.timeout !== undefined && { timeout: this.config.timeout },
      ...this.config.retries !== undefined && { retries: this.config.retries }
    }
    const webFetchClient: FetchClient = new FetchClient(webConfig)
    return webFetchClient.post<WebFetchResponse>('/web_fetch', request)
  }

  /**
   * Performs web search using the Ollama web search API.
   * @description Searches the web using Ollama's web search service.
   * @param request - The search request containing query and options
   * @returns Promise that resolves to the search results
   * @throws {Error} When the request is invalid or the server returns an error
   */
  async webSearch(request: WebSearchRequest): Promise<WebSearchResponse> {
    if (!request.query || request.query.length === 0) {
      errorHandler(
        new Error('Invalid query: must be a non-empty string'),
        'OllamaClient.webSearch()'
      )
    }
    const webConfig: OllamaConfig = {
      host: ollamaBase,
      ...this.config.headers !== undefined && { headers: this.config.headers },
      ...this.config.timeout !== undefined && { timeout: this.config.timeout },
      ...this.config.retries !== undefined && { retries: this.config.retries }
    }
    const webFetchClient: FetchClient = new FetchClient(webConfig)
    return webFetchClient.post<WebSearchResponse>('/web_search', request)
  }
}
