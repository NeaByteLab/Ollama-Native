/**
 * Web Search Example
 * 
 * Demonstrates how to use Ollama Native for web search
 * using the OLLAMA_API_KEY environment variable.
 */

import { OllamaService, OllamaConfig } from '@neabyte/ollama-native'

// Configuration for web API
const config: OllamaConfig = {
  host: 'https://ollama.com',
  headers: {
    'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
  }
}

// Create Ollama service instance
const ollama = new OllamaService(config)

/**
 * Web search demonstration
 */
async function webSearchDemo() {
  console.log('Web Search Example')
  console.log('=' .repeat(50))
  if (!process.env.OLLAMA_API_KEY) {
    console.error('❌ OLLAMA_API_KEY environment variable is required')
    console.log('Set it with: export OLLAMA_API_KEY=your_api_key')
    return
  }
  try {
    const query = 'TypeScript best practices 2025'
    console.log(`Searching for: ${query}`)
    console.log('Generating response...\n')
    const response = await ollama.webSearch({ 
      query,
      max_results: 5
    })
    console.log('✅ Web search successful!')
    console.log('Response keys:', Object.keys(response))
    console.log('Results count:', response.results?.length || 0)
    if (response.results && response.results.length > 0) {
      console.log('\nSearch Results:')
      response.results.forEach((result: any, index: number) => {
        console.log(`\n${index + 1}. ${result.title}`)
        console.log(`   URL: ${result.url}`)
        console.log(`   Snippet: ${result.snippet?.substring(0, 100)}...`)
      })
    }
  } catch (error) {
    console.error('❌ Web search failed:', error.message)
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('Ollama Native - Web Search Example')
  console.log('=' .repeat(60))
  console.log('Make sure you have set OLLAMA_API_KEY environment variable\n')
  await webSearchDemo()
  console.log('\nWeb search example completed!')
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
