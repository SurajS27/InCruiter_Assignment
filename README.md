# Interview Integrity Platform (Phase 1, 2, & 3)

A high-fidelity, production-quality interview platform foundation, browser telemetry SDK, and vision analytics pipeline. This codebase acts as the user experience and telemetry baseline, built specifically to allow future integration of biometric and activity verification modules without requiring structural refactoring.

---

## Project
The Interview Integrity Platform is designed to mimic a professional, HackerRank + Zoom-style web workspace. In Phase 1, 2, and 3, we have constructed:
- Core live interview workspace (question card, timer, webcam, and scratchpad).
- Multi-store Zustand state layout and abstract browser API services.
- Independent telemetry event collectors (visibility, window focus, keyboard activity, clipboard, mouse, network).
- Unified vision analytics pipeline utilizing the latest MediaPipe Tasks Vision Face Landmarker API.
- Reusable vision extractors computing Yaw, Pitch, Roll (Head Pose), eye gaze vectors (Looking Left/Right/Up/Down/Center), EAR blink analytics, and face presence thresholds.
- Resizable, collapsible `TelemetryConsole` and `VisionConsole` debug windows (visible only in development) supporting real-time event logs streams and exports.

---

## Architecture
The system employs strict separation of concerns and dependency inversion:
1. **Component Layer**: Renders UI states and handles user inputs.
2. **Hook Layer**: Exposes reusable logic (e.g. `useCamera`, `useMicrophone`, `useBrowserTelemetry`, `useVisionLifecycle`) without invoking browser APIs directly.
3. **Service Layer**: Decouples the frontend from global browser APIs (WebRTC, MediaPipe, Visibility API).
4. **Zustand State Store**: Segmented into focused units (settings, questions, permissions, session, telemetry, vision) to optimize rendering performance.
5. **Event Engine**: An in-memory event bus tracks candidate events to enable review playback.

---

## Folder Structure
The workspace follows a feature-first architecture layout:
```
frontend/
├── app/                      # Next.js App Router Page views
│   ├── page.tsx              # SaaS Landing Page
│   ├── interview/            # Live Interview Room
│   └── settings/             # Environment Configuration page
├── features/                 # Modular Domain Features
│   ├── interview/            # Camera preview, scratchpad, questions
│   ├── permissions/          # Hardware pre-screen dialogs
│   ├── settings/             # Settings dialog controllers
│   ├── telemetry/            # Browser signal collectors, normalizers, console
│   └── vision/               # Camera processors, feature extractors, landmarker integration
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
- [x] Resizable, collapsible development-mode Telemetry Console with search and filter parameters.
- [x] Reusable vision analytics engine with MediaPipe Face Landmarker.
- [x] Independent head pose, eye gaze, blink detection, and face presence extractors.
- [x] Floating development-mode Vision Console for real-time measurement tracking.
- [x] Clean compilation: Passed typechecks (`npm run build`) and lint verification (`npm run lint`).

---

## Roadmap
- **Phase 4 (Audio)**: Audio frequency vocal analysis via Web Audio API analyzer nodes in `MicrophoneService`.
- **Phase 5 (Timeline)**: Add a telemetry replay timeline chart to the reviewer console to reconstruct candidate actions matched with recorded video clips.

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
