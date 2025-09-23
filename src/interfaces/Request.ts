import type { ToolCall } from '@interfaces/Tool'

/**
 * Type for thinking mode in Ollama requests.
 * @description Represents the level of thinking in the model's response.
 */
export type RequestThinking = boolean | 'high' | 'medium' | 'low'

/**
 * Interface for chat message in Ollama chat API.
 * @description Represents a single message in a chat conversation.
 */
export interface ChatMessage {
  /** The content of the message */
  content: string
  /** The role of the message sender */
  role: 'system' | 'user' | 'assistant' | 'tool'
  /** Optional images to be included in the message */
  images?: Uint8Array[] | string[]
  /** Optional tool call ID for tool responses */
  tool_call_id?: string
  /** Optional tool calls made by the assistant */
  tool_calls?: ToolCall[]
  /** Optional name of the tool that was executed */
  tool_name?: string
}

/**
 * Interface for Ollama model generation options.
 * @description Configuration options for controlling model behavior during text generation.
 */
export interface RequestOptions {
  /** Apply penalty to newline tokens */
  penalize_newline: boolean
  /** Enable low VRAM mode */
  low_vram: boolean
  /** Enable NUMA (Non-Uniform Memory Access) optimization */
  numa: boolean
  /** Only generate embeddings */
  embedding_only: boolean
  /** Use 16-bit floating point for key-value cache */
  f16_kv: boolean
  /** Penalty for frequency of tokens */
  frequency_penalty: number
  /** Return logits for all tokens */
  logits_all: boolean
  /** Main GPU index to use */
  main_gpu: number
  /** Mirostat sampling algorithm version */
  mirostat: number
  /** Mirostat eta parameter */
  mirostat_eta: number
  /** Mirostat tau parameter */
  mirostat_tau: number
  /** Batch size for processing */
  num_batch: number
  /** Context window size for the model */
  num_ctx: number
  /** Number of tokens to keep in context */
  num_keep: number
  /** Maximum number of tokens to predict */
  num_predict: number
  /** Number of threads to use */
  num_thread: number
  /** Number of GPUs to use */
  num_gpu: number
  /** Penalty for presence of tokens */
  presence_penalty: number
  /** Penalty for repeating tokens */
  repeat_penalty: number
  /** Number of last tokens to consider for repeat penalty */
  repeat_last_n: number
  /** Random seed for reproducible generation */
  seed: number
  /** Array of stop sequences */
  stop: string[]
  /** Temperature for sampling (0.0 to 1.0) */
  temperature: number
  /** Top-k sampling parameter */
  top_k: number
  /** Top-p (nucleus) sampling parameter */
  top_p: number
  /** Tail free sampling parameter */
  tfs_z: number
  /** Typical-p sampling parameter */
  typical_p: number
  /** Lock model in memory */
  use_mlock: boolean
  /** Use memory mapping for model files */
  use_mmap: boolean
  /** Only return vocabulary information */
  vocab_only: boolean
}

/**
 * Interface for Ollama text generation request.
 * @description Complete request structure for generating text with Ollama models.
 */
export interface RequestGenerate {
  /** Optional context array from previous generation */
  context?: number[]
  /** Output format specification */
  format?: string | object
  /** Array of images to include in the request */
  images?: Uint8Array[] | string[]
  /** Keep model loaded for specified duration */
  keep_alive?: string | number
  /** The name of the model to use for generation */
  model: string
  /** Optional generation parameters */
  options?: Partial<RequestOptions>
  /** The input prompt for text generation */
  prompt: string
  /** Return raw model output without formatting */
  raw?: boolean
  /** Enable streaming response mode */
  stream?: boolean
  /** Optional suffix to append to the prompt */
  suffix?: string
  /** Optional system message to set model behavior */
  system?: string
  /** Optional template for formatting the prompt */
  template?: string
  /** Enable thinking mode with specified level */
  think?: RequestThinking
  /** Array of tools available for the model to call */
  tools?: ToolCall[]
}

/**
 * Interface for Ollama chat completion request.
 * @description Complete request structure for chat completion with tool calling support.
 */
export interface RequestChat {
  /** Output format specification */
  format?: string | object
  /** Array of images to include in the request */
  images?: Uint8Array[] | string[]
  /** Keep model loaded for specified duration */
  keep_alive?: string | number
  /** Array of messages in the conversation */
  messages: ChatMessage[]
  /** The name of the model to use for the chat */
  model: string
  /** Optional generation parameters */
  options?: Partial<RequestOptions>
  /** Return raw model output without formatting */
  raw?: boolean
  /** Enable streaming response mode */
  stream?: boolean
  /** Optional system message to set model behavior */
  system?: string
  /** Optional template for formatting the prompt */
  template?: string
  /** Enable thinking mode with specified level */
  think?: RequestThinking
  /** Array of tools available for the model to call */
  tools?: ToolCall[]
}
