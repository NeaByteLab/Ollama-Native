/**
 * Handles errors by adding context and re-throwing with formatted message.
 * @description Takes an unknown error and context string, then throws a new error with formatted message.
 * @param error - The error to handle (can be Error instance or unknown type)
 * @param context - The context where the error occurred (e.g., 'MyFunction.processData()')
 * @throws {Error} Always throws a new error with context and original message
 */
export function errorHandler(error: unknown, context: string): void {
  const errorStack: string =
    error instanceof Error ? (error.stack ?? 'Unknown stack') : 'Unknown stack'
  throw new Error(`[ Context: ${context} ]\n -> Stack: ${errorStack}`)
}
