/**
 * Manual Abort Example
 * 
 * Demonstrates how to manually abort a running Ollama request
 * using the abort() method.
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
 * Manual abort demonstration
 */
async function manualAbort() {
  console.log('Manual Abort Example')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'qwen3:1.7b',
      prompt: 'Write a very long story about space exploration with detailed descriptions of planets, alien civilizations, and intergalactic travel. Make it at least 2000 words.',
      stream: true
    }
    console.log('Starting long generation...')
    console.log('Press Ctrl+C to abort the request\n')
    const stream = await ollama.generate(request) as AsyncIterable<ResponseGenerateStream>
    let chunkCount = 0
    for await (const chunk of stream) {
      if (chunk.response) {
        process.stdout.write(chunk.response)
        chunkCount++
        if (chunkCount >= 10) {
          console.log('\n\nAborting request manually...')
          const aborted = ollama.abort()
          console.log(`Request aborted: ${aborted}`)
          break
        }
      }
      if (chunk.done) {
        console.log('\n\nGeneration completed naturally!')
        break
      }
    }
    console.log(`\nProcessed ${chunkCount} chunks before abort`)
  } catch (error) {
    console.error('Error during generation:', error.message)
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('Ollama Native - Manual Abort Example')
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
  await manualAbort()
  console.log('\nManual abort example completed!')
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
