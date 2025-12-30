# AI Chat Support Agent

An AI-powered live chat support system. This application simulates a customer support chat where an AI agent answers user questions using real LLM integration.

## 🚀 Live Demo

- **Frontend**: https://ai-chat-delta-ivory.vercel.app/
- **Backend API**: https://ai-chat-gceq.onrender.com
- **Health Check**: https://ai-chat-gceq.onrender.com/health

**Try it now!** Open the frontend URL and ask questions like:
- "What are your shipping options?"
- "How do I return an item?"
- "What payment methods do you accept?"

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **TypeScript** - Type-safe server-side JavaScript
- **Express.js** - Web framework for RESTful API
- **Prisma ORM** - Type-safe database client
- **SQLite** - Lightweight SQL database (easy to run locally, no installation needed)
- **Groq API** - Ultra-fast LLM inference (Llama 3.3 70B model)

### Frontend
- **React** + **TypeScript** - Component-based UI with type safety
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with animations

---

## ✨ Features

### Core Functionality
✅ Real-time chat interface with user/AI message distinction
✅ Persistent conversation storage in SQLite database
✅ Real LLM integration (Groq with Llama 3.3 70B)
✅ Session management - conversations persist across page reloads
✅ Contextual responses using conversation history

### UX Enhancements
✅ Auto-scroll to latest message
✅ "Agent is typing..." indicator
✅ Disabled send button while processing
✅ Suggested questions for quick start
✅ Beautiful gradient UI with smooth animations
✅ Error handling with user-friendly messages

### Backend Architecture
✅ Clean separation of concerns (routes → services → data)
✅ Provider pattern for LLM abstraction (easy to swap providers)
✅ Request logging with unique IDs for debugging
✅ Environment validation on startup (fail-fast approach)
✅ Comprehensive error handling middleware
✅ Database indexing for query performance

### Robustness
✅ Input validation (empty messages, length limits)
✅ Graceful LLM/API failure handling
✅ No hard-coded secrets (environment variables)
✅ TypeScript for compile-time type safety

---

## 📦 Project Structure

```
-ai-chat/
├── backend/                    # Express + TypeScript backend
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts         # Environment validation
│   │   ├── db/
│   │   │   └── prisma.ts      # Prisma client singleton
│   │   ├── interfaces/
│   │   │   └── ILLMProvider.ts # LLM provider interface
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts # Global error handler
│   │   │   └── logger.ts       # Request logging
│   │   ├── providers/
│   │   │   └── GroqProvider.ts # Groq LLM implementation
│   │   ├── routes/
│   │   │   └── chat.routes.ts  # Chat API endpoints
│   │   ├── services/
│   │   │   ├── chat.service.ts # Chat business logic
│   │   │   └── llm.service.ts  # LLM service facade
│   │   └── index.ts            # Server entry point
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.tsx        # Main chat component
│   │   │   └── Chat.css        # Chat styling
│   │   ├── services/
│   │   │   └── api.ts          # Backend API client
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript type definitions
│   │   ├── App.tsx             # Root component
│   │   ├── main.tsx            # React entry point
│   │   └── style.css           # Global styles
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                   # This file
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js** v16+ and **npm** installed
- **Git** installed
- A **Groq API key** (free from https://console.groq.com)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Ai-Chat.git
cd Ai-Chat
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env and add your Groq API key
# GROQ_API_KEY="your_actual_api_key_here"
```

**Edit `backend/.env`:**
```env
DATABASE_URL="file:./dev.db"
GROQ_API_KEY="your_groq_api_key_here"  # ← Add your key here
PORT=3001
NODE_ENV=development
```

**Set up database:**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) View database in Prisma Studio
npx prisma studio
```

**Start backend server:**
```bash
npm run dev
```

You should see:
```
✅ Environment variables validated
🚀 Server running on http://localhost:3001
📡 Health check: http://localhost:3001/health
```

### Step 3: Frontend Setup

Open a **new terminal** and:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# (Optional) Configure backend URL
cp .env.example .env
# Default is http://localhost:3001/api - no changes needed for local dev

# Start development server
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Step 4: Test the Application

1. Open **http://localhost:5173** in your browser
2. Try these test messages:
   - "Hi, what can you help me with?"
   - "What are your shipping options?"
   - "How do I return an item?"
   - "What payment methods do you accept?"

The AI should respond with contextual answers based on the SpurShop knowledge base!

---

## 🏗️ Architecture Overview

### Backend Architecture

The backend follows a **clean, layered architecture** with clear separation of concerns:

```
Client Request
    ↓
Routes Layer (chat.routes.ts)
    ├── Input validation
    ├── Request logging
    └── Error handling
    ↓
Service Layer (chat.service.ts)
    ├── Business logic
    ├── Session management
    └── Orchestrates data + LLM
    ↓
┌─────────────────┬──────────────────┐
│                 │                  │
Data Layer    LLM Service Layer
(Prisma)      (llm.service.ts)
    │             └── Provider Pattern
    │                 (GroqProvider.ts)
    ↓                      ↓
Database              Groq API
```

#### Key Design Decisions

**1. Provider Pattern for LLM** ⭐
- Created `ILLMProvider` interface that all LLM providers must implement
- Easy to swap Groq for OpenAI, Claude, or add multiple providers
- Makes it trivial to use different providers for different channels (WhatsApp → OpenAI, Instagram → Claude)
- Testable (can inject mock providers)

```typescript
// Easy to switch providers - just one line change!
const llmProvider: ILLMProvider = new GroqProvider(process.env.GROQ_API_KEY);
// Could easily be:
// const llmProvider: ILLMProvider = new OpenAIProvider(process.env.OPENAI_API_KEY);
```

**2. Service Layer Abstraction**
- Routes handle HTTP concerns (validation, status codes)
- Services handle business logic (chat flow, LLM calls)
- Data layer handles persistence (Prisma)
- Clean separation makes testing and extending easy

**3. Request Tracing with Unique IDs**
- Every request gets a unique ID (`req_xyz123`)
- All logs for that request include the ID
- Makes debugging production issues trivial

**4. Fail-Fast Environment Validation**
- Server validates all required env vars on startup
- Prevents cryptic runtime errors
- Clear error messages guide developers

**5. Database Indexing**
- Composite index on `(conversationId, createdAt)` for history queries
- Optimizes the most common query pattern

### Frontend Architecture

Simple, component-based architecture:

```
App.tsx (Root)
    ↓
Chat.tsx (Main Component)
    ├── State management (useState)
    ├── API calls (via api.ts service)
    ├── Auto-scroll (useEffect + useRef)
    └── localStorage for session persistence
```

---

## 🤖 LLM Integration Details

### Provider: Groq

**Why Groq?**
- ✅ **Generous free tier** (14,400 requests/day)
- ✅ **Ultra-fast inference** (uses LPUs, not GPUs)
- ✅ **OpenAI-compatible API** (easy migration path)
- ✅ **No credit card required** for free tier
- ✅ **High-quality models** (Llama 3.3 70B)

### Model: Llama 3.3 70B Versatile

Large language model with 70 billion parameters, excellent for conversational AI.

### Prompting Strategy

**System Prompt:**
```
You are a friendly and helpful customer support agent for SpurShop,
an e-commerce store.

[FAQ Knowledge Base embedded here]

Guidelines:
- Be friendly, professional, and concise
- Use the information from the knowledge base above
- If asked about something not in the knowledge base, politely say
  you don't have that information
- Use emojis occasionally to be friendly
- Format responses with bullet points when appropriate
```

**Context Management:**
- Include last 10 messages in conversation history
- Provides context for follow-up questions
- Prevents token limit issues with very long conversations

**Knowledge Base:**
Hardcoded in the prompt with:
- Shipping policy (rates, timing, international)
- Return/refund policy (30-day guarantee, costs)
- Support hours
- Payment methods

**Alternative Approach Considered:**
Could store knowledge in database and inject dynamically, but hardcoding in prompt is simpler and works well for this scope.

### Error Handling

```typescript
try {
  return await llmProvider.generateReply(userMessage, history);
} catch (error) {
  // Graceful fallback - never crash
  return "I'm having trouble connecting to my knowledge base.
          Please try again or email support@spurshop.com";
}
```

---

### Architecture & Quality
- ✅ Clean code structure (routes → services → data)
- ✅ Provider pattern for extensibility
- ✅ Separation of concerns
- ✅ Request logging for debugging
- ✅ Environment validation
- ✅ Database indexing
- ✅ Comprehensive .gitignore
- ✅ .env.example templates

---

## ⚖️ Trade-offs & Design Decisions

### What I Chose and Why

**1. SQLite over PostgreSQL**
- ✅ **Pro**: Zero setup, works immediately, perfect for demo
- ✅ **Pro**: Easier to run locally for evaluators
- ❌ **Con**: Not production-ready for high-traffic
- **Decision**: Perfect for assignment scope, easy to migrate to PostgreSQL later (Prisma makes this trivial)

**2. Groq over OpenAI/Claude**
- ✅ **Pro**: Free tier is very generous, no credit card needed
- ✅ **Pro**: Extremely fast inference (better UX)
- ✅ **Pro**: OpenAI-compatible API (easy to swap)
- ❌ **Con**: Less well-known than OpenAI
- **Decision**: Provider pattern makes switching trivial; Groq is perfect for free demo

**3. Hardcoded Knowledge Base vs. Database**
- ✅ **Pro**: Simpler, faster to implement
- ✅ **Pro**: No need for admin UI to manage FAQs
- ✅ **Pro**: Knowledge is version-controlled with code
- ❌ **Con**: Can't update FAQs without redeploying
- **Decision**: Right choice for assignment scope; easy to move to DB later

**4. localStorage for Session Persistence**
- ✅ **Pro**: Works without authentication
- ✅ **Pro**: Conversations persist across page reloads
- ❌ **Con**: Tied to single browser/device
- **Decision**: Good UX without complexity of auth system

---

## 🚀 If I Had More Time...

### Features I'd Add

**1. WebSocket Support**
- Real-time bidirectional communication
- Show when agent starts typing immediately
- Better UX for multi-user support scenarios

**2. Admin Dashboard**
- View all conversations
- Analytics (response times, common questions)
- Manage FAQ knowledge base via UI
- Export conversations for training data

**3. Multi-Channel Support**
- WhatsApp Business API integration
- Instagram Direct Message integration
- Facebook Messenger integration
- Demonstrates extensibility of the architecture

---

## 🧪 Testing

### Manual Testing Checklist

**Happy Path:**
- ✅ Send message → receive AI reply
- ✅ Follow-up questions use context
- ✅ Page reload preserves conversation
- ✅ Suggested questions work

**Error Handling:**
- ✅ Empty message → validation error
- ✅ Very long message (>1000 chars) → validation error
- ✅ LLM API failure → graceful fallback message
- ✅ Network error → user-friendly error

**Edge Cases:**
- ✅ Rapid message sending → queued properly
- ✅ Special characters in messages → handled correctly
- ✅ Extremely long conversation → history capped at 10 messages

### API Testing

Test the health check:
```bash
curl http://localhost:3001/health
```

Test chat endpoint:
```bash
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your shipping options?"}'
```

---

## 📝 Environment Variables

### Backend (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | SQLite database path | Yes | `file:./dev.db` |
| `GROQ_API_KEY` | Groq API key | Yes | `gsk_xxx...` |
| `PORT` | Server port | No | `3001` (default) |
| `NODE_ENV` | Environment | No | `development` |

### Frontend (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | No | `http://localhost:3001/api` |

---

## 📄 API Documentation

### POST /api/chat/message

Send a chat message and receive AI reply.

**Request:**
```json
{
  "message": "What's your return policy?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "reply": "We have a 30-day money-back guarantee! ...",
  "sessionId": "abc-123-xyz"
}
```

**Validation:**
- `message`: Required, non-empty string, max 1000 characters
- `sessionId`: Optional UUID string

**Status Codes:**
- `200`: Success
- `400`: Validation error (empty message, too long, etc.)
- `500`: Server error (LLM failure, database error)

---

## 🤝 Contributing

This is an assignment project, but feedback is welcome! Open an issue or PR.

---

## 👨‍💻 Author

**Sarthak Pandey**
---

## 📜 License

MIT License - Feel free to use this project as reference or learning material.

---

**⭐ If this project helped you, please give it a star on GitHub!**
