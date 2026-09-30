# OmniTale

An elegant, minimalist, and privacy-first solo text-based RPG interface powered by Large Language Models.

### 🧪 The "Casual Coding" Experiment

This application started as a strict experiment in mobile-only development, where the entire initial MVP—from architecture to deployment—was built exclusively from a smartphone using AI-assisted vibe coding. Today, OmniTale is a living project maintained and continuously improved through a lightweight remote setup: **Antigravity CLI** running on a small home server, controlled on-the-go from a smartphone (via the Antigravity mobile app) or directly from any browser. It’s an ongoing exploration of how agentic AI and headless remote development accelerate full-stack engineering and casual coding across all form factors.

### 🚀 [Play Now in Your Browser](https://mceleri.github.io/OmniTale/)

OmniTale acts as a local visual layer and prompt engine for your AI Game Master, giving you complete control over your character sheets, lore codex, and master journals.

> 🚧 **Work in Progress**: This app is a passion project under active development, built for fun, exploration, and continuous improvement.

---

## ✨ Key Features

- **📱 Smartphone-First Design**: Optimized from the ground up for mobile browsers with a compact, single-thumb layout, collapsible bottom drawers, and fluid touch ergonomics.
- **🧠 Agentic Narrative Pipeline (Beta / 2-Step)**: Optional two-stage reasoning pipeline that splits every turn into a **Dramatic Arbiter (Judge & Pacing Director)** step followed by the **Storyteller Prose** generator, unlocking proactive NPC initiative, world logic, and pacing control.
- **🎲 Fate Oracle & 5-Axis Stochastic Matrix (D100)**:
  - **Fate Oracle**: Automated per-turn D100 roll classified into 5 narrative tiers (*Very Unfavorable*, *Unfavorable*, *Neutral*, *Favorable*, *Very Favorable*) displayed with contextual UI badges.
  - **Campaign Stochastic Matrix**: Procedurally generates or manually customizes 5 starting world dimensions (*Environment*, *Social Climate*, *Resources*, *Entourage*, *Catalyst*) to ensure high replayability.
- **⚡ Dynamic Narrator Styles & Verbosity**: Switch tone and pacing on the fly directly from the top bar:
  - **Cinematic** (2–3 blocks, rapid mobile pacing, high action/dialogue)
  - **Balanced** (2–4 blocks, natural narrative rhythm)
  - **Literary** (3–5 blocks, rich sensory atmosphere and psychological depth)
- **🗺️ 5-Tab Worldbuilding Canvas & Campaign Templates**:
  - Deep campaign creation broken down into *Setting*, *Character Sheet*, *Factions*, *Conflicts*, and *Historical Facts* + *Starting Intent*.
  - Save custom creations as reusable, cloneable **Templates** or jump straight into playable **Tales**.
- **📊 Analytics & Token Inspector Dashboard**:
  - Real-time token consumption breakdown across Lorebook, Character Sheet, Master Journal, Feedback, and chat history.
  - Cumulative vs. individual turn charts, message distribution stats, word counts, and context health monitor.
- **✍️ Interactive Story Branching & QoL Controls**:
  - **Edit & Regenerate**: Modify your previous action and immediately re-roll the GM's response.
  - **Regenerate Response**: Re-roll the latest GM narrative turn with a single click.
  - **Granular Message Deletion**: Prune or delete individual turns to curate your narrative thread.
  - **Keyboard Ergonomics**: Quick send with `Ctrl+Enter` / `Cmd+Enter` and floating scroll-to-bottom navigation.
- **📜 Dynamic Character Dossier & Codex (Lorebook)**: Interactive, auto-saving character sheet and structured Markdown Lorebook that organically evolves as your adventure unfolds.
- **👁️ AI Master Journal**: A secret log area containing NPC motivations, hidden threats, and plot secrets kept private from the main narrative feed.
- **💬 Secret GM Feedback**: Real-time directives to guide tone, difficulty, sensory descriptions, or narrative focus without breaking character.
- **🎨 Clean Markdown & Immersive Typography**: Rich rendering of dialogue, quotes, headers, bold, italics, lists, and code blocks.

---

## 🏛️ Architecture & Context Compaction Strategy

OmniTale is architected around a **browser-only Single Page Application (SPA)** with a strict **zero-backend philosophy**, engineered to maximize privacy, cost efficiency, and performance across both cloud APIs and local open-source models.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        OmniTale Client (Browser)                       │
│                                                                        │
│  ┌────────────────────┐   ┌──────────────────┐   ┌──────────────────┐  │
│  │   Zustand Store    │   │ IndexedDB (idb)  │   │  Analytics View  │  │
│  │ (Modular Slices)   │   │  Local Sandbox   │   │ (Token Monitor)  │  │
│  └─────────┬──────────┘   └──────────────────┘   └──────────────────┘  │
│            │                                                           │
│  ┌─────────▼────────────────────────────────────────────────────────┐  │
│  │              Context Engine & Prompt Synthesis                   │  │
│  │  • Structured State: Character + Lorebook + Master Journal       │  │
│  │  • Sliding Window: Last 10 chat messages only                    │  │
│  │  • Fate Oracle (D100) + Stochastic Matrix Directives             │  │
│  └─────────┬──────────────────────────────────┬─────────────────────┘  │
└────────────┼──────────────────────────────────┼────────────────────────┘
             │                                  │                         
    [Every Turn: ~2k-4k Tokens]      [Every 5 Turns: Background Task]     
             │                                  │                         
             ▼                                  ▼                         
┌─────────────────────────┐        ┌────────────────────────────────────┐ 
│  Direct LLM Generation  │        │   Asynchronous State Distillation  │ 
│  • Google Gemini Nativo │        │   • Updates Lorebook Markdown      │ 
│  • OpenRouter Endpoints │        │   • Updates Secret Master Journal  │ 
│  • Local Ollama / vLLM  │        │   • Evicts digested raw dialogue   │ 
└─────────────────────────┘        └────────────────────────────────────┘ 
```

### 🧠 The Context Compaction Engine: Why It Matters

In naive text RPG interfaces, the prompt engine simply appends the entire chat history to every request (or truncates it blindly to the last $N$ messages). This creates two major bottlenecks:
1. **Unbounded Context Growth**: Chat histories rapidly exceed 8k–32k tokens, causing exponential pricing spikes on commercial APIs and high latency/memory pressure.
2. **Context Loss with Blind Truncation**: Cutting off older messages causes the AI to forget critical world facts, NPC introductions, and earlier quest events.

#### How OmniTale Solves This:
- **Decoupled Living State**: Long-term memory is externalized into dedicated, dense Markdown structures (**Character Sheet**, **Lorebook**, and **Master Journal**) included in the system prompt.
- **Sliding Dialogue Window**: Only the most immediate conversational exchanges (**last 10 messages**) are sent alongside the structured state.
- **Asynchronous Periodic Distillation**: Every 5 Master turns, an automated background process evaluates the recent 25 dialogue turns and compresses new plot developments, NPC relationships, and discovered lore directly into the Lorebook and Master Journal. If no new facts emerge, it yields `NO_CHANGES` to save writes.

#### 💡 The Result:
The active context footprint remains **virtually flat throughout a 100+ turn campaign** (typically staying between **2,000 and 4,000 tokens**). This brings two huge benefits:
- **🏡 Local & On-Premise LLM Friendly**: Allows you to run extensive, coherent solo RPG campaigns using lightweight open-source models (e.g. Gemma 2 9B, Llama 3.1 8B, Mistral 7B) on consumer GPUs or laptops via **Ollama**, **LM Studio**, or **vLLM** without running out of VRAM or hitting context degradation limits.
- **💰 Extreme Cost Efficiency**: Keeps token consumption minimal on commercial endpoints (Gemini, OpenRouter, OpenAI), preventing ballooning API bills during long gaming sessions.

---

## 🔒 Privacy & Infrastructure

- **Zero-Backend & Serverless**: Hosted statically via GitHub Pages with client-side IndexedDB (`idb-keyval`) and LocalStorage. No intermediary servers, no telemetry, and zero hosting overhead.
- **Direct Client-to-API**: All network calls connect directly from your browser to your chosen LLM endpoint. API keys and story data never touch any third-party backend.
- **Full Data Portability**: Complete database export and import as plain `.json` files, allowing offline backups and effortless migration between devices.

---

## 🔑 Multi-Provider & Bring Your Own Key

OmniTale features a modular plugin architecture supporting direct integration with your preferred LLM host:

- **🌐 Google Gemini (Native)**: Direct connection to Google Generative Language API (`generativelanguage.googleapis.com`) using `gemini-flash-latest`, `gemini-2.5-flash`, or custom Gemini models.
- **⚡ OpenRouter**: Out-of-the-box support for hundreds of open-source and proprietary models (e.g., `google/gemma-2-9b-it:free`, `meta-llama/llama-3.1-70b-instruct`, etc.).
- **💻 OpenAI & Local Inference (Ollama, LM Studio, vLLM)**: Fully configurable custom endpoint URL (e.g., `http://localhost:11434/v1` for Ollama or `http://localhost:1234/v1` for LM Studio) with custom model strings and API keys.

---

## 🌐 Multilingual & One-Click AI Translation

OmniTale combines dynamic prompt adaptation with built-in translation utilities:
- **Zero-Config Natural Adaptation**: The AI Game Master dynamically matches the language of your input on the fly. Start in Italian, switch to English, or instruct in German without changing configuration files.
- **Language Selector & AI Campaign Translator**: Choose your preferred language preset (English, Italian, Spanish, French, German, Portuguese, Japanese, Chinese) and automatically translate entire campaign templates into your language using the integrated LLM translation engine.

---

## 🚀 Getting Started

### Local Development Setup

Standard local desktop development is straightforward.

**Prerequisites**
Ensure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed on your machine.

**Installation & Development**

1. Clone this repository:
   ```bash
   git clone https://github.com/mceleri/OmniTale.git
   cd OmniTale
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` (configured with host `0.0.0.0` for local network access).

### Production Build

To compile the production-ready bundle:
```bash
npm run build
```
The optimized static application will be generated inside the `/dist` directory.

---

## 🎮 How to Play

1. **🚀 Launch**: Open [OmniTale in your browser](https://mceleri.github.io/OmniTale/) or start your local server.
2. **⚙️ Configure Provider**: Click the **Settings (gear icon)** in the top-right corner. Select your provider (**OpenRouter**, **Gemini**, or **OpenAI/Local**), enter your API Key, and set your desired Model Name.
3. **🗺️ Choose or Build a Campaign**:
   - Pick one of the bundled campaign templates (Cyberpunk, Fantasy, etc.) or click **New Adventure** to access the 5-tab Worldbuilding Canvas.
   - Adjust the **Campaign Stochastic Matrix** (or leave it random for emergent surprises).
   - Set your **Starting Intent** and click **Start Journey**.
4. **🎭 Play & Interact**:
   - Type your actions, dialogue, or character intentions into the input bar at the bottom (`Ctrl+Enter` to send).
   - Switch your **Narrator Style** (⚡ Cinematic, ⚖️ Balanced, 📖 Literary) at any time.
   - Use the **Edit** and **Regenerate** buttons on chat messages to steer the story.
5. **📑 Manage Dynamic Drawers**:
   - Access your **Character Sheet** (👤), **Lorebook** (📖), **AI Master Journal** (👁️), or send **Secret GM Directives** (💬) using the quick-access drawer buttons.
6. **📊 Monitor Stats**: Check the **Analytics View** from the home screen to inspect real-time token usage, context health, and story metrics.
