import type { ToolCall, ToolResponse } from '@interfaces/Tool'
import type { ChatMessage } from '@interfaces/Request'

/**
 * Base interface for all response types.
 * @description Common fields shared across all Ollama responses.
 */
interface ResponseBase {
  /** Timestamp when response was created */
  created_at?: string
  /** Whether the generation was completed successfully */
  done: boolean
  /** Reason for completion */
  done_reason?: string
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
  /** Thinking process content (for thinking models) */
  thinking?: string
  /** Array of tool calls made by the model */
  tool_calls?: ToolResponse[]
  /** Total time taken for generation in nanoseconds */
  total_duration?: number
}

/**
 * Base interface for chat responses.
 * @description Common fields for chat completion responses.
 */
interface ChatBase extends ResponseBase {
  /** The generated message content */
  message: ChatMessage
}

/**
 * Base interface for generate responses.
 * @description Common fields for text generation responses.
 */
interface GenerateBase extends ResponseBase {
  /** Context array for continuing the conversation */
  context?: number[]
  /** The generated text content */
  response: string
  /** Array of tools available for the model to call */
  tools?: ToolCall[]
}

/**
 * Interface for Ollama chat completion response (non-streaming).
 * @description Response structure for completed chat completion.
 */
export type ResponseChat = ChatBase

/**
 * Interface for Ollama generation response (non-streaming).
 * @description Response structure for completed text generation.
 */
export type ResponseGenerate = GenerateBase

/**
 * Interface for Ollama streaming generation response.
 * @description Response structure for streaming text generation chunks.
 */
export interface ResponseGenerateStream extends Omit<GenerateBase, 'response'> {
  /** The generated text chunk */
  response?: string
}

/**
 * Interface for Ollama streaming chat completion response.
 * @description Response structure for streaming chat completion chunks.
 */
export interface ResponseChatStream extends Omit<ChatBase, 'message'> {
  /** The generated message content */
  message?: ChatMessage
}
