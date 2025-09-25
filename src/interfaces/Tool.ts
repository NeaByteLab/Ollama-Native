/**
 * Interface for tool item schema definition.
 * @description Defines the structure and validation rules for tool parameters.
 */
export interface ToolItems {
  /** Description of what this tool item represents */
  description: string
  /** The data type of the tool item */
  type: 'string' | 'array' | 'object'
  /** Enum values for string types */
  enum?: string[]
  /** Item definition for array types */
  items?: ToolItems
  /** Nested properties for object types */
  properties?: Record<string, ToolItems>
}

/**
 * Interface for tool call definition.
 * @description Represents a function call tool with its parameters and metadata.
 */
export interface ToolCall {
  /** The type of tool call */
  type: 'function'
  /** Function definition and parameters */
  function: {
    /** Description of what the function does */
    description?: string
    /** The name of the function */
    name?: string
    /** Parameter schema definition */
    parameters?: {
      /** The type of the parameters object */
      type?: 'object'
      /** Enum values for parameters */
      enum?: string[]
      /** Item definition for array parameters */
      items?: ToolItems
      /** Properties of the parameters */
      properties?: Record<string, ToolItems>
      /** Required parameter names */
      required?: string[]
    }
  }
}

/**
 * Interface for tool call response.
 * @description Represents an actual tool call made by the model with arguments.
 */
export interface ToolResponse {
  /** The type of tool call */
  type: 'function'
  /** Function call with actual arguments */
  function: {
    /** The actual arguments passed to the function */
    arguments?: Record<string, unknown>
    /** The name of the function being called */
    name?: string
  }
}
