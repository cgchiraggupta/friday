# StarDeFi AI

AI-powered DeFi assistant for Stellar. Natural language interface for swaps, lending, and portfolio management.

## Overview

Chat interface that translates user intent into Stellar transactions using DeepSeek's function calling. Built for the Stellar hackathon with production-ready architecture.

## Documentation Map

- `README.md` - project overview, setup, and usage
- `WORKFLOW.md` - development workflow, git conventions, testing, and deployment flow
- `docs/00_PROJECT_MASTER.md` - master project summary
- `docs/01_TECH_STACK_AND_ARCHITECTURE.md` - technical architecture
- `docs/02_FEATURES_AND_BUILDPLAN.md` - features and implementation plan
- `docs/03_CODE_REFERENCE.md` - code reference
- `docs/04_PITCH_AND_JUDGES.md` - pitch and judging notes
- `docs/05_KIMI_PROMPTS.md` - prompt references

## Architecture

Frontend (Next.js 14) -> API Route -> DeepSeek AI -> Tool Execution -> XDR Generation -> Freighter Signing

### Core Components
- Chat Interface: React + shadcn/ui with Vercel/Linear design system
- AI Engine: DeepSeek API with structured tool definitions  
- Transaction Builder: Stellar SDK for XDR construction
- Wallet Integration: Freighter extension for local signing
- DeFi Protocols: Soroswap (DEX), Blend (lending)

## Setup

### Prerequisites
node >= 18
npm or bun
Freighter wallet extension

### Installation
git clone <repo>
cd stellar-defi-ai
npm install

### Configuration
.env.local
DEEPSEEK_API_KEY=sk-...
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC=https://soroban-testnet.stellar.org

You can start from `.env.example` and copy the values into `.env.local`.

### Development
npm run dev
http://localhost:3000

### Vercel
Set these environment variables in the Vercel project settings before deploying:
- `DEEPSEEK_API_KEY`
- `NEXT_PUBLIC_STELLAR_NETWORK`
- `NEXT_PUBLIC_HORIZON_URL`
- `NEXT_PUBLIC_SOROBAN_RPC`

## Workflow

For the full engineering workflow, see `WORKFLOW.md`.

It covers:
- branch strategy and commit conventions
- local development and testing flow
- feature development checklist
- debugging guidance
- deployment and maintenance workflow

## Usage

### Wallet Connection
1. Install Freighter extension
2. Click "Connect Wallet" in UI
3. Approve connection request

### Available Commands
check my balance
swap 50 XLM to USDC
show lending rates
lend 100 USDC
withdraw from pool ABC123

### Transaction Flow
1. User sends natural language request
2. AI parses intent and calls appropriate tools
3. System fetches real-time data (prices, rates)
4. XDR transaction built with proper parameters
5. User reviews and signs in Freighter
6. Transaction submitted to network

## Technical Details

### AI Integration
- DeepSeek API with 30s timeout and retry logic
- Structured tool definitions for deterministic behavior
- Context injection (wallet address, balances)
- Loop prevention with usedTools tracking

### Error Handling
- Graceful degradation when APIs fail
- User-friendly error messages
- Transaction simulation before signing
- Slippage protection defaults

### Security
- Local signing only (keys never leave device)
- XDR validation before submission
- Network parameter verification
- Rate limiting on API endpoints

## Development

### Project Structure
src/
  app/                    # Next.js app router
    api/chat/route.ts    # AI endpoint
    page.tsx             # Main interface
  components/            # React components
  connectors/            # Wallet integration
  lib/                   # Business logic
    tools/               # DeFi operations
    stellar/             # Blockchain client
  store/                 # Zustand state

### Key Files
- src/app/api/chat/route.ts - Core AI logic with tool execution loop
- src/connectors/freighter.ts - Wallet adapter with proper error handling
- src/lib/tools/ - Protocol integrations (Soroswap, Blend)
- src/components/WalletConnect.tsx - Connection UI with status tracking

### Testing
Type checking: npm run typecheck
Lint: npm run lint
Build verification: npm run build

## Known Issues & Solutions

### DeepSeek API Loops
Issue: AI could get stuck calling same tool repeatedly
Fix: Added usedTools Set and iteration limit (5 max)

### Freighter API Mismatch
Issue: Using deprecated getPublicKey() instead of getAddress()
Fix: Updated all connector calls to use correct method

### CSS Build Errors
Issue: Custom CSS variables breaking Tailwind
Fix: Simplified to standard Tailwind classes with zinc palette

### Horizon API 404s
Issue: Test wallet addresses returning 404
Fix: Added fallback mock data with clear error states

## Production Considerations

### Environment Variables
- Use Vercel/Netlify secrets for API keys
- Set appropriate CORS headers
- Configure rate limiting

### Monitoring
- Log AI tool calls for debugging
- Track transaction success rates
- Monitor API response times

### Scaling
- Edge runtime for AI endpoint
- Redis for session management
- CDN for static assets

## Contributing

1. Fork repository
2. Create feature branch
3. Add tests for new functionality
4. Submit PR with clear description

## License

MIT
