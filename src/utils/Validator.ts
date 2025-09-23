import type { OllamaConfig } from '@interfaces/index'
import { errorHandler } from '@utils/Error'

/**
 * Validates Ollama configuration object for required fields and correct types.
 * @description Validates OllamaConfig including host URL, types, and numeric ranges.
 * @param config - The Ollama configuration object to validate
 * @returns True if the configuration is valid
 * @throws {Error} When configuration validation fails with specific error messages
 */
export function isValidConfig(config: OllamaConfig): boolean {
  const contextStr: string = 'Validator.isValidConfig()'
  if (!config.host || typeof config.host !== 'string') {
    errorHandler(new Error('Invalid host: must be a non-empty string'), contextStr)
    return false
  }
  if (!isValidURL(config.host)) {
    errorHandler(new Error('Invalid host URL: must be a valid HTTP/HTTPS URL'), contextStr)
    return false
  }
  if (
    config.timeout !== undefined &&
    (typeof config.timeout !== 'number' ||
      config.timeout < 1 ||
      config.timeout > Number.MAX_SAFE_INTEGER)
  ) {
    errorHandler(
      new Error('Invalid timeout: must be between 1 and 9007199254740991 milliseconds'),
      contextStr
    )
    return false
  }
  if (config.retries !== undefined && (typeof config.retries !== 'number' || config.retries < 0)) {
    errorHandler(new Error('Invalid retries: must be a non-negative number'), contextStr)
    return false
  }
  if (
    config.headers !== undefined &&
    (typeof config.headers !== 'object' || config.headers == null)
  ) {
    errorHandler(new Error('Invalid headers: must be an object'), contextStr)
    return false
  }
  return true
}

/**
 * Validates if a string is a valid HTTP or HTTPS URL.
 * @description Checks if string is a valid HTTP/HTTPS URL with proper hostname and port.
 * @param url - The URL string to validate
 * @returns True if the URL is valid, false otherwise
 */
export function isValidURL(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }
  try {
    const parsedUrl: URL = new URL(url)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false
    }
    if (!parsedUrl.hostname || parsedUrl.hostname.length === 0) {
      return false
    }
    if (url.endsWith(':')) {
      return false
    }
    if (parsedUrl.port) {
      const port: number = parseInt(parsedUrl.port, 10)
      if (isNaN(port) || port < 1 || port > 65535) {
        return false
      }
    }
    return true
  } catch {
    return false
  }
}
