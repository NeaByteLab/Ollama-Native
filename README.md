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
<br/>
<div align="center">
  <a href="https://www.npmjs.com/package/@neabyte/ollama-native">
    <img alt="npm version" src="https://img.shields.io/npm/v/@neabyte/ollama-native.svg">
  </a>
  <a href="https://github.com/neabyte/ollama-native/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white">
  </a>
</div>

## ✨ Features

- 🎯 **TypeScript Support** - Built with TypeScript for type safety
- 🔄 **Retry Mechanism** - Automatic retry with exponential backoff
- ⏱️ **Request Timeouts** - Configurable timeout handling
- 🛡️ **Error Management** - Structured error handling with context
- 🚀 **No Dependencies** - Zero external dependencies
- 🔧 **Configuration Options** - Customizable headers, timeouts, and retries

---

## 🚀 Quick Start

### Installation

```bash
npm install @neabyte/ollama-native
```

### Basic Usage

```typescript
import { OllamaService, OllamaConfig } from '@neabyte/ollama-native'

// Configure your Ollama server
const config: OllamaConfig = {
  host: 'http://localhost:11434',
  timeout: 30000,
  retries: 1
}

// Create service instance
const ollama = new OllamaService(config)

// List available models
try {
  const models = await ollama.list()
  console.log('Available models:', models)
} catch (error) {
  console.error('Failed to fetch models:', error.message)
}
```

## 📖 API Reference

### OllamaService

The main service class for interacting with Ollama API.

#### Constructor

```typescript
constructor(config: OllamaConfig)
```

#### Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `list()` | Get list of available models | `Promise<ModelData[]>` |

### Configuration

```typescript
interface OllamaConfig {
  /** Ollama server URL (required) */
  host: string

  /** Custom HTTP headers */
  headers?: Record<string, string>

  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number

  /** Number of retry attempts (default: 1) */
  retries?: number
}
```

---

## 📄 License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.