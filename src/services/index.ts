import type {
  EmbedRequest,
  EmbedResponse,
  OllamaConfig,
  ModelData,
  ModelPullRequest,
  ModelPushRequest,
  ModelProgress,
  ModelDeleteRequest,
  ModelCopyRequest,
  ModelCreateRequest,
  ModelShowRequest,
  ModelStatusResponse,
  ModelShowResponse,
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
   * Aborts the current request if one is active.
   * @description Cancels the ongoing request immediately.
   * @returns True if request was aborted, false if no request was active
   */
  abort(): boolean {
    return this.client.abort()
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
   * Copies a model to a new name.
   * @description Creates a copy of an existing model with a new name.
   * @param request - The copy request parameters
   * @returns Promise that resolves to the model status response
   * @throws {Error} When the request fails or times out
   */
  copy(request: ModelCopyRequest): Promise<ModelStatusResponse> {
    return this.client.copy(request)
  }

  /**
   * Creates a new model from a base model.
   * @description Creates a custom model with specified parameters, quantization, and configuration.
   * @param request - The create request parameters
   * @returns Promise that resolves to an async iterator of progress updates
   * @throws {Error} When the request fails or times out
   */
  create(request: ModelCreateRequest): Promise<AsyncIterable<ModelProgress>> {
    return this.client.create(request)
  }

  /**
   * Deletes a model from the local registry.
   * @description Removes a model from the local Ollama installation.
   * @param request - The delete request parameters
   * @returns Promise that resolves to the model status response
   * @throws {Error} When the request fails or times out
   */
  delete(request: ModelDeleteRequest): Promise<ModelStatusResponse> {
    return this.client.delete(request)
  }

  /**
   * Generates embeddings using the specified Ollama model.
   * @description Sends an embedding request to the Ollama server and returns the embeddings.
   * @param request - The embedding request parameters
   * @returns Promise that resolves to the embedding response
   * @throws {Error} When the request fails or times out
   */
  embed(request: EmbedRequest): Promise<EmbedResponse> {
    return this.client.embed(request)
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
   * Checks if there's an active request that can be aborted.
   * @description Returns true if a request is currently in progress.
   * @returns True if request is active, false otherwise
   */
  get isActive(): boolean {
    return this.client.isActive
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
   * Retrieves a list of running processes from the Ollama server.
   * @description Fetches all currently running model processes with metadata.
   * @returns Promise that resolves to an array of model data objects
   * @throws {Error} When the request fails or times out
   */
  ps(): Promise<ModelData[]> {
    return this.client.ps()
  }

  /**
   * Pulls a model from the Ollama registry.
   * @description Downloads a model from the registry with streaming progress updates.
   * @param request - The pull request parameters
   * @returns Promise that resolves to an async iterator of progress updates
   * @throws {Error} When the request fails or times out
   */
  pull(request: ModelPullRequest): Promise<AsyncIterable<ModelProgress>> {
    return this.client.pull(request)
  }

  /**
   * Pushes a model to the Ollama registry.
   * @description Uploads a model to the registry with streaming progress updates.
   * @param request - The push request parameters
   * @returns Promise that resolves to an async iterator of progress updates
   * @throws {Error} When the request fails or times out
   */
  push(request: ModelPushRequest): Promise<AsyncIterable<ModelProgress>> {
    return this.client.push(request)
  }

  /**
   * Shows model information and configuration.
   * @description Retrieves detailed information about a model including its configuration.
   * @param request - The show request parameters
   * @returns Promise that resolves to the model show response
   * @throws {Error} When the request fails or times out
   */
  show(request: ModelShowRequest): Promise<ModelShowResponse> {
    return this.client.show(request)
  }
}
