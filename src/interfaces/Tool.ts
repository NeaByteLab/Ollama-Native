/**
 * Interface for tool item schema definition.
 * @description Defines the structure and validation rules for tool parameters.
 */
export interface ToolItems {
  /** The data type of the tool item */
  type: 'string' | 'array' | 'object'
  /** Description of what this tool item represents */
  description: string
  /** Nested properties for object types */
  properties?: Record<string, ToolItems>
  /** Item definition for array types */
  items?: ToolItems
  /** Enum values for string types */
  enum?: string[]
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
    /** The name of the function */
    name?: string
    /** Description of what the function does */
    description?: string
    /** Parameter schema definition */
    parameters?: {
      /** The type of the parameters object */
      type?: 'object'
      /** Properties of the parameters */
      properties?: Record<string, ToolItems>
      /** Item definition for array parameters */
      items?: ToolItems
      /** Enum values for parameters */
      enum?: string[]
      /** Required parameter names */
      required?: string[]
    }
  }
}
