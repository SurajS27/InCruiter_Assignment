# Interview Integrity Platform (Phase 1)

A high-fidelity, production-quality interview platform foundation. This codebase acts as the user experience and telemetry baseline, built specifically to allow future integration of biometric and activity verification modules without requiring structural refactoring.

---

## Project
The Interview Integrity Platform is designed to mimic a professional, HackerRank + Zoom-style web workspace. In this first phase, we have constructed the interview room experience, permission verification pre-screen, local scratchpad utilities, and an extensible, decoupled telemetry event logging system.

---

## Architecture
The system employs strict separation of concerns and dependency inversion:
1. **Component Layer**: Renders UI states and handles user inputs.
2. **Hook Layer**: Exposes reusable logic (e.g. `useCamera`, `useMicrophone`) without invoking browser APIs directly.
3. **Service Layer**: Decouples the frontend from global browser APIs (e.g. `navigator.mediaDevices`, `localStorage`).
4. **Zustand State Store**: Segmented into focused units (settings, questions, permissions, session) to optimize rendering performance.
5. **Event Engine**: An in-memory event bus tracks candidate telemetry (such as tab-blur/focus events and settings modifications) to enable review playback.

---

## Folder Structure
The workspace follows a feature-first architecture layout:
```
frontend/
├── app/                      # Next.js App Router Page views
│   ├── page.tsx              # SaaS Landing Page
│   ├── interview/            # Live Interview Room
│   ├── dashboard/            # Reviewer Console Mock
│   └── settings/             # Environment Configuration page
├── features/                 # Modular Domain Features
│   ├── interview/            # Camera preview, scratchpad, questions
│   ├── permissions/          # Hardware pre-screen dialogs
│   └── settings/             # Settings dialog controllers
├── shared/                   # Shared layouts and hooks
│   ├── components/           # TopNavbar, BottomStatusBar, Layout
│   └── hooks/                # useCamera, useMicrophone, useClock, useNetwork
├── services/                 # Hardware & Browser API Abstractions
├── store/                    # Segmented Zustand State Management
├── events/                   # Telemetry In-Memory Event Bus
├── types/                    # Common Domain models
└── constants/                # Engineering questions and config
```

---

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19 & TypeScript
- **Styling**: TailwindCSS & shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **Forms**: React Hook Form

---

## Current Progress
- [x] Extensible, decoupled component-hook-service architecture.
- [x] In-memory Event Bus capturing tab shifts, hardware statuses, and navigation.
- [x] WebRTC Video/Audio permission handles and elegant state recovery overlays.
- [x] Responsive layout with Light/Dark and animations toggles.
- [x] Clean compilation: Passed typechecks (`npm run build`) and lint verification (`npm run lint`).

---

## Roadmap
- **Phase 2**: Integrate MediaPipe FaceMesh & Eye Tracking landmarks directly into the `CameraPreview` component stream track hook.
- **Phase 3**: Audio frequency vocal analysis via Web Audio API analyzer nodes in `MicrophoneService`.
- **Phase 4**: Add a telemetry replay timeline chart to the `/dashboard` to reconstruct candidate actions matched with recorded video clips.

---

## How to Run

1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```
2. **Install project dependencies** (if not already installed):
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Run the local development server**:
   ```bash
   npm run dev
   ```
4. **Open the platform**:
   Go to [http://localhost:3000](http://localhost:3000) in your browser.

---

## Screenshots
*Screenshots demonstrating the high-fidelity UI layout will be placed in the `/docs/screenshots/` workspace.*

---

## Demo GIF
*A demo video walking through theme toggles, permission dialog prompts, and question navigation will be placed in `/docs/demo.gif`.*
