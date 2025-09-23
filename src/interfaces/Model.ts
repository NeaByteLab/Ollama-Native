import type { ChatMessage } from '@interfaces/index'

/**
 * Alias for pull operations using the shared transfer interface.
 * @description Type alias for better semantic clarity in pull operations.
 */
export type ModelPullRequest = ModelTransferRequest

/**
 * Alias for push operations using the shared transfer interface.
 * @description Type alias for better semantic clarity in push operations.
 */
export type ModelPushRequest = ModelTransferRequest

/**
 * Interface for model copy request.
 * @description Parameters for copying a model to a new name.
 */
export interface ModelCopyRequest {
  /** The name of the destination model to copy to */
  destination: string
  /** The name of the source model to copy from */
  source: string
}

/**
 * Interface for model create request.
 * @description Parameters for creating a new model from a base model.
 */
export interface ModelCreateRequest {
  /** A key-value map of LoRA adapter configurations */
  adapters?: Record<string, string>
  /** The base model to derive from */
  from: string
  /** The license(s) associated with the model */
  license?: string | string[]
  /** Initial chat messages for the model */
  messages?: ChatMessage[]
  /** The name of the model to create */
  model: string
  /** Additional model parameters as key-value pairs */
  parameters?: Record<string, unknown>
  /** Quantization precision level (q8_0, q4_K_M, etc.) */
  quantize?: string
  /** When true an AsyncGenerator is returned for streaming progress */
  stream?: boolean
  /** The system prompt for the model */
  system?: string
  /** The prompt template to use with the model */
  template?: string
}

/**
 * Interface for model data information.
 * @description Comprehensive information about an Ollama model.
 */
export interface ModelData {
  /** Detailed information about the model */
  details: ModelDetails
  /** The digest hash of the model */
  digest: string
  /** The expiration date of the model */
  expires_at: string
  /** The model identifier */
  model: string
  /** The last modification date of the model */
  modified_at: string
  /** The name of the model */
  name: string
  /** The size of the model in bytes */
  size: number
  /** The VRAM size of the model */
  size_vram: number
}

/**
 * Interface for model delete request.
 * @description Parameters for deleting a model from the local registry.
 */
export interface ModelDeleteRequest {
  /** The name of the model to delete */
  model: string
}

/**
 * Interface for model details information.
 * @description Detailed information about a specific Ollama model.
 */
export interface ModelDetails {
  /** The model format specification */
  format: string
  /** The primary model family */
  family: string
  /** Array of all model families */
  families: string[]
  /** The parent model identifier */
  parent_model: string
  /** The parameter size of the model */
  parameter_size: string
  /** The quantization level of the model */
  quantization_level: string
}

/**
 * Interface for model progress information.
 * @description Information about the progress of a model transfer.
 */
export interface ModelProgress {
  /** The completed size of the model */
  completed: number
  /** The digest of the model */
  digest: string
  /** The status of the model transfer */
  status: string
  /** The total size of the model */
  total: number
}

/**
 * Interface for model list response.
 * @description Response structure with available models.
 */
export interface ModelResponse {
  /** Array of available model data */
  models: ModelData[]
}

/**
 * Interface for model show request.
 * @description Parameters for showing model information and configuration.
 */
export interface ModelShowRequest {
  /** The name of the model to show */
  model: string
  /** Optional runtime configuration options */
  options?: Record<string, unknown>
  /** Optional system prompt override */
  system?: string
  /** Optional template override */
  template?: string
}

/**
 * Interface for model show response.
 * @description Response containing model information and configuration.
 */
export interface ModelShowResponse {
  /** The model details */
  details?: ModelDetails
  /** The model license information */
  license?: string
  /** The model configuration options */
  options?: Record<string, unknown>
  /** The model parameters */
  parameters?: string
  /** The model system prompt */
  system?: string
  /** The model template */
  template?: string
}

/**
 * Interface for model status response.
 * @description Response for model operations that return status information.
 */
export interface ModelStatusResponse {
  /** The status of the operation */
  status: string
}

/**
 * Interface for model pull/push operations.
 * @description Shared interface for both pull and push operations since they have identical parameters.
 */
export interface ModelTransferRequest {
  /** Pull/push from/to servers whose identity cannot be verified */
  insecure?: boolean
  /** The name of the model to transfer */
  model: string
  /** When true an AsyncGenerator is returned for streaming progress */
  stream?: boolean
}
