/**
 * Interface for model details information.
 * @description Detailed information about a specific Ollama model.
 */
export interface ModelDetails {
  /** The parent model identifier */
  parent_model: string
  /** The model format specification */
  format: string
  /** The primary model family */
  family: string
  /** Array of all model families */
  families: string[]
  /** The parameter size of the model */
  parameter_size: string
  /** The quantization level of the model */
  quantization_level: string
}

/**
 * Interface for model data information.
 * @description Comprehensive information about an Ollama model.
 */
export interface ModelData {
  /** The name of the model */
  name: string
  /** The last modification date of the model */
  modified_at: string
  /** The model identifier */
  model: string
  /** The size of the model in bytes */
  size: number
  /** The digest hash of the model */
  digest: string
  /** Detailed information about the model */
  details: ModelDetails
  /** The expiration date of the model */
  expires_at: string
  /** The VRAM size of the model */
  size_vram: number
}

/**
 * Interface for model list response.
 * @description Response structure with available models.
 */
export interface ModelResponse {
  /** Array of available model data */
  models: ModelData[]
}
