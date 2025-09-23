/**
 * GPT-Style Thinking Example
 * 
 * Demonstrates how to use Ollama Native with GPT-style thinking mode
 * for complex reasoning, analysis, and problem-solving tasks.
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
 * High-level thinking for complex problem solving
 */
async function highLevelThinking() {
  console.log('High-Level Thinking Example')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'gpt-oss:20b-cloud',
      prompt: 'Explain the steps to solve a Rubik\'s cube, including the reasoning behind each step.',
      stream: false,
      think: 'high',
      options: {
        temperature: 0.7,
        num_ctx: 1000,
        top_p: 0.9
      }
    }
    console.log('Prompt:', request.prompt)
    console.log('Thinking level: high')
    console.log('Generating response...\n')
    const response = await ollama.generate(request) as ResponseGenerate
    console.log('Generated Response:')
    console.log(response.response)
    console.log('\nResponse Stats:')
    console.log(`- Model: ${response.model}`)
    console.log(`- Created: ${response.created_at}`)
    console.log(`- Done: ${response.done}`)
  } catch (error) {
    console.error('Error during high-level thinking:', error.message)
  }
}

/**
 * Medium-level thinking for analysis tasks
 */
async function mediumLevelThinking() {
  console.log('\nMedium-Level Thinking Example')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'gpt-oss:20b-cloud',
      prompt: 'Analyze the pros and cons of renewable energy sources and provide a balanced conclusion.',
      stream: false,
      think: 'medium',
      options: {
        temperature: 0.5,
        num_ctx: 800
      }
    }
    console.log('Prompt:', request.prompt)
    console.log('Thinking level: medium')
    console.log('Generating response...\n')
    const response = await ollama.generate(request) as ResponseGenerate
    console.log('Generated Response:')
    console.log(response.response)
  } catch (error) {
    console.error('Error during medium-level thinking:', error.message)
  }
}

/**
 * Low-level thinking for quick reasoning
 */
async function lowLevelThinking() {
  console.log('\nLow-Level Thinking Example')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'gpt-oss:20b-cloud',
      prompt: 'What is the capital of France? Provide a brief explanation.',
      stream: false,
      think: 'low',
      options: {
        temperature: 0.3,
        num_ctx: 400
      }
    }
    console.log('Prompt:', request.prompt)
    console.log('Thinking level: low')
    console.log('Generating response...\n')
    const response = await ollama.generate(request) as ResponseGenerate
    console.log('Generated Response:')
    console.log(response.response)
  } catch (error) {
    console.error('Error during low-level thinking:', error.message)
  }
}

/**
 * Code analysis with thinking
 */
async function codeAnalysisThinking() {
  console.log('\nCode Analysis with Thinking')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'gpt-oss:20b-cloud',
      prompt: `Analyze this TypeScript code and explain what it does:

function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

What are the potential issues with this implementation?`,
      stream: false,
      think: 'high',
      options: {
        temperature: 0.4,
        num_ctx: 1200
      }
    }
    console.log('Prompt:', request.prompt)
    console.log('Thinking level: high')
    console.log('Generating response...\n')
    const response = await ollama.generate(request) as ResponseGenerate
    console.log('Generated Response:')
    console.log(response.response)
  } catch (error) {
    console.error('Error during code analysis:', error.message)
  }
}

/**
 * Creative problem solving with thinking
 */
async function creativeProblemSolving() {
  console.log('\nCreative Problem Solving')
  console.log('=' .repeat(50))
  try {
    const request: RequestGenerate = {
      model: 'gpt-oss:20b-cloud',
      prompt: 'Design a sustainable city transportation system that reduces traffic congestion and environmental impact. Consider various factors like cost, feasibility, and user adoption.',
      stream: false,
      think: 'high',
      options: {
        temperature: 0.8,
        num_ctx: 1500,
        top_p: 0.95
      }
    }
    console.log('Prompt:', request.prompt)
    console.log('Thinking level: high')
    console.log('Generating response...\n')
    const response = await ollama.generate(request) as ResponseGenerate
    console.log('Generated Response:')
    console.log(response.response)
  } catch (error) {
    console.error('Error during creative problem solving:', error.message)
  }
}

/**
 * Comparison of different thinking levels
 */
async function thinkingLevelComparison() {
  console.log('\nThinking Level Comparison')
  console.log('=' .repeat(50))
  const prompt = 'Explain the concept of machine learning in simple terms.'
  try {
    const levels = ['low', 'medium', 'high'] as const
    for (const level of levels) {
      console.log(`\n${level.toUpperCase()} thinking level:`)
      const response = await ollama.generate({
        model: 'gpt-oss:20b-cloud',
        prompt,
        stream: false,
        think: level,
        options: {
          temperature: 0.5,
          num_ctx: 600
        }
      }) as ResponseGenerate
      console.log('Response:', response.response.substring(0, 200) + '...')
    }
  } catch (error) {
    console.error('Error during comparison:', error.message)
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('Ollama Native - GPT-Style Thinking Examples')
  console.log('=' .repeat(60))
  console.log('Make sure Ollama is running on http://localhost:11434')
  console.log('and you have the gpt-oss:20b-cloud model installed.\n')
  try {
    const models = await ollama.list()
    console.log(`Available models: ${models.map(m => m.name).join(', ')}\n`)
  } catch (error) {
    console.error('Cannot connect to Ollama. Please ensure it\'s running.')
    console.error('Error:', error.message)
    process.exit(1)
  }
  await highLevelThinking()
  await mediumLevelThinking()
  await lowLevelThinking()
  await codeAnalysisThinking()
  await creativeProblemSolving()
  await thinkingLevelComparison()
  console.log('\nAll GPT-style thinking examples completed!')
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
