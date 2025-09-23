/**
 * Fill-in-Middle Code Completion Example
 * 
 * Demonstrates how to use Ollama Native for code completion scenarios,
 * including fill-in-the-middle, function completion, and code suggestions.
 */

import { OllamaService, OllamaConfig, RequestGenerate, ResponseGenerate } from '@neabyte/ollama-native'

// Configuration for Ollama service
const config: OllamaConfig = {
  host: 'http://localhost:11434',
  timeout: 30000,
  retries: 3
}

// Create Ollama service instance
const ollama = new OllamaService(config)

/**
 * Fill in the middle of existing code
 */
async function fillInMiddle() {
  console.log('\nFill-in-Middle Example')
  console.log('=' .repeat(50))
  try {
    const response: ResponseGenerate = await ollama.generate({
      model: 'qwen2.5-coder:1.5b',
      prompt: `def add(`,
      suffix: `return c`,
      stream: false,
      options: {
        temperature: 0.3,
        num_ctx: 200
      }
    }) as ResponseGenerate
    console.log('Prefix:', 'def add(')
    console.log('Suffix:', 'return c')
    console.log('Generated completion:')
    console.log(response.response)
  } catch (error) {
    console.error('Error during fill-in-middle:', error.message)
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('Ollama Native - Fill-in-Middle Code Completion Examples')
  console.log('=' .repeat(70))
  console.log('Make sure Ollama is running on http://localhost:11434')
  console.log('and you have the qwen2.5-coder:1.5b model installed.\n')
  try {
    const models = await ollama.list()
    console.log(`Available models: ${models.map(m => m.name).join(', ')}\n`)
  } catch (error) {
    console.error('Cannot connect to Ollama. Please ensure it\'s running.')
    console.error('Error:', error.message)
    process.exit(1)
  }
  await fillInMiddle()
  console.log('\nAll code completion examples completed!')
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...')
  if (ollama.isActive) {
    ollama.abort()
  }
  process.exit(0)
})

// Run the examples
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}