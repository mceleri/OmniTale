# Developer & Agent Guidelines (AGENTS.md)

Welcome to the OmniTale developer guidelines. This document outlines the project's architectural standards, directory structure, coding conventions, and workflows. All agents and human contributors must strictly adhere to these practices to maintain a readable, scalable, and robust codebase.

---

## 1. Architectural Principles

OmniTale is built on a modular, decoupled architecture prioritizing **Separation of Concerns (SoC)** and **Strict Type Safety**. The core codebase is partitioned into distinct layers to prevent monolithic "God Objects" and ensure that UI, business logic, prompts, and state management remain isolated.

### Layer Separation
- **UI Components (`/src/components`)**: Purely presentational or lightweight containers. They consume state from the store and dispatch actions but contain minimal business logic or network side effects.
- **State Management (`/src/store`)**: Powered by Zustand. It uses a **Slice Pattern** where state and actions are divided into domain-specific slices (UI, Settings, Story) and combined into a single store. Store actions must remain "dumb" (simple state setting), delegating asynchronous orchestration to services.
- **Services (`/src/services`)**: Pure business logic, network communication, and background orchestration. Services manage API interactions (e.g., with LLM providers) and coordinate asynchronous workflows.
- **Utilities (`/src/utils`)**: Stateless utility modules such as storage wrappers, schema validations, and prompt template builders.
- **Types (`/src/types`)**: Centralized TypeScript declarations to ensure single sources of truth for domain models.

---

## 2. File and Directory Structure

All new features and refactoring must align with the following directory structure:

```text
src/
├── components/          # React components (HomeView, StoryView, SettingsView, etc.)
├── services/            # Pure business logic and async orchestration
│   ├── llmService.ts        # Direct LLM connection and API clients
│   └── backgroundService.ts # Background tasks, concurrent execution, orchestrations
├── store/               # Zustand state management
│   ├── slices/              # Domain-specific store slices
│   │   ├── uiSlice.ts           # View states, navigation, layout controls
│   │   ├── settingsSlice.ts     # LLM configurations, user preferences
│   │   └── storySlice.ts        # Story data manipulation, message updates
│   └── useStoryStore.ts     # Main store composition via StateCreator pattern
├── types/               # Type declarations
│   └── story.ts             # Centralized models (Story, LoreBlock, StoryState, etc.)
└── utils/               # Auxiliary helper functions
    ├── prompts/             # System and narrative prompt templates
    │   └── storyPrompts.ts      # Prompt structures, templates, and text builders
    ├── storage/             # Persistence logic
    │   └── idbStorage.ts        # IndexedDB/storage adapter implementations
    └── validation.ts        # Schema and payload structural validations
```

---

## 3. Coding Conventions & Best Practices

### A. Zustand State Slices & Strict Typing
- **The Slice Pattern**: Utilize Zustand's `StateCreator<StoryState, ...>` pattern to compile slices. This enforces that every slice is fully aware of the global `StoryState` shape, promoting type-safe cross-slice interaction without circular imports.
- **No Implicit `any`**: Explicitly type all function parameters, return values, and state structures. Avoid using type assertions (`as any`) or bypassing compiler checks.
- **Asynchronous Flow Separation**: Keep Zustand store actions synchronous or simple. Do not embed complex network orchestrations, error handling, or side effects inside store actions. Instead:
  1. Call a dedicated service function (e.g., in `llmService.ts`).
  2. Perform async calls, error handling, and validations within the service.
  3. Dispatch clean, validated updates to the store via standard setter actions.

### B. "Fail-Fast" and Robust Error Handling
- **Explicit Configuration Validations**: Services must check for essential settings (e.g., LLM URLs, model configurations, API keys) prior to executing network requests. If any are missing, fail immediately and bubble a structured, localized error message up to the user interface.
- **Graceful UI Feedback**: Format system failures as clear, actionable messages using the specialized `system_feedback` role or distinct error boundaries rather than allowing silent background failures.
- **Loading State Safety**: Always wrap asynchronous operations inside `try/finally` blocks to guarantee that loading indicators (e.g., `isGeneratingStory`) are reset to `false` even if an exception occurs.

### C. Prompt Management
- Prompt templates are code assets and must not be hardcoded inside components or services.
- Define and export all prompt generation functions inside `/src/utils/prompts/storyPrompts.ts`.
- Ensure prompts accept strongly typed configurations to build prompt parameters dynamically.

### D. Data Validation & Persistence
- **Schema Protection**: Before importing external files or backup JSON configurations, validate the schema structure strictly within `/src/utils/validation.ts`. Clean or discard invalid nodes and raise explicit alerts if the payload is corrupted.
- **Isolated Storage Utilities**: Keep IndexedDB operations and localized caching isolated inside `/src/utils/storage/idbStorage.ts`.

### E. Resolution of Circular Dependencies
- Never import from `useStoryStore.ts` into utility files, types, or services.
- Components should only import domain interfaces directly from `/src/types/story.ts`.

---

## 4. Git & Workflow Guidelines

- **Branching Strategy**: Develop all features and refactoring tasks on localized, descriptive feature branches (e.g., `refactor/separation-of-concerns`).
- **Commit Messages**: Follow standard conventional commits guidelines (e.g., `refactor: implement modular store slices`, `feat: add schema validation for backup imports`).
- **Pull Requests**: Open structured Pull Requests mapping out the exact architectural modifications made and references to resolved issues.
