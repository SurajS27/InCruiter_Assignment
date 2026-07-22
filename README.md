# Interview Integrity Platform (Phase 1, 2, 3, 4, & 5)

A high-fidelity, production-quality interview platform foundation, browser telemetry SDK, vision analytics pipeline, speech activity analytics engine, and evidence fusion layer. This codebase acts as the user experience and telemetry baseline, built specifically to allow future integration of biometric and activity verification modules without requiring structural refactoring.

---

## Project
The Interview Integrity Platform is designed to mimic a professional, HackerRank + Zoom-style web workspace. In Phase 1 to 5, we have constructed:
- Core live interview workspace (question card, timer, webcam, and scratchpad).
- Multi-store Zustand state layout and abstract browser API services.
- Independent telemetry event collectors (visibility, window focus, keyboard activity, clipboard, mouse, network).
- Unified vision analytics pipeline utilizing the latest MediaPipe Tasks Vision Face Landmarker API.
- Reusable vision extractors computing Yaw, Pitch, Roll (Head Pose), eye gaze vectors, EAR blink analytics, and face presence thresholds.
- Audio analytics platform processing microphone streams locally via Web Audio API.
- Reusable audio extractors measuring RMS levels, speech onset/hangover indicators, silence timings, response latency, and hardware mute statuses.
- **Evidence Fusion Reasoning Layer** subscribing to the global Event Bus. Correlates all low-level telemetry, vision, and audio events within a rolling 30-second window, evaluates independent rules, deduplicates ongoing events, and generates human-readable Evidence observations.
- Resizable, collapsible `TelemetryConsole`, `VisionConsole`, `AudioConsole`, and `EvidenceConsole` debug windows (visible only in development) supporting real-time event logs streams and exports.

---

## Architecture
The system employs strict separation of concerns and dependency inversion:
1. **Component Layer**: Renders UI states and handles user inputs.
2. **Hook Layer**: Exposes reusable logic (e.g. `useCamera`, `useMicrophone`, `useBrowserTelemetry`, `useVisionLifecycle`, `useAudioLifecycle`, `useEvidence`) without invoking browser APIs directly.
3. **Service Layer**: Decouples the frontend from global browser APIs (WebRTC, MediaPipe, Web Audio API, Visibility API).
4. **Zustand State Store**: Segmented into focused units (settings, questions, permissions, session, telemetry, vision, audio, evidence) to optimize rendering performance.
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
│   ├── telemetry/            # Browser collectors, normalizers, console
│   ├── vision/               # Camera processors, feature extractors, landmarker integration
│   ├── audio/                # Audio frame processors, speech extractors, microphone state
│   └── evidence/             # Correlator, builder, rules, deduplicator, store, console
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
- [x] Reusable local speech analytics engine using Web Audio API and AnalyserNode.
- [x] Independent silence detectors, speaking duration monitors, and response delay gauges.
- [x] Evidence Fusion reasoning platform correlating low-level events over a rolling 30-second context window.
- [x] Deduplication and state-change lifecycle rules for explainable Evidence observations.
- [x] Resizable, collapsible development-mode Evidence Console.
- [x] Clean compilation: Passed typechecks (`npm run build`) and lint verification (`npm run lint`).

---

## Roadmap
- **Phase 6 (Risk Engine)**: Fuse events into suspicious flags alerts.
- **Phase 7 (Reviewer Dashboard)**: Display explainable evidence timeline maps.

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
