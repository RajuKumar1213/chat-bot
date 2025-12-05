# 🤖 AI Chat Bot with RAG (Retrieval-Augmented Generation)

A smart chatbot powered by vector search and AI that answers questions based on your custom documents. Built with Node.js, MongoDB Atlas Vector Search, Ollama embeddings, and OpenRouter AI.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [How It Works](#-how-it-works)

## ✨ Features

- **RAG-based Q&A**: Answers questions using context from your documents
- **Vector Search**: Uses MongoDB Atlas Vector Search for semantic similarity
- **Local Embeddings**: Generates embeddings using Ollama (embeddinggemma model)
- **AI-Powered Responses**: Uses OpenRouter API with Amazon Nova 2 Lite model
- **Gen-Z Style**: Responds in a friendly, casual tone
- **Document Chunking**: Automatically splits large documents into manageable chunks
- **RESTful API**: Easy-to-use HTTP endpoints

## 🛠 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB Atlas (with Vector Search)
- **Embeddings**: Ollama (embeddinggemma model)
- **AI Model**: OpenRouter API (Amazon Nova 2 Lite)
- **Dependencies**: mongoose, cors, dotenv, cookie-parser

## 📁 Project Structure

```
chat-bot/
├── src/
│   ├── db/
│   │   └── index.js              # MongoDB connection setup
│   ├── docs/
│   │   └── alok.txt              # Sample document for knowledge base
│   ├── routes/
│   │   └── chat.route.js         # Chat API routes
│   ├── utils/
│   │   └── ollama-embed.js       # Ollama embedding utility
│   ├── app.js                    # Express app configuration
│   ├── chat.js                   # Main chatbot logic
│   ├── insert-doc.js             # Script to insert documents into DB
│   ├── retrieve.js               # Vector search retrieval logic
│   └── vector-index.js           # Script to create vector search index
├── index.js                      # Server entry point
├── package.json                  # Dependencies and scripts
├── .env                          # Environment variables
└── README.md                     # This file
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
2. **Ollama** - [Download and install Ollama](https://ollama.ai/)
3. **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/cloud/atlas)
4. **OpenRouter API Key** - [Get your key here](https://openrouter.ai/)

### Install Ollama Model

After installing Ollama, pull the embedding model:

```bash
ollama pull embeddinggemma
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chat-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=8000
   OPENROUTER_API_KEY=your_openrouter_api_key
   CORS_ORIGIN=*
   ```

4. **Prepare your documents**
   
   Place your text documents in `src/docs/` folder (e.g., `alok.txt`)

## ⚙️ Configuration

### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create a database named `chatbot_db`
3. Create a collection named `documents`
4. Copy your connection string to `.env`

### OpenRouter API

1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Generate an API key
3. Add it to your `.env` file

## 🎯 Usage

### Step 1: Start Ollama

Make sure Ollama is running on your machine:

```bash
ollama serve
```

### Step 2: Insert Documents

Load your documents into the database with embeddings:

```bash
npm run insert
```

This will:
- Read your document from `src/docs/alok.txt`
- Split it into chunks of 300 words
- Generate embeddings for each chunk using Ollama
- Store chunks and embeddings in MongoDB

### Step 3: Create Vector Index

Create the vector search index in MongoDB:

```bash
npm run vector-index
```

This creates a vector search index with:
- 768 dimensions (embeddinggemma model)
- Dot product similarity
- Scalar quantization

### Step 4: Start the Server

Run the chatbot server:

```bash
npm start
```

The server will start on `http://localhost:8000`

## 🌐 API Endpoints

### POST `/api/chat/ask`

Ask a question to the chatbot.

**Request Body:**
```json
{
  "query": "What is your question?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "The AI-generated answer based on your documents"
}
```

**Example using cURL:**
```bash
curl -X POST http://localhost:8000/api/chat/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "Tell me about Alok"}'
```

**Example using JavaScript:**
```javascript
fetch('http://localhost:8000/api/chat/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'What can you tell me?' })
})
.then(res => res.json())
.then(data => console.log(data.answer));
```

## 🧠 How It Works

1. **Document Ingestion**
   - Documents are split into chunks (300 words each)
   - Each chunk is converted to a 768-dimensional vector using Ollama's embeddinggemma model
   - Chunks and embeddings are stored in MongoDB

2. **Query Processing**
   - User sends a question via API
   - Question is converted to a vector embedding
   - MongoDB Vector Search finds the top 10 most similar chunks

3. **Answer Generation**
   - Top 4 relevant chunks are selected as context
   - Context + question are sent to OpenRouter AI (Amazon Nova 2 Lite)
   - AI generates a contextual answer in Gen-Z style
   - Response is streamed back to the user

4. **Vector Search**
   - Uses MongoDB's `$vectorSearch` aggregation
   - Compares query embedding with stored embeddings
   - Returns results ranked by similarity score

## 🔧 Scripts

- `npm start` - Start the server with nodemon (auto-reload)
- `npm run insert` - Insert documents into database
- `npm run vector-index` - Create vector search index

## 🎨 Customization

### Change AI Model

Edit `src/chat.js`:
```javascript
model: "amazon/nova-2-lite-v1:free"  // Change to any OpenRouter model
```

### Adjust Chunk Size

Edit `src/insert-doc.js`:
```javascript
const chunks = chunkText(bigText, 500);  // Change from 300 to 500 words
```

### Modify Response Style

Edit the prompt in `src/chat.js` to change the AI's personality and response format.

### Change Number of Context Chunks

Edit `src/chat.js`:
```javascript
.slice(0, 4);  // Change from 4 to any number
```

## 🐛 Troubleshooting

**Ollama connection error:**
- Ensure Ollama is running: `ollama serve`
- Check if embeddinggemma model is installed: `ollama list`

**MongoDB connection error:**
- Verify your connection string in `.env`
- Check if your IP is whitelisted in MongoDB Atlas

**Vector search not working:**
- Ensure vector index is created: `npm run vector-index`
- Wait for index to become queryable (may take a few minutes)

**OpenRouter API error:**
- Verify your API key is correct
- Check your OpenRouter account credits

## 📝 License

ISC

## 👤 Author

Your Name

---

Made by Rajiv with ❤️ using Node.js, MongoDB, and AI
