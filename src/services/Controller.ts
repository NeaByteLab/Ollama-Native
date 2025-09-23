/**
 * Abort controller utility for managing request cancellation.
 * @description Provides centralized abort control for HTTP requests with timeout management.
 */
export class AbortController {
  /** The abort controller instance */
  private readonly controller: globalThis.AbortController
  /** The timeout ID for the abort controller */
  private timeoutId: ReturnType<typeof setTimeout> | null = null

  /**
   * Creates a new AbortController instance.
   * @description Initializes the controller with a new AbortController instance.
   */
  constructor() {
    this.controller = new globalThis.AbortController()
  }

  /**
   * Gets the abort signal for the request.
   * @description Returns the abort signal that can be used with fetch requests.
   * @returns The abort signal
   * @readonly
   */
  get signal(): AbortSignal {
    return this.controller.signal
  }

  /**
   * Sets a timeout for the abort controller.
   * @description Automatically aborts the request after the specified timeout.
   * @param timeout - Timeout in milliseconds
   * @returns void
   */
  setTimeout(timeout: number): void {
    this.clearTimeout()
    this.timeoutId = setTimeout(() => {
      this.abort()
    }, timeout)
  }

  /**
   * Aborts the current request.
   * @description Cancels the ongoing request and clears any timeout.
   * @returns void
   */
  abort(): void {
    this.clearTimeout()
    this.controller.abort()
  }

  /**
   * Clears the timeout if it exists.
   * @description Removes the timeout without aborting the request.
   * @returns void
   */
  clearTimeout(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  /**
   * Checks if the request has been aborted.
   * @description Returns true if the request was aborted.
   * @returns True if aborted, false otherwise
   */
  get aborted(): boolean {
    return this.controller.signal.aborted
  }
}
