/**
 * Boolean Thinking Example
 * 
 * Demonstrates how to use Ollama Native with boolean thinking mode
 * for simple yes/no questions and logical reasoning.
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
 * Simple boolean thinking - yes/no questions
 */
async function booleanThinking() {
  console.log('Boolean Thinking Example')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'qwen3:1.7b',
      prompt: 'Is the sky blue during the day? Answer with just yes or no.',
      stream: false,
      think: true
    }
    console.log('Prompt:', request.prompt)
    console.log('Thinking enabled: true')
    console.log('Generating response...\n')
    const response = await ollama.generate(request) as ResponseGenerate
    console.log('Generated Response:')
    console.log(response.response)
    console.log('\nResponse Stats:')
    console.log(`- Model: ${response.model}`)
    console.log(`- Created: ${response.created_at}`)
    console.log(`- Done: ${response.done}`)
  } catch (error) {
    console.error('Error during boolean thinking:', error.message)
  }
}

/**
 * Logical reasoning with boolean thinking
 */
async function logicalReasoning() {
  console.log('\nLogical Reasoning Example')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'qwen3:1.7b',
      prompt: 'If all birds can fly and penguins are birds, can penguins fly? Answer with just yes or no.',
      stream: false,
      think: true,
      options: {
        temperature: 0.1,
        num_ctx: 200
      }
    }
    console.log('Prompt:', request.prompt)
    console.log('Thinking enabled: true')
    console.log('Generating response...\n')
    const response = await ollama.generate(request) as ResponseGenerate
    console.log('Generated Response:')
    console.log(response.response)
  } catch (error) {
    console.error('Error during logical reasoning:', error.message)
  }
}

/**
 * Comparison with and without thinking
 */
async function thinkingComparison() {
  console.log('\nThinking vs Non-Thinking Comparison')
  console.log('=' .repeat(50))
  const prompt = 'Is 2 + 2 equal to 4? Answer with just yes or no.'
  try {
    console.log('Without thinking:')
    const withoutThinking = await ollama.generate({
      model: 'qwen3:1.7b',
      prompt,
      stream: false,
      think: false
    }) as ResponseGenerate
    console.log('Response:', withoutThinking.response)
    console.log('\nWith thinking:')
    const withThinking = await ollama.generate({
      model: 'qwen3:1.7b',
      prompt,
      stream: false,
      think: true
    }) as ResponseGenerate
    console.log('Response:', withThinking.response)
  } catch (error) {
    console.error('Error during comparison:', error.message)
  }
}

/**
 * Multiple choice with boolean thinking
 */
async function multipleChoice() {
  console.log('\nMultiple Choice Example')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'qwen3:1.7b',
      prompt: 'Which is correct: A) 1+1=3, B) 1+1=2, C) 1+1=1? Answer with just the letter.',
      stream: false,
      think: true,
      options: {
        temperature: 0.1,
        stop: ['A)', 'B)', 'C)', '\n']
      }
    }
    console.log('Prompt:', request.prompt)
    console.log('Thinking enabled: true')
    console.log('Generating response...\n')
    const response = await ollama.generate(request) as ResponseGenerate
    console.log('Generated Response:')
    console.log(response.response)
  } catch (error) {
    console.error('Error during multiple choice:', error.message)
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('Ollama Native - Boolean Thinking Examples')
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
  await booleanThinking()
  await logicalReasoning()
  await thinkingComparison()
  await multipleChoice()
  console.log('\nAll boolean thinking examples completed!')
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
