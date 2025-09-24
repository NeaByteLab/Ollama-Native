/**
 * Timeout Example
 * 
 * Demonstrates how to use Ollama Native with timeout configuration
 * for controlling request duration and handling timeout scenarios.
 */

import { OllamaService, OllamaConfig, RequestGenerate, ResponseGenerate } from '@neabyte/ollama-native'

// Configuration for Ollama service with short timeout
const config: OllamaConfig = {
  host: 'http://localhost:11434',
  timeout: 2000, // 2 second timeout
  retries: 2
}

// Create Ollama service instance
const ollama = new OllamaService(config)

/**
 * Timeout demonstration
 */
async function timeoutDemo() {
  console.log('Timeout Example')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'qwen3:1.7b',
      prompt: 'Write a very detailed and comprehensive guide about machine learning, including all algorithms, mathematical formulas, implementation details, and real-world applications. Make it extremely thorough and lengthy.',
      stream: false,
      options: {
        temperature: 0.7,
        num_ctx: 2000
      }
    }
    console.log('Prompt:', request.prompt.substring(0, 100) + '...')
    console.log('Timeout configured: 2000ms (2 seconds)')
    console.log('Generating response...\n')
    const startTime = Date.now()
    const response = await ollama.generate(request) as ResponseGenerate
    const duration = Date.now() - startTime
    console.log('✅ Generation completed!')
    console.log('Generated Text:')
    console.log(response.response.substring(0, 200) + '...')
    console.log('\nResponse Stats:')
    console.log(`- Model: ${response.model}`)
    console.log(`- Created: ${response.created_at}`)
    console.log(`- Done: ${response.done}`)
    console.log(`- Duration: ${duration}ms`)
    console.log(`- Context: ${response.context?.length || 0} tokens`)
  } catch (error) {
    console.log('❌ Request failed:')
    console.log(`- Type: ${error.constructor.name}`)
    console.log(`- Message: ${error.message}`)
    console.log(`- Status: ${error.status || 'Unknown'}`)
    if (error.message.includes('timeout')) {
      console.log('\n💡 This is expected behavior - the request exceeded the 2-second timeout')
      console.log('Try increasing the timeout value or using a shorter prompt')
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('Ollama Native - Timeout Example')
  console.log('=' .repeat(60))
  console.log('Make sure Ollama is running on http://localhost:11434')
  console.log('and you have the qwen3:1.7b model installed.\n')
  try {
    const models = await ollama.list()
    console.log(`Available models: ${models.map(m => m.name).join(', ')}\n`)
  } catch (error) {
    console.error('Cannot connect to Ollama. Please ensure it\'s running.')
    console.error('Error:', error.message)
    process.exit(1)
  }
  await timeoutDemo()
  console.log('\nTimeout example completed!')
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...')
  if (ollama.isActive) {
    ollama.abort()
  }
  process.exit(0)
})

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
