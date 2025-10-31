# DecentraCode - AI Agent Challenge Submission

![DecentraCode](./assets/NosanaBuildersChallenge03.jpg)

**Builders' Challenge #3: AI Agents 102** | *Nosana & Mastra*

---

## 🚀 What is DecentraCode?

A decentralized code review platform combining AI-powered analysis with human expertise. Get instant feedback on your code through intelligent agents running on Nosana's GPU network.

**The Problem**: Code reviews are slow, inconsistent, and depend on centralized platforms with limited reviewer availability.

**The Solution**: 
- **Agents + Human Reviews**: Automated analysis with expert human feedback
- **Credit & Staking System**: Fair rewards for quality reviewers (Bronze/Silver/Gold tiers)
- **Decentralized**: Runs on Nosana's GPU network—no bottlenecks

---

## 🛠️ Tech Stack

**Frontend**: Next.js 15, React 19, Tailwind CSS, Radix UI  
**Backend**: PostgreSQL, Supabase Auth, Socket.io  
**AI**: Mastra Core (v0.22.2), Ollama (Qwen 3:8b), MCP  
**Infrastructure**: Nosana GPU network (6GB VRAM)

---

## 🤖 Mastra Implementation

### Agents
1. **Code Analyzer Agent** - Analyzes code quality, docs, testing, security across multiple languages
2. **Reviewer Matcher Agent** - Matches submissions with reviewers based on tier, reputation, and expertise

### Tools
- Repository cloning and reading (isomorphic-git)
- Code analysis with quality scoring
- Reviewer data fetching (reputation, expertise, availability)

### Workflows
- **Repository Analysis**: Clone → Read → Analyze → Format JSON
- **Reviewer Matching**: Fetch profile data → Match based on tier/reputation

---

## 💡 Key Benefits

**For Developers**: Instant AI analysis + expert human feedback, multi-language support  
**For Reviewers**: Earn credits, build reputation, stake for priority access  
**For Everyone**: Decentralized, scalable, transparent—no single point of failure

---

## 🚀 Quick Start

```bash
git clone https://github.com/hksharma2004/agent-challenge
cd agent-challenge
cp .env.example .env
pnpm install
pnpm run dev:ui      # Port 3000
pnpm run dev:agent   # Port 4111
```

**Key Environment Variables:**
```env
OLLAMA_API_URL=https://3yt39qx97wc9hqwwmylrphi4jsxrngjzxnbw.node.k8s.prd.nos.ci/api
MODEL_NAME_AT_ENDPOINT=qwen3:8b
DATABASE_URL=your_postgresql_url
GITHUB_PAT=your_github_token
```

---

## 🐳 Deploy to Nosana

```bash
# Build and push Docker image
docker build -t hksharma2004/decentracode:latest .
docker push hksharma2004/decentracode:latest

# Deploy via Nosana Dashboard or CLI
nosana job post --file ./nos_job_def/nosana_mastra.json --market nvidia-3090 --timeout 30
```

---

## 📚 Resources

- [Nosana Docs](https://docs.nosana.io) | [Mastra Docs](https://mastra.ai/en/docs)
- [Nosana Discord](https://nosana.com/discord) | [@nosana_ai](https://x.com/nosana_ai)

---

**DecentraCode** - Decentralized code reviews powered by AI agents  
*Built for Nosana Builders' Challenge #3*
