# AI Agent Instructions for OmniTale (React/TypeScript Browser-Only)

## 🎯 Project Overview & Constraints
This is a strictly **Browser-Only** React application (no Node.js backend, no SSR, no Next.js API routes). 
All data persistence happens locally via IndexedDB (`idb-keyval`). 
All external communications are direct client-to-API calls (e.g., to LLM providers like OpenRouter/Gemini). 
Do NOT use or import Node built-ins (`fs`, `path`, `crypto`, etc.).

## 🏗️ Architectural Principles (Strict Adherence Required)

### 1. Separation of Concerns (SoC) & File Structure
We are actively refactoring away from "God Objects". Code must be strictly modularized into distinct layers:
* **Types (`/types`):** Interfaces and type aliases. No runtime code.
* **Services (`/services`):** Pure API network calls, LLM integrations, and complex business logic orchestrations.
* **State (`/store`):** Zustand stores. These should ONLY handle state mutations and derivations.
* **Storage (`/utils/storage`):** IndexedDB adapters and local storage logic.
* **Prompts (`/utils/prompts`):** Functions that format and return LLM prompt strings.

### 2. State Management (Zustand)
* **No God Objects:** Do not put everything in one massive store. Use the **Slice Pattern** to divide domains (e.g., `createStorySlice`, `createSettingsSlice`, `createUISlice`).
* **No Complex Side-Effects in Reducers:** Zustand `set` functions should be dumb. Extract complex asynchronous flows (like generating LLM responses + background updates) into standalone Service functions. The store should call the service, await the result, and then `set` the state.
* **Strict Typing:** Never use `(set: any, get: any)`. Always use Zustand's `StateCreator` type to ensure the state shape is strictly enforced by the compiler.

### 3. Error Handling & The "Fail-Fast" Principle
* **No Silent Fallbacks:** Never mask missing critical configurations with hardcoded defaults. If an LLM URL, Key, or Model Name is missing, fail immediately and throw an explicit error (e.g., "API Key is missing"). Do NOT default to arbitrary endpoints.
* **Explicit UI Feedback:** Errors must be caught and routed to the UI state so the user is informed (e.g., rendering an error message in the chat or a toast notification).

### 4. TypeScript Strictness
* **No `any`:** The use of `any` is strictly forbidden. Define clear interfaces for all data structures, API requests, and responses.
* **External Data Validation:** When importing data (e.g., importing a store backup JSON), do not blindly trust the payload. Validate the shape of the data before merging it into the application state.

### 5. Asynchronous Operations & Race Conditions
* When triggering background tasks (e.g., updating a lorebook in the background while the user continues chatting), ensure the state update mechanism is robust against race conditions. 
* Prefer immutable updates and ensure UI loading states (`isUpdatingLorebook`, `isGeneratingStory`) are accurately toggled via `try/finally` blocks.

## 🛠️ Coding Guidelines for Agents

* **Refactoring:** When asked to refactor, prioritize breaking large files into smaller, single-responsibility modules.
* **Imports:** Keep imports clean. Group external library imports first, followed by internal absolute/relative imports.
* **UI Components:** Keep React components focused on presentation. Move heavy logic to custom hooks (`hooks/`) or external utility functions.
* **Linting:** Write code that passes strict ESLint and TypeScript checks. 

**Remember:** Clean, maintainable, and predictable code is prioritized over clever one-liners. When in doubt, extract it into a separate, well-named function.
