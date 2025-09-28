import type { OllamaConfig } from '@interfaces/index'
import { OllamaError } from '@utils/index'

/**
 * Validates Ollama configuration object.
 * @description Checks required fields and types for OllamaConfig.
 * @param config - Configuration object to validate
 * @returns True if valid
 * @throws {Error} When validation fails
 */
export function isValidConfig(config: OllamaConfig): boolean {
  if (!config.host || typeof config.host !== 'string') {
    throw new OllamaError(400, 'Invalid host: must be a non-empty string')
  }
  if (!isValidURL(config.host)) {
    throw new OllamaError(400, 'Invalid host URL: must be a valid HTTP/HTTPS URL')
  }
  if (
    config.timeout !== undefined &&
    (typeof config.timeout !== 'number' || config.timeout < 1000 || config.timeout > 86400000)
  ) {
    throw new OllamaError(
      400,
      'Invalid timeout: must be between 1000 and 86400000 milliseconds (1 second to 1 day)'
    )
  }
  if (config.retries !== undefined && (typeof config.retries !== 'number' || config.retries < 0)) {
    throw new OllamaError(400, 'Invalid retries: must be a non-negative number')
  }
  if (
    config.headers !== undefined &&
    (typeof config.headers !== 'object' || config.headers == null)
  ) {
    throw new OllamaError(400, 'Invalid headers: must be an object')
  }
  return true
}

/**
 * Validates HTTP or HTTPS URL string.
 * @description Checks URL format, hostname, and port validity.
 * @param url - URL string to validate
 * @returns True if valid, false otherwise
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
