/**
 * Web Fetch Example
 * 
 * Demonstrates how to use Ollama Native for web content fetching
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
 * Web fetch demonstration
 */
async function webFetchDemo() {
  console.log('Web Fetch Example')
  console.log('=' .repeat(50))
  if (!process.env.OLLAMA_API_KEY) {
    console.error('❌ OLLAMA_API_KEY environment variable is required')
    console.log('Set it with: export OLLAMA_API_KEY=your_api_key')
    return
  }
  try {
    const url = 'https://ollama.com'
    console.log(`Fetching content from: ${url}`)
    console.log('Generating response...\n')
    const response = await ollama.webFetch({ url })
    console.log('✅ Web fetch successful!')
    console.log('Response keys:', Object.keys(response))
    console.log('Content length:', response.content?.length || 'no content')
    console.log('Content preview:', response.content?.substring(0, 200) + '...')
  } catch (error) {
    console.error('❌ Web fetch failed:', error.message)
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('Ollama Native - Web Fetch Example')
  console.log('=' .repeat(60))
  console.log('Make sure you have set OLLAMA_API_KEY environment variable\n')
  await webFetchDemo()
  console.log('\nWeb fetch example completed!')
}

// Run the example
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}
