# 📚 Examples

This directory contains examples showing how to use the Ollama Native library.

## 🚀 API Generation Examples

### 🔧 Basic Examples
- **`basic.ts`** - Basic text generation with streaming and non-streaming modes
- **`fill-in-middle.ts`** - Code completion and fill-in-the-middle scenarios

### 🧠 Thinking Examples
- **`thinking-bool.ts`** - Boolean thinking mode for yes/no questions and logical reasoning
- **`thinking-gpt.ts`** - GPT-style thinking with different levels (low, medium, high) for complex problem solving

### ⏹️ Abort Examples
- **`abort-manual.ts`** - Manual request abortion using the abort() method
- **`abort-timing.ts`** - Timing-based request abortion with setTimeout

## 🌐 Web API Examples

### Web Features
- **`web-fetch.ts`** - Web content fetching using OLLAMA_API_KEY
- **`web-search.ts`** - Web search functionality using OLLAMA_API_KEY

## ▶️ Running Examples

1. 🔌 Ensure Ollama is running on `http://localhost:11434`
2. 📥 Install required models:
   ```bash
   ollama pull qwen3:1.7b
   ollama pull qwen2.5-coder:1.5b
   ollama pull gpt-oss:20b-cloud
   ```
3. 🏃 Run examples:
   ```bash
   # API Generation Examples
   npx tsx examples/api-generate/basic.ts
   npx tsx examples/api-generate/fill-in-middle.ts
   npx tsx examples/api-generate/thinking-bool.ts
   npx tsx examples/api-generate/thinking-gpt.ts
   npx tsx examples/api-generate/abort-manual.ts
   npx tsx examples/api-generate/abort-timing.ts

   # Web API Examples (requires OLLAMA_API_KEY)
   export OLLAMA_API_KEY=your_api_key
   npx tsx examples/api-web/web-fetch.ts
   npx tsx examples/api-web/web-search.ts
   ```

### 🔄 Retry Mechanism

- The retry mechanism runs automatically when network errors occur (timeout, connection refused, server errors). It uses exponential backoff (1s → 2s → 4s) and only retries on retryable errors. See implementation: [`src/services/Fetch.ts`](../src/services/Fetch.ts#L89-L94)