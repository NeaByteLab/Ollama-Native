import type { OllamaConfig, ModelData } from '@interfaces/index'
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
}
