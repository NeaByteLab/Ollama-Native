/**
 * Build configuration for the Ollama Native project
 * @fileoverview Configuration for unbuild bundler with TypeScript support
 */

import { defineBuildConfig } from 'unbuild'
import { resolve } from 'path'

/**
 * Build configuration object
 * @description Defines the build settings for bundling TypeScript source files
 * @returns {import('unbuild').BuildConfig} The build configuration
 */
export default defineBuildConfig({
  /** @type {string[]} Entry points for the build process */
  entries: ['src/index'],
  /** @type {boolean} Whether to generate TypeScript declaration files */
  declaration: true,
  /** @type {boolean} Whether to clean the output directory before building */
  clean: true,
  /**
   * Path aliases for module resolution
   * @type {Record<string, string>} Map of alias names to their resolved paths
   */
  alias: {
    /** @type {string} Alias for constants directory */
    '@constants': resolve(__dirname, 'src/constants'),
    /** @type {string} Alias for interfaces directory */
    '@interfaces': resolve(__dirname, 'src/interfaces'),
    /** @type {string} Alias for services directory */
    '@services': resolve(__dirname, 'src/services'),
    /** @type {string} Alias for utilities directory */
    '@utils': resolve(__dirname, 'src/utils')
  },
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  },
  /** @type {boolean} Whether to generate source maps */
  sourcemap: false,
  /** @type {boolean} Whether to fail the build on warnings */
  failOnWarn: false
})
