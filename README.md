# OmniTale

An elegant, minimalist, and privacy-first solo text-based RPG interface powered by Large Language Models. 

### 🧪 The "Extreme Vibe Coding" Experiment

This application started as a strict experiment in mobile-only development. The entire initial MVP—from architecture to deployment—was built exclusively from a smartphone using AI-assisted vibe coding. Today, OmniTale is a living project that I personally use and continuously improve. I've adopted a hybrid workflow: leveraging mobile vibe coding for quick prototyping and on-the-go feature ideation, while using desktop IDEs (like Antigravity) for deep code refactoring and architectural optimization. It’s an ongoing exploration of how AI radically accelerates full-stack development across all form factors.

### 🚀 [Play Now in Your Browser](https://mceleri.github.io/OmniTale/)

OmniTale acts as a local visual layer and prompt engine for your AI Game Master, giving you complete control over your character sheets, lore codex, and master journals.

> 🚧 **Work in Progress**: This app is a passion project under active development, built for fun, exploration, and continuous improvement.

---

## Key Features

- **📱 Smartphone-First Design**: Optimized from the ground up for mobile browsers with a compact, single-thumb layout and slide-up drawers, making it perfect for casual gaming on your phone.
- **Worldbuilding Canvas**: Create custom campaign templates with dynamic world aspects (magic systems, factions, geography) before starting your journey.
- **Dynamic Character Dossier**: Keep track of attributes, inventory, and health inside an interactive, auto-saving character sheet.
- **Automated Codex (Lorebook)**: The AI Game Master analyzes your adventure periodically to automatically update key world facts and characters in Markdown.
- **AI Master Journal**: A secret log area containing NPC motivations, hidden threats, and plot secrets kept private from the main gameplay screen.
- **Secret GM Feedback**: Dynamically instruct the AI to adjust its tone, response lengths, descriptions, or combat pacing on the fly.
- **Clean Markdown Rendering**: Immersive typography support for quotes, bold, italics, headers, lists, inline code, and terminal-styled code blocks.

---

## 🔒 Architecture & Privacy-First Design

OmniTale is designed as a **browser-only frontend application** (Single Page App) with a strict zero-backend philosophy, ensuring both maximum privacy for the user and extreme cost-efficiency.

- **Serverless & Zero-Cost Infrastructure**: By pairing GitHub Pages for static hosting with browser-native IndexedDB and LocalStorage for data persistence, the application completely eliminates the need for backend servers and cloud databases. This translates to zero hosting costs and infinite scalability.
- **Automated CI/CD Pipeline**: The project leverages GitHub Actions for seamless continuous integration and deployment. Every push to the main branch automatically triggers a build workflow, compiling the application and deploying the optimized `/dist` bundle directly to production.
- **Local Database & Storage**: All story sessions, campaign templates, logs, and notes are saved strictly in your browser's local sandbox. 
- **Direct LLM Connections**: The app establishes direct API connections from your client to your selected LLM endpoints. 
- **No Data Harvesting**: Your API keys, settings, and story content are never routed through or stored on any middleman servers. You only communicate with your chosen LLM provider.
- **Portable State**: Full database export and import functionality allows you to backup, restore, or migrate your entire game state as simple `.json` files.

---

## 🔑 Bring Your Own API Key

To use OmniTale, you connect it to the LLM model of your choice:
- **Compatible with OpenRouter**: Fully compatible out-of-the-box with OpenRouter endpoints. Works with premium and free models alike, including lightweight models like **Gemma 4 31B** or similar.
- **Custom Local Endpoints**: Run local inference (e.g., using Ollama or LM Studio) and connect it using OpenAI-compatible URL schemas (like `http://localhost:11434/v1`).
- **Flexible Models**: Specify any API model string name (e.g., `google/gemini-2.5-flash`, `meta-llama/llama-3-8b-instruct:free`, etc.).

---

## 🌐 Dynamic Auto-Multilingual (Zero-Config)

OmniTale showcases the flexibility of modern LLMs through dynamic, context-aware prompt engineering. Instead of relying on hardcoded language selectors or rigid localization files, the prompt engine instructs the AI Game Master to organically adapt to your input:

- **Context-Aware Initialization**: If your custom Campaign Title and Synopsis are written in Italian, the AI autonomously processes the context and generates the opening scene and initial lore in Italian.
- **Seamless On-the-Fly Transitions**: If you suddenly reply, instruct your character, or provide secret GM feedback in Spanish or German, the AI immediately detects the linguistic shift and matches your language in its next response.

This approach demonstrates a paradigm shift in UX design: replacing traditional, static UI localization with fluid, AI-driven contextual interaction.

---

## 🚀 Getting Started

> **My Hybrid Workflow**
> While OmniTale's initial MVP was strictly built on a smartphone via AI vibe coding, I now maintain the project using a hybrid development lifecycle. I push quick features and prompt updates on-the-go directly from my mobile browser, while utilizing desktop IDEs for deep code refactoring and architectural optimization.

### Local Desktop Setup

If you want to run the project locally, experiment with the code, or contribute (via Fork and Pull Request), standard desktop development is fully supported.

**Prerequisites**
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

**Installation & Development**

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/OmniTale.git
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
   Open your browser and navigate to `http://localhost:5173` (or the port specified in terminal).

### Production Build

To compile a production bundle:
```bash
npm run build
```
The static, single-page application will build inside the `/dist` directory.

---

## 🎮 How to Play

1. **Configure API**: Click the **Settings (gear icon)** in the top-right corner of the Home screen. Enter your API Key, LLM URL and Model Name.
> **OpenRouter Example**
> 
> LLM URL: https://openrouter.ai/api/v1/chat/completions
> 
> LLM KEY: yout key
> 
> Model Name: google/gemma-4-31b-it:free

2a. **Design a World...**: Click **New Adventure** on the Home screen to open the Worldbuilding Canvas.
2b. **... OR Customize a template**: Define your character's starting parameters and create setting aspects. You can either save it as a customizable campaign template or click **Start Journey** to begin playing immediately.
3. **Interact**: Type your actions or instructions to the GM in the text area at the bottom.
4. **Manage State**: Use the buttons above the chat input to toggle drawers and update your Character Sheet, Codex, or private AI Master notes as your adventure progresses.
