import type { RequestOptions } from '@interfaces/Request'

/**
 * Interface for embed request.
 * @description Request structure for embed operations.
 */
export interface EmbedRequest {
  /** The model used for the embed operation */
  model: string
  /** The input text for the embed operation */
  input: string | string[]
  /** Whether to truncate the input text */
  truncate?: boolean
  /** The keep alive duration for the embed operation */
  keep_alive?: string | number
  /** The dimensions for the embed operation */
  dimensions?: number
  /** The options for the embed operation */
  options?: Partial<RequestOptions>
}

/**
 * Interface for embed response.
 * @description Response structure for embed operations.
 */
export interface EmbedResponse {
  /** The model used for the embed operation */
  model: string
  /** The embeddings generated for the input text */
  embeddings: number[][]
  /** The total duration of the embed operation */
  total_duration: number
  /** The load duration of the embed operation */
  load_duration: number
  /** The number of prompt evaluations for the embed operation */
  prompt_eval_count: number
}
