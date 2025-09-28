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
import { OllamaError, isValidURL } from '@utils/index'

/**
 * Ollama client for HTTP communication.
 * @description Handles API communication with Ollama server.
 */
export class OllamaClient {
  /** The fetch client for making HTTP requests */
  private readonly fetchClient: FetchClient
  /** The configuration for the Ollama client */
  private readonly config: OllamaConfig

  /**
   * Creates an OllamaClient instance.
   * @description Initializes client with configuration.
   * @param config - Configuration for the client
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
   * @description Sends a chat request to the Ollama server with optional streaming.
   * @param request - Chat request parameters
   * @returns Promise resolving to chat response or async iterator for streaming
   * @throws {Error} When request fails or times out
   */
  async chat(request: RequestChat): Promise<ResponseChat | AsyncIterable<ResponseChatStream>> {
    if (request.stream === false) {
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
        throw new OllamaError(500, 'No response received from Ollama server')
      }
      return finalResponse
    }
    const streamRequest: RequestChat = { ...request, stream: true }
    return this.fetchClient.postStream<ResponseChatStream>(
      apiEndpoints['chat'] ?? '',
      streamRequest
    )
  }

  /**
   * Copies a model to a new name.
   * @param request - Copy request parameters
   * @returns Promise resolving to model status response
   * @throws {Error} When request fails or times out
   */
  async copy(request: ModelCopyRequest): Promise<ModelStatusResponse> {
    return this.fetchClient.post<ModelStatusResponse>(apiEndpoints['copy'] ?? '', request)
  }

  /**
   * Creates a new model from a base model.
   * @param request - Create request parameters
   * @returns Promise resolving to progress updates iterator or status response
   * @throws {Error} When request fails or times out
   */
  async create(
    request: ModelCreateRequest
  ): Promise<AsyncIterable<ModelProgress> | ModelStatusResponse> {
    if (request.stream === false) {
      return this.fetchClient.post<ModelStatusResponse>(apiEndpoints['create'] ?? '', request)
    }
    const streamRequest: ModelCreateRequest = { ...request, stream: true }
    return this.fetchClient.postStream<ModelProgress>(apiEndpoints['create'] ?? '', streamRequest)
  }

  /**
   * Deletes a model from the local registry.
   * @param request - Delete request parameters
   * @returns Promise resolving to model status response
   * @throws {Error} When request fails or times out
   */
  async delete(request: ModelDeleteRequest): Promise<ModelStatusResponse> {
    return this.fetchClient.delete<ModelStatusResponse>(apiEndpoints['delete'] ?? '', {
      data: { name: request.model }
    })
  }

  /**
   * Generates embeddings using the specified model.
   * @description Sends an embedding request to the Ollama server and returns the embeddings.
   * @param request - Embedding request parameters
   * @returns Promise resolving to embedding response
   * @throws {Error} When request fails or times out
   */
  async embed(request: EmbedRequest): Promise<EmbedResponse> {
    return this.fetchClient.post<EmbedResponse>(apiEndpoints['embed'] ?? '', request)
  }

  /**
   * Generates text using the specified model.
   * @description Sends a generation request to the Ollama server with optional streaming.
   * @param request - Generation request parameters
   * @returns Promise resolving to generation response or async iterator for streaming
   * @throws {Error} When request fails or times out
   */
  async generate(
    request: RequestGenerate
  ): Promise<ResponseGenerate | AsyncIterable<ResponseGenerateStream>> {
    if (request.stream === false) {
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
        throw new OllamaError(500, 'No response received from Ollama server')
      }
      return finalResponse
    }
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
   * @description Downloads a model from the registry with optional streaming progress updates.
   * @param request - The pull request parameters
   * @returns Promise that resolves to an async iterator of progress updates or status response
   * @throws {Error} When the request fails or times out
   */
  async pull(
    request: ModelPullRequest
  ): Promise<AsyncIterable<ModelProgress> | ModelStatusResponse> {
    if (request.stream === false) {
      return this.fetchClient.post<ModelStatusResponse>(apiEndpoints['pull'] ?? '', request)
    }
    const streamRequest: ModelPullRequest = { ...request, stream: true }
    return this.fetchClient.postStream<ModelProgress>(apiEndpoints['pull'] ?? '', streamRequest)
  }

  /**
   * Pushes a model to the Ollama registry.
   * @description Uploads a model to the registry with optional streaming progress updates.
   * @param request - The push request parameters
   * @returns Promise that resolves to an async iterator of progress updates or status response
   * @throws {Error} When the request fails or times out
   */
  async push(
    request: ModelPushRequest
  ): Promise<AsyncIterable<ModelProgress> | ModelStatusResponse> {
    if (request.stream === false) {
      return this.fetchClient.post<ModelStatusResponse>(apiEndpoints['push'] ?? '', request)
    }
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
      throw new OllamaError(400, 'Invalid URL: must be a valid HTTP/HTTPS URL')
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
      throw new OllamaError(400, 'Invalid query: must be a non-empty string')
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
