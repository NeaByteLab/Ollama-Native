<div align="center">
  <h1> Ollama Native</h1>
</div>
<div align="center">
  <a href="https://ollama.com">
    <img alt="ollama" width="240" src="./assets/ollama.png">
  </a>
</div>
<div align="center">
  <strong>A modern TypeScript client library for Ollama API</strong>
</div>
<div align="center">
  <p>
    <strong>Alternative to:</strong>
    <a href="https://github.com/ollama/ollama-js">Official Ollama JavaScript Library</a>
  </p>
</div>
<div align="center">
  <a href="https://www.npmjs.com/package/@neabyte/ollama-native">
    <img alt="npm version" src="https://img.shields.io/npm/v/@neabyte/ollama-native.svg">
  </a>
  <a href="https://github.com/neabytelab/ollama-native/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white">
  </a>
</div>

## ✨ Features

- 🎯 TypeScript Support - Built with TypeScript for type safety
- 🛠️ Tool Calling - Full support for function calling and tool execution
- 🔄 Retry Mechanism - Automatic retry with exponential backoff
- ⏱️ Request Timeouts - Configurable timeout handling
- 🛡️ Error Management - Structured error handling with context
- 🔧 Configuration Options - Customizable headers, timeouts, and retries
- 🚀 No Dependencies - Zero external dependencies

---

## 🚀 Quick Start

### Installation

```bash
npm install @neabyte/ollama-native
```

### Basic Usage

```typescript
import {
  ChatMessage,
  EmbedRequest,
  EmbedResponse,
  ModelCopyRequest,
  ModelCreateRequest,
  ModelData,
  ModelDeleteRequest,
  ModelDetails,
  ModelProgress,
  ModelPullRequest,
  ModelPushRequest,
  ModelResponse,
  ModelShowRequest,
  ModelShowResponse,
  ModelStatusResponse,
  ModelTransferRequest,
  OllamaConfig,
  OllamaService,
  RequestChat,
  RequestGenerate,
  RequestOptions,
  RequestThinking,
  ResponseChat,
  ResponseChatStream,
  ResponseGenerate,
  ResponseGenerateStream,
  ToolCall,
  ToolItems,
  ToolResponse,
  WebFetchRequest,
  WebFetchResponse,
  WebSearchRequest,
  WebSearchResponse
} from '@neabyte/ollama-native'

// Basic configuration
const basicConfig: OllamaConfig = {
  host: 'http://localhost:11434'
}

// Advanced configuration with all options
const advancedConfig: OllamaConfig = {
  host: 'http://localhost:11434',
  timeout: 30000,     // Request timeout in milliseconds
  retries: 3,         // Number of retry attempts
  headers: {          // Custom HTTP headers
    'Authorization': 'Bearer your-token',
    'X-Custom-Header': 'value'
  }
}

// Create service instance
const ollama = new OllamaService(advancedConfig)

// List available models
try {
  const models = await ollama.list()
  console.log('Available models:', models)
} catch (error) {
  console.error('Failed to fetch models:', error.message)
}
```

## 🎯 **Super Easy Examples**

### 💬 **Chat with AI**
```typescript
// Non-streaming chat
const response = await ollama.chat({
  model: 'llama3',
  messages: [
    { role: 'user', content: 'Hello! How are you?' }
  ],
  stream: false
})
console.log(response.message.content) // AI's response
console.log('Done reason:', response.done_reason) // 'stop', 'tool_calls', etc.

// Streaming chat
const stream = await ollama.chat({
  model: 'llama3',
  messages: [
    { role: 'user', content: 'Hello! How are you?' }
  ],
  stream: true
})
for await (const chunk of stream) {
  console.log(chunk.message?.content || '') // Real-time response
  if (chunk.done) {
    console.log('Stream complete:', chunk.done_reason)
  }
}
```

### 🛠️ **Tool Calling**
```typescript
// Define tools for the model to use
const tools: ToolCall[] = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city and state, e.g. San Francisco, CA'
          }
        },
        required: ['location']
      }
    }
  }
]

// Chat with tool calling
const response = await ollama.chat({
  model: 'llama3',
  messages: [
    { role: 'user', content: 'What is the weather in New York?' }
  ],
  tools: tools,
  stream: false
})

// Check if model made tool calls
if (response.tool_calls && response.tool_calls.length > 0) {
  response.tool_calls.forEach(toolCall => {
    console.log(`Tool: ${toolCall.function.name}`)
    console.log(`Arguments:`, toolCall.function.arguments)
  })
}

// Streaming with tool calling
const stream = await ollama.chat({
  model: 'llama3',
  messages: [
    { role: 'user', content: 'What is the weather in New York?' }
  ],
  tools: tools,
  stream: true
})

for await (const chunk of stream) {
  if (chunk.tool_calls && chunk.tool_calls.length > 0) {
    console.log('Model wants to use tools:', chunk.tool_calls)
  }
  if (chunk.done) {
    console.log('Stream complete:', chunk.done_reason)
  }
}
```

### ✍️ **Generate Text**
```typescript
// Non-streaming generate
const text = await ollama.generate({
  model: 'llama3',
  prompt: 'Write a haiku about coding',
  stream: false
})
console.log(text.response) // Generated haiku
console.log('Done reason:', text.done_reason) // 'stop', 'tool_calls', etc.

// Streaming generate
const stream = await ollama.generate({
  model: 'llama3',
  prompt: 'Write a haiku about coding',
  stream: true
})
for await (const chunk of stream) {
  console.log(chunk.response || '') // Real-time generation
  if (chunk.done) {
    console.log('Stream complete:', chunk.done_reason)
  }
}
```

### 🧠 **Get Embeddings**
```typescript
// Get vector embeddings
const embeddings = await ollama.embed({
  model: 'nomic-embed-text',
  input: 'Hello world'
})
console.log(embeddings.embeddings[0]) // 768-dimensional vector
```

### 🛠️ **Create Custom Model**
```typescript
// Non-streaming create
const status = await ollama.create({
  model: 'my-custom-model',
  from: 'llama3',
  quantize: 'q4_K_M',
  system: 'You are a helpful coding assistant',
  stream: false
})
console.log('Model created:', status.status)

// Streaming create with progress
const progress = await ollama.create({
  model: 'my-custom-model',
  from: 'llama3',
  quantize: 'q4_K_M',
  system: 'You are a helpful coding assistant',
  stream: true
})

// Watch creation progress
for await (const update of progress) {
  console.log(`Status: ${update.status}`)
}
```

### 📊 **Monitor Running Models**
```typescript
// See what's currently running
const running = await ollama.ps()
console.log('Running models:', running)
```

## 💡 **More Examples**

See [`./examples`](./examples/README.md) for complete code examples and usage patterns.

---

## 📖 API Reference

### abort

```typescript
ollama.abort()
```

- Returns: `boolean`
- Description: Aborts the current request if one is active. Returns true if request was aborted, false if no request was active.

### chat

```typescript
ollama.chat(request)
```

- `request` `<RequestChat>`: The request object containing chat parameters.

  - `model` `<string>`: The name of the model to use for the chat.
  - `messages` `<ChatMessage[]>`: Array of message objects representing the chat history.
    - `role` `<string>`: The role of the message sender ('user', 'system', 'assistant', or 'tool').
    - `content` `<string>`: The content of the message.
    - `images` `<Uint8Array[] | string[]>`: (Optional) Images to be included in the message, either as Uint8Array or base64 encoded strings.
    - `tool_call_id` `<string>`: (Optional) Tool call ID for tool responses.
    - `tool_calls` `<ToolCall[]>`: (Optional) Tool calls made by the assistant.
    - `tool_name` `<string>`: (Optional) Add the name of the tool that was executed to inform the model of the result.
  - `format` `<string | object>`: (Optional) Set the expected format of the response (`json`).
  - `stream` `<boolean>`: (Optional) When true returns `AsyncIterable<ResponseChatStream>`, when false returns `ResponseChat`. Defaults to false.
  - `think` `<boolean | "high" | "medium" | "low">`: (Optional) Enable model thinking. Use `true`/`false` or specify a level. Requires model support.
  - `keep_alive` `<string | number>`: (Optional) How long to keep the model loaded. A number (seconds) or a string with a duration unit suffix ("300ms", "1.5h", "2h45m", etc.)
  - `tools` `<ToolCall[]>`: (Optional) A list of tool calls the model may make.
  - `options` `<Partial<RequestOptions>>`: (Optional) Options to configure the runtime.
  - `raw` `<boolean>`: (Optional) Return raw model output without formatting.
  - `system` `<string>`: (Optional) Override the model system prompt.
  - `template` `<string>`: (Optional) Override the model template.

- Returns: `Promise<ResponseChat | AsyncIterable<ResponseChatStream>>`
- Description: Chat completion with optional streaming and tool calling support.

### copy

```typescript
ollama.copy(request)
```

- `request` `<ModelCopyRequest>`: The copy request parameters.
  - `source` `<string>`: The name of the model to copy from.
  - `destination` `<string>`: The name of the model to copy to.
- Returns: `Promise<ModelStatusResponse>`
- Description: Creates a copy of an existing model with a new name.

### create

```typescript
ollama.create(request)
```

- `request` `<ModelCreateRequest>`: The request object containing create parameters.
  - `adapters` `<Record<string, string>>`: (Optional) A key-value map of LoRA adapter configurations.
  - `from` `<string>`: The base model to derive from.
  - `license` `<string | string[]>`: (Optional) The license(s) associated with the model.
  - `messages` `<ChatMessage[]>`: (Optional) Initial chat messages for the model.
  - `model` `<string>`: The name of the model to create.
  - `parameters` `<Record<string, unknown>>`: (Optional) Additional model parameters as key-value pairs.
  - `quantize` `<string>`: Quantization precision level (q8_0, q4_K_M, etc.).
  - `stream` `<boolean>`: (Optional) When true returns `AsyncIterable<ModelProgress>`, when false returns `ModelStatusResponse`. Defaults to true.
  - `system` `<string>`: (Optional) The system prompt for the model.
  - `template` `<string>`: (Optional) The prompt template to use with the model.
- Returns: `Promise<AsyncIterable<ModelProgress> | ModelStatusResponse>`
- Description: Creates a new model from a base model with optional streaming progress updates.

### delete

```typescript
ollama.delete(request)
```

- `request` `<ModelDeleteRequest>`: The delete request parameters.
  - `model` `<string>`: The name of the model to delete.
- Returns: `Promise<ModelStatusResponse>`
- Description: Deletes a model from the local Ollama installation.

### embed

```typescript
ollama.embed(request)
```

- `request` `<EmbedRequest>`: The request object containing embedding parameters.
  - `model` `<string>`: The name of the model used to generate the embeddings.
  - `input` `<string | string[]>`: The input used to generate the embeddings.
  - `truncate` `<boolean>`: (Optional) Truncate the input to fit the maximum context length supported by the model.
  - `keep_alive` `<string | number>`: (Optional) How long to keep the model loaded. A number (seconds) or a string with a duration unit suffix ("300ms", "1.5h", "2h45m", etc.)
  - `options` `<Partial<RequestOptions>>`: (Optional) Options to configure the runtime.
- Returns: `Promise<EmbedResponse>`
- Description: Generates embeddings using the specified Ollama model.

### generate

```typescript
ollama.generate(request)
```

- `request` `<RequestGenerate>`: The request object containing generate parameters.
  - `model` `<string>`: The name of the model to use for generation.
  - `prompt` `<string>`: The prompt to send to the model.
  - `context` `<number[]>`: (Optional) Context array from previous generation.
  - `suffix` `<string>`: (Optional) Suffix is the text that comes after the inserted text.
  - `system` `<string>`: (Optional) Override the model system prompt.
  - `template` `<string>`: (Optional) Override the model template.
  - `raw` `<boolean>`: (Optional) Bypass the prompt template and pass the prompt directly to the model.
  - `images` `<Uint8Array[] | string[]>`: (Optional) Images to be included, either as Uint8Array or base64 encoded strings.
  - `format` `<string | object>`: (Optional) Set the expected format of the response (`json`).
  - `stream` `<boolean>`: (Optional) When true returns `AsyncIterable<ResponseGenerateStream>`, when false returns `ResponseGenerate`. Defaults to false.
  - `think` `<boolean | "high" | "medium" | "low">`: (Optional) Enable model thinking. Use `true`/`false` or specify a level. Requires model support.
  - `keep_alive` `<string | number>`: (Optional) How long to keep the model loaded. A number (seconds) or a string with a duration unit suffix ("300ms", "1.5h", "2h45m", etc.)
  - `tools` `<ToolCall[]>`: (Optional) A list of tool calls the model may make.
  - `options` `<Partial<RequestOptions>>`: (Optional) Options to configure the runtime.

- Returns: `Promise<ResponseGenerate | AsyncIterable<ResponseGenerateStream>>`
- Description: Generates text using the specified Ollama model with optional streaming response.

### isActive

```typescript
ollama.isActive
```

- Returns: `boolean`
- Description: Checks if there's an active request that can be aborted. Returns true if a request is currently in progress.

### list

```typescript
ollama.list()
```

- Returns: `Promise<ModelData[]>`
- Description: Retrieves a list of available models from the Ollama server.

### ps

```typescript
ollama.ps()
```

- Returns: `Promise<ModelData[]>`
- Description: Retrieves a list of running processes from the Ollama server.

### pull

```typescript
ollama.pull(request)
```

- `request` `<ModelPullRequest>`: The pull request parameters.
  - `model` `<string>`: The name of the model to pull from the registry.
  - `insecure` `<boolean>`: (Optional) Pull from servers whose identity cannot be verified.
  - `stream` `<boolean>`: (Optional) When true returns `AsyncIterable<ModelProgress>`, when false returns `ModelStatusResponse`. Defaults to true.
- Returns: `Promise<AsyncIterable<ModelProgress> | ModelStatusResponse>`
- Description: Downloads a model from the Ollama registry with optional streaming progress updates.

### push

```typescript
ollama.push(request)
```

- `request` `<ModelPushRequest>`: The push request parameters.
  - `model` `<string>`: The name of the model to push to the registry.
  - `insecure` `<boolean>`: (Optional) Push to servers whose identity cannot be verified.
  - `stream` `<boolean>`: (Optional) When true returns `AsyncIterable<ModelProgress>`, when false returns `ModelStatusResponse`. Defaults to true.
- Returns: `Promise<AsyncIterable<ModelProgress> | ModelStatusResponse>`
- Description: Uploads a model to the Ollama registry with optional streaming progress updates.

### show

```typescript
ollama.show(request)
```

- `request` `<ModelShowRequest>`: The show request parameters.
  - `model` `<string>`: The name of the model to show.
  - `system` `<string>`: (Optional) Override the model system prompt returned.
  - `template` `<string>`: (Optional) Override the model template returned.
  - `options` `<Record<string, unknown>>`: (Optional) Options to configure the runtime.
- Returns: `Promise<ModelShowResponse>`
- Description: Shows model information and configuration including license, system prompt, template, and parameters.

### webFetch

```typescript
ollama.webFetch(request)
```

- `request` `<WebFetchRequest>`: The fetch request parameters.
  - `url` `<string>`: The URL to fetch content from.
- Returns: `Promise<WebFetchResponse>`
- Description: Fetches a single page using the Ollama web fetch API. Requires API key authentication.

### webSearch

```typescript
ollama.webSearch(request)
```

- `request` `<WebSearchRequest>`: The search request parameters.
  - `query` `<string>`: The search query string.
  - `max_results` `<number>`: (Optional) Maximum number of results to return.
- Returns: `Promise<WebSearchResponse>`
- Description: Performs web search using the Ollama web search API. Requires API key authentication.

---

## 📄 License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.