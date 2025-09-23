import type { ToolCall } from '@interfaces/Tool'
import type { ChatMessage } from '@interfaces/Request'

/**
 * Interface for Ollama generation response (non-streaming).
 * @description Response structure for completed text generation.
 */
export interface ResponseGenerate {
  /** Timestamp when response was created */
  created_at?: string
  /** Context array for continuing the conversation */
  context?: number[]
  /** Whether the generation was completed successfully */
  done: boolean
  /** Number of tokens generated */
  eval_count?: number
  /** Time taken for token generation in nanoseconds */
  eval_duration?: number
  /** Time taken to load the model in nanoseconds */
  load_duration?: number
  /** Model name used for generation */
  model?: string
  /** Number of tokens in the prompt */
  prompt_eval_count?: number
  /** Time taken for prompt evaluation in nanoseconds */
  prompt_eval_duration?: number
  /** The generated text content */
  response: string
  /** Thinking process content (for thinking models) */
  thinking?: string
  /** Array of tool calls made by the model */
  tool_calls?: ToolCall[]
  /** Array of tools available for the model to call */
  tools?: ToolCall[]
  /** Total time taken for generation in nanoseconds */
  total_duration?: number
}

/**
 * Interface for Ollama streaming generation response.
 * @description Response structure for streaming text generation chunks.
 */
export interface ResponseGenerateStream {
  /** Timestamp when response was created */
  created_at?: string
  /** Context array for continuing the conversation */
  context?: number[]
  /** Whether the generation is complete */
  done: boolean
  /** Number of tokens generated */
  eval_count?: number
  /** Time taken for token generation in nanoseconds */
  eval_duration?: number
  /** Time taken to load the model in nanoseconds */
  load_duration?: number
  /** Model name used for generation */
  model?: string
  /** Number of tokens in the prompt */
  prompt_eval_count?: number
  /** Time taken for prompt evaluation in nanoseconds */
  prompt_eval_duration?: number
  /** The generated text chunk */
  response?: string
  /** Thinking process content (for thinking models) */
  thinking?: string
  /** Array of tool calls made by the model */
  tool_calls?: ToolCall[]
  /** Array of tools available for the model to call */
  tools?: ToolCall[]
  /** Total time taken for generation in nanoseconds */
  total_duration?: number
}

/**
 * Interface for Ollama chat completion response (non-streaming).
 * @description Response structure for completed chat completion.
 */
export interface ResponseChat {
  /** Timestamp when response was created */
  created_at?: string
  /** Whether the generation was completed successfully */
  done: boolean
  /** Number of tokens generated */
  eval_count?: number
  /** Time taken for token generation in nanoseconds */
  eval_duration?: number
  /** Time taken to load the model in nanoseconds */
  load_duration?: number
  /** The generated message content */
  message: ChatMessage
  /** Model name used for generation */
  model?: string
  /** Number of tokens in the prompt */
  prompt_eval_count?: number
  /** Time taken for prompt evaluation in nanoseconds */
  prompt_eval_duration?: number
  /** Thinking process content (for thinking models) */
  thinking?: string
  /** Total time taken for generation in nanoseconds */
  total_duration?: number
}

/**
 * Interface for Ollama streaming chat completion response.
 * @description Response structure for streaming chat completion chunks.
 */
export interface ResponseChatStream {
  /** Timestamp when response was created */
  created_at?: string
  /** Whether the generation is complete */
  done: boolean
  /** Number of tokens generated */
  eval_count?: number
  /** Time taken for token generation in nanoseconds */
  eval_duration?: number
  /** Time taken to load the model in nanoseconds */
  load_duration?: number
  /** The generated message content */
  message?: ChatMessage
  /** Model name used for generation */
  model?: string
  /** Number of tokens in the prompt */
  prompt_eval_count?: number
  /** Time taken for prompt evaluation in nanoseconds */
  prompt_eval_duration?: number
  /** Thinking process content (for thinking models) */
  thinking?: string
  /** Total time taken for generation in nanoseconds */
  total_duration?: number
}
