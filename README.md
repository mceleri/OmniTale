# OmniTale

An elegant, minimalist, and privacy-first solo text-based RPG interface powered by Large Language Models. 

OmniTale acts as a local visual layer and prompt engine for your AI Game Master, giving you complete control over your character sheets, lore codex, and master journals.

> 🚧 **Work in Progress**: This app is a passion project under active development, built for fun, exploration, and continuous improvement.

---

## Key Features

- **Worldbuilding Canvas**: Create custom campaign templates with dynamic world aspects (magic systems, factions, geography) before starting your journey.
- **Dynamic Character Dossier**: Keep track of attributes, inventory, and health inside an interactive, auto-saving character sheet.
- **Automated Codex (Lorebook)**: The AI Game Master analyzes your adventure periodically to automatically update key world facts and characters in Markdown.
- **AI Master Journal**: A secret log area containing NPC motivations, hidden threats, and plot secrets kept private from the main gameplay screen.
- **Secret GM Feedback**: Dynamically instruct the AI to adjust its tone, response lengths, descriptions, or combat pacing on the fly.
- **Clean Markdown Rendering**: Immersive typography support for quotes, bold, italics, headers, lists, inline code, and terminal-styled code blocks.

---

## 🔒 Privacy & Architecture

OmniTale is a **browser-only frontend application** (Single Page App) with zero server backends involved. 

- **Local Storage & Database**: Your story sessions, templates, logs, and notes are saved directly in your browser's local sandbox using IndexedDB.
- **Local API Connections**: Direct connections from your browser to your selected LLM endpoints.
- **No Data Harvesting**: Your API keys, settings, and story content are never sent to any third-party servers, excluding the LLM host itself.
- **Database Backups**: Full database export and import functionality to backup or migrate your games as simple `.json` files.

---

## 🔑 Bring Your Own API Key

To use OmniTale, you connect it to the LLM model of your choice:
- **Compatible with OpenRouter**: Fully compatible out-of-the-box with OpenRouter endpoints. Works with premium and free models alike, including lightweight models like **Gemma 4 31B** or similar.
- **Custom Local Endpoints**: Run local inference (e.g., using Ollama or LM Studio) and connect it using OpenAI-compatible URL schemas (like `http://localhost:11434/v1`).
- **Flexible Models**: Specify any API model string name (e.g., `google/gemini-2.5-flash`, `meta-llama/llama-3-8b-instruct:free`, etc.).

---

## 🌐 Auto-Multilingual

OmniTale's prompt engine automatically instructs the AI Game Master to match the language of your adventure:
- If your story Title & Synopsis are in Italian, the AI opens the scene in Italian.
- If you reply or instruct your character in Spanish or German, the AI immediately switches its response language on the fly.

---

## 🚀 Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) installed on your machine.

### Installation

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

1. **Configure API**: Click the **Settings (gear icon)** in the top-right corner of the Home screen. Enter your API Key, LLM URL (leave empty for OpenRouter default), and Model Name.
2. **Design a World**: Click **New Adventure** on the Home screen to open the Worldbuilding Canvas.
3. **Customize Templates**: Define your character's starting parameters and create setting aspects. You can either save it as a customizable campaign template or click **Start Journey** to begin playing immediately.
4. **Interact**: Type your actions or instructions to the GM in the text area at the bottom.
5. **Manage State**: Use the buttons above the chat input to toggle drawers and update your Character Sheet, Codex, or private AI Master notes as your adventure progresses.
