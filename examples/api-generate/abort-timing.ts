/**
 * Timing-based Abort Example
 * 
 * Demonstrates how to abort a request based on timing conditions
 * using setTimeout and the abort() method.
 */

import { OllamaService, OllamaConfig, RequestGenerate, ResponseGenerateStream } from '@neabyte/ollama-native'

// Configuration for Ollama service
const config: OllamaConfig = {
  host: 'http://localhost:11434',
  timeout: 30000,
  retries: 3
}

// Create Ollama service instance
const ollama = new OllamaService(config)

/**
 * Timing-based abort demonstration
 */
async function timingAbort() {
  console.log('Timing-based Abort Example')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'qwen3:1.7b',
      prompt: 'Write a comprehensive guide about machine learning algorithms, including detailed explanations and examples for each algorithm.',
      stream: true
    }
    console.log('Starting generation with 3-second timeout...')
    console.log('Request will be automatically aborted after 3 seconds\n')
    const abortTimer = setTimeout(() => {
      console.log('\n\n⏰ Timeout reached! Aborting request...')
      const aborted = ollama.abort()
      console.log(`Request aborted: ${aborted}`)
    }, 3000)
    const stream = await ollama.generate(request) as AsyncIterable<ResponseGenerateStream>
    let chunkCount = 0
    let startTime = Date.now()
    for await (const chunk of stream) {
      if (chunk.response) {
        process.stdout.write(chunk.response)
        chunkCount++
      }
      if (chunk.done) {
        clearTimeout(abortTimer)
        const duration = Date.now() - startTime
        console.log(`\n\n✅ Generation completed naturally in ${duration}ms`)
        console.log(`Processed ${chunkCount} chunks`)
        break
      }
    }
    clearTimeout(abortTimer)
  } catch (error) {
    console.error('Error during generation:', error.message)
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('Ollama Native - Timing-based Abort Example')
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
  await timingAbort()
  console.log('\nTiming-based abort example completed!')
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
