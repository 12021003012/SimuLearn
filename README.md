# SimuLearn — AI-Powered Interactive Learning Platform

An advanced ed-tech platform that generates **interactive simulations**, **textbook-quality explanations**, **adaptive quizzes**, and **mock tests** for Indian competitive exam preparation (JEE, NEET, GATE, CBSE).

Built with Next.js 16, React 19, and a hybrid AI architecture that prioritizes local models (Ollama) with automatic cloud fallback (OpenAI/Anthropic).

---

## Features

| Feature | Description |
|---------|-------------|
| 🧪 **Interactive Simulations** | 16 prebuilt Canvas2D simulations + rule-based instant generation engine (6 physics templates) |
| 📖 **Deep Explanations** | 1500–2500 word textbook-quality lessons with LaTeX math, derivations, and JEE-level examples |
| ❓ **Adaptive Quizzes** | Difficulty-scaled (1–10) questions with step-by-step solutions and negative marking |
| 🎯 **Mock Tests** | Full JEE Mains/Advanced/NEET/GATE format with timer, question palette, and detailed review |
| 🤖 **AI Tutor** | Socratic-method streaming tutor with context-aware follow-ups |
| ⚡ **Rule-Based Engine** | Instant simulation generation without AI — deterministic physics equations + Canvas2D |
| 🔐 **Auth System** | NextAuth.js with credentials provider, bcrypt hashing, role-based access |
| 📊 **Dashboard** | XP tracking, learning streaks, topic progress |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Frontend | React 19, Tailwind CSS, Framer Motion, KaTeX |
| AI (Primary) | Ollama (llama3.1:8b, qwen3.5:35b, qwen3-coder:30b) |
| AI (Fallback) | OpenAI GPT-4o/4o-mini, Anthropic Claude |
| Auth | NextAuth.js v5 (beta) |
| Database | Supabase (PostgreSQL) |
| Cache | Upstash Redis |
| State | Zustand 5 |
| Simulations | Pure Canvas2D (no external libs) |

---

## Quick Start

### Prerequisites

- Node.js 20+ and npm 10+
- (Optional) Ollama server for local AI models

### Installation

```bash
git clone https://github.com/12021003012/SimuLearn.git
cd SimuLearn
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual keys:

```env
# Required for AI features
OPENAI_API_KEY=sk-your-key-here

# Optional — local AI (faster, free)
OLLAMA_BASE_URL=http://localhost:11434

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cache (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/
│   │   ├── learn-stream/   # Streaming lesson generation
│   │   ├── mock-test/      # Exam question generation
│   │   ├── quiz/           # Adaptive quiz API
│   │   ├── simulate/       # AI simulation generation
│   │   ├── simulate-rule/  # Rule-based instant simulation API
│   │   └── tutor/          # AI tutor streaming
│   ├── learn/[query]/      # Dynamic learning page
│   ├── mock-test/          # Full mock test interface
│   ├── simulations/        # Simulation gallery
│   └── subjects/           # Subject browser
├── components/             # React components
│   ├── home/               # Landing page sections
│   ├── MarkdownRenderer    # KaTeX + Markdown renderer
│   ├── QuizCard            # Interactive quiz component
│   └── SimulationFrame     # Iframe simulation viewer
├── data/                   # Static data (curriculum, simulations)
├── lib/
│   ├── ai/                 # AI provider abstraction layer
│   │   ├── ollama.ts       # Local Ollama client
│   │   ├── model-router.ts # Smart model selection + classification
│   │   ├── text-generator  # Explanation generation
│   │   ├── sim-generator   # AI simulation code generation
│   │   └── quiz-generator  # Quiz/question generation
│   ├── auth/               # Authentication config
│   ├── cache/              # Redis caching layer
│   ├── security/           # Rate limiting, input validation
│   └── simulation-engine   # Rule-based simulation templates
├── types/                  # TypeScript type definitions
public/
└── simulations/            # 16 prebuilt HTML simulations
    ├── physics/            # Projectile, waves, circuits, optics, etc.
    ├── chemistry/          # Reactions, molecular orbitals
    ├── math/               # Integration, conic sections
    ├── cs/                 # Sorting, BST, Dijkstra
    └── biology/            # Cell division, neuron, heart
```

---

## AI Architecture

```
User Request
     │
     ▼
┌─────────────┐     ┌──────────────┐
│ Rule-Based  │────▶│ Instant HTML │ (no AI needed)
│ Template?   │     └──────────────┘
└──────┬──────┘
       │ No match
       ▼
┌─────────────┐     ┌──────────────┐
│   Ollama    │────▶│  Local LLM   │ (free, fast, private)
│  Available? │     └──────────────┘
└──────┬──────┘
       │ Unreachable
       ▼
┌─────────────┐     ┌──────────────┐
│   OpenAI /  │────▶│  Cloud LLM   │ (reliable fallback)
│  Anthropic  │     └──────────────┘
└─────────────┘
```

- **Rule-based engine**: 6 physics templates generate simulations instantly without any AI call
- **Ollama primary**: Uses local GPU models for zero-cost, low-latency generation
- **Cloud fallback**: Automatically activates when Ollama is unreachable (e.g., deployed on Vercel)

---

## Deployment

See [DEPLOY.md](DEPLOY.md) for the full production deployment guide.

**Quick Vercel deploy:**

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new)
3. Set environment variables
4. Deploy — done

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/learn-stream` | POST | Stream a full lesson (hook + explanation + math + quiz + simulation) |
| `/api/simulate-rule` | GET | Instant rule-based simulation (`?template=pendulum`) |
| `/api/simulate` | POST | AI-generated simulation |
| `/api/quiz` | POST | Generate adaptive quiz questions |
| `/api/mock-test` | POST | Generate full mock test |
| `/api/tutor` | POST | Streaming AI tutor response |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is private. All rights reserved.

---

## Author

Built by [Deep Sengupta](https://github.com/12021003012)
