import type { OllamaConfig, ModelResponse, ModelData } from '@interfaces/index'
import { FetchClient } from '@services/Fetch'

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
    const data: ModelResponse = await this.fetchClient.get<ModelResponse>('/api/tags')
    return data.models
  }
}
