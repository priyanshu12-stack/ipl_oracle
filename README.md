# 🏏 IPL Oracle — The Cricket AI

> Not just a chatbot. A stadium experience powered by AI.

**Live Demo:**{ }

---

## What is this?

IPL Oracle is a purpose-built AI companion for the Indian Premier League — the world's most watched cricket league and a cultural institution of 1.4 billion people.

This isn't a generic chatbot with an IPL skin. Every design decision — the dark stadium aesthetic, the cricket ball loading animation, the "Rain Delay" error screen, the team color that follows you from the landing page into every chat bubble — was made deliberately to make the product *feel* like it belongs inside a cricket stadium.

**The experience you design around the chatbot is the actual product.**

---

## Features

### 🏏 Chat Mode
Ask anything about IPL — players, teams, records, auctions, controversies, iconic moments from 2008 to today. Responses stream token-by-token like live match commentary.

### 🎯 Quiz Mode
AI-generated multiple choice questions with instant answer reveal, color-coded feedback, streak tracking, and commentary-style explanations from the Oracle.

### ⚖️ Compare Mode
Head-to-head player stat comparison. Enter any two player names, get a structured breakdown with green/red winner highlights and an Oracle verdict in commentator voice.

### ⚡ Quick Action Bar
Five one-click shortcuts — Run Kings, Best Finishes, IPL Winners, Top Bowlers, Current Form — for zero-typing discovery.

### 📋 Copy on Every Response
Clipboard copy button on every bot message with a "Copied!" state that resets after 2 seconds.

### 📊 Session Analytics
Questions asked, quiz accuracy percentage, and session duration — all tracked locally, shown in a header popover. No backend needed.

---

## Frontend Thinking

Every UI state is handled with intention:

| State | What shows | Why it matters |
|---|---|---|
| Empty | Suggested question chips | No user should face a blank box |
| Loading | Cricket ball bounce animation | Branded delight, not a generic spinner |
| Typing | Blinking cursor at stream end | Feels like live match commentary |
| Error | "Rain Delay!" screen with retry | Personality in failure shows product craft |
| Success | Smooth fade-in + auto-scroll | Polish that reveals attention to detail |

**Team color theming:** The team a user picks on the landing page flows into `--team-color` CSS variable, which colors every message bubble, button glow, copy button, and stat highlight throughout the session. One choice, full consistency.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Vercel-native, API routes built-in |
| Language | TypeScript | Type safety across all components |
| Styling | Tailwind CSS | Rapid theming, responsive utilities |
| AI | Google Gemini API | Free tier, fast streaming responses |
| Animations | Framer Motion | Smooth entrances, tab indicators, quiz reveals |
| Icons | Lucide React | Clean SVG, tree-shakeable |
| Fonts | Bebas Neue + Poppins | Scoreboard energy + clean body |
| Deployment | Vercel | Zero-config, instant preview URLs |

---

## Project Structure
```
ipl-oracle/
├── app/
│   ├── page.tsx              ← Landing page with team selector
│   ├── chat/page.tsx         ← Main chat interface + all 3 modes
│   ├── api/chat/route.ts     ← Gemini streaming API
│   └── api/quiz/route.ts     ← Quiz question generation
├── components/
│   ├── ChatWindow.tsx        ← Chat state machine
│   ├── MessageBubble.tsx     ← Scorecard-style bubbles + copy
│   ├── QuizCard.tsx          ← Interactive quiz with answer reveal
│   ├── PlayerComparison.tsx  ← Split-screen stat comparison
│   ├── QuickActionBar.tsx    ← Scrollable shortcut pills
│   ├── LoadingBall.tsx       ← Cricket ball bounce animation
│   ├── ErrorState.tsx        ← Rain Delay screen
│   ├── SuggestedChips.tsx    ← Empty state question chips
│   ├── SessionStats.tsx      ← Analytics header popover
│   └── FirstVisitTooltip.tsx ← Onboarding hint
├── hooks/
│   ├── useAnalytics.ts       ← localStorage session tracking
│   └── useFirstVisit.ts      ← First visit detection
└── lib/
    ├── systemPrompt.ts       ← Oracle AI persona + JSON formats
    ├── teamThemes.ts         ← 10 IPL team color configs
    └── quickActions.ts       ← Quick action bar data
```

---

## Local Setup
```bash
# Clone and install
git clone https://github.com/priyanshu12-stack/ipl_oracle.git
cd ipl-oracle
npm install

# Add your Gemini API key
# Get one free at: https://aistudio.google.com/apikey
echo 'GEMINI_API_KEY=your_key_here' > .env.local

# Run
npm run dev
# Open http://localhost:3000
```

---

## Design Decisions Worth Noting

**Why IPL?** It's the world's most watched cricket league and something I'd genuinely use. A topic with real passion produces better design decisions than a generic subject.

**Why streaming responses?** Token-by-token text arrival feels like live match commentary. It fits the product's voice in a way that a full-response-then-display approach never could.

**Why a "Rain Delay" error screen?** A product's character shows most when things break. Anyone can make a working state look good. The error state is where craft separates products from demos.

**Why localStorage for analytics?** Zero backend complexity, instant setup, works on free hosting. The question counter and quiz accuracy are delightful details — not core features. They should never require infrastructure.

**Why Bebas Neue?** It's the font of scoreboards, stadiums, and cricket jerseys. Every time the headline renders, it's a subconscious signal: *this was built for this.*



---

*Built with 🏏 and way too much IPL knowledge.*
