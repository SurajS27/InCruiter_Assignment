# Interview Integrity Platform (Phase 1)

A high-fidelity, production-quality interview platform foundation. Architected for clean Separation of Concerns, incorporating in-memory telemetry Event Bus logging, modular Zustand stores, and hardware service layers. Ready for integration of downstream risk and validation modules.

## Architecture Highlights
- **Service Abstraction**: Hardware and persistent APIs are isolated behind independent TypeScript services (`camera.service.ts`, `storage.service.ts`).
- **Telemetry Event Engine**: Key candidate interactions and system environment changes write log nodes directly to an in-memory `EventBus`.
- **Modular Stores**: Multiple focused Zustand stores prevent excessive UI re-renders.
- **Glassmorphism Visual Theme**: High-fidelity interface supporting Dark and Light theme states, fluid Framer Motion transitions, and fully responsive layouts.

## Directory Map
- `/frontend`: Next.js 15 app, features, shared structures, custom hooks, and zustand stores.
- `/docs`: Architecture, folder-structure, and integration roadmap details.

## Quick Start
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
