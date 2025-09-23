/**
 * Basic Text Generation Example
 * 
 * Demonstrates basic usage of the Ollama Native library for text generation.
 * Shows both streaming and non-streaming approaches.
 */

import { OllamaService, OllamaConfig, RequestGenerate, ResponseGenerate, ResponseGenerateStream } from '@neabyte/ollama-native'

// Configuration for Ollama service
const config: OllamaConfig = {
  host: 'http://localhost:11434',
  timeout: 30000,
  retries: 3
}

// Create Ollama service instance
const ollama = new OllamaService(config)

/**
 * Basic non-streaming text generation
 */
async function basicGeneration() {
  console.log('Basic Text Generation (Non-Streaming)')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'qwen3:1.7b',
      prompt: 'Write a short haiku about programming',
      stream: false
    }
    console.log('Prompt:', request.prompt)
    console.log('Generating response...\n')
    const response = await ollama.generate(request) as ResponseGenerate
    console.log('Generated Text:')
    console.log(response.response)
    console.log('\nResponse Stats:')
    console.log(`- Model: ${response.model}`)
    console.log(`- Created: ${response.created_at}`)
    console.log(`- Done: ${response.done}`)
    console.log(`- Context: ${response.context?.length || 0} tokens`)
  } catch (error) {
    console.error('Error during generation:', error.message)
  }
}

/**
 * Streaming text generation
 */
async function streamingGeneration() {
  console.log('\nStreaming Text Generation')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'qwen3:1.7b',
      prompt: 'Explain the concept of recursion in programming with a simple example',
      stream: true
    }
    console.log('Prompt:', request.prompt)
    console.log('Streaming response:\n')
    const stream = await ollama.generate(request) as AsyncIterable<ResponseGenerateStream>
    let fullResponse = ''
    for await (const chunk of stream) {
      if (chunk.response) {
        process.stdout.write(chunk.response)
        fullResponse += chunk.response
      }
      if (chunk.done) {
        console.log('\n\nGeneration completed!')
        console.log(`Total characters: ${fullResponse.length}`)
      }
    }
  } catch (error) {
    console.error('Error during streaming generation:', error.message)
  }
}

/**
 * Generation with custom options
 */
async function advancedGeneration() {
  console.log('\nGeneration with Custom Options')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'qwen3:1.7b',
      prompt: 'Create a TypeScript interface for a User object with validation',
      stream: false,
      options: {
        temperature: 0.7,
        num_ctx: 500,
        top_p: 0.9,
        stop: ['```', '---']
      },
      format: 'json'
    }
    console.log('Prompt:', request.prompt)
    console.log('Options:', JSON.stringify(request.options, null, 2))
    console.log('Generating structured response...\n')
    const response = await ollama.generate(request) as ResponseGenerate
    console.log('Generated Code:')
    console.log(response.response)
  } catch (error) {
    console.error('Error during generation:', error.message)
  }
}

/**
 * Error handling
 */
async function errorHandling() {
  console.log('\nError Handling')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'non-existent-model',
      prompt: 'This should fail',
      stream: false
    }
    console.log('Attempting to use non-existent model...')
    const response = await ollama.generate(request)
    console.log('Unexpected success:', response)
  } catch (error) {
    console.log('Expected error caught:')
    console.log(`- Type: ${error.constructor.name}`)
    console.log(`- Message: ${error.message}`)
    console.log(`- Status: ${error.status || 'Unknown'}`)
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('Ollama Native - Basic Text Generation Examples')
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
  await basicGeneration()
  await streamingGeneration()
  await advancedGeneration()
  await errorHandling()
  console.log('\nAll examples completed!')
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
