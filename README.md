# Interview Integrity Platform (Phases 1 - 7)

A high-fidelity, production-quality interview platform foundation, browser telemetry SDK, vision analytics pipeline, speech activity analytics engine, evidence fusion layer, explainable risk scoring engine, and two-party collaboration system.

---

## Project
The Interview Integrity Platform is designed to mimic a professional, HackerRank + Zoom-style web workspace. Across all phases, we have constructed:
- Core live interview workspace (question card, timer, webcam, and scratchpad).
- Multi-store Zustand state layout and abstract browser API services.
- Independent telemetry event collectors (visibility, window focus, keyboard activity, clipboard, mouse, network).
- Unified vision analytics pipeline utilizing the latest MediaPipe Tasks Vision Face Landmarker API.
- Reusable vision extractors computing Head Pose, eye gaze, blink detection, and face presence.
- Audio analytics platform processing microphone streams locally via Web Audio API.
- Reusable audio extractors measuring RMS levels, silence, and response latency.
- Evidence Fusion reasoning platform correlating low-level events over a rolling 30-second context window.
- Explainable Risk Scoring Engine evaluating independent weighted rules to produce LOW/MODERATE/HIGH/CRITICAL trace assessments.
- **Two-Party Interview Collaboration Workspace** splitting pages into a minimal Candidate Interface and a rich Interviewer Workspace featuring dual webcam panels, question manager synchronization, manual scorecards, markdown scratchpads, and chronological session timelines.

---

## Folder Structure
The workspace follows a modular layout:
```
frontend/
├── app/                      # Next.js App Router Page views
│   ├── page.tsx              # Role Selector Gateway Home
│   ├── candidate/            # Minimal Candidate Session workspace
│   ├── interviewer/          # Professional Interviewer evaluation room
│   └── settings/             # Environment Configuration page
├── features/                 # Modular Domain Features
│   ├── interview/            # Camera preview, scratchpad, questions
│   ├── permissions/          # Hardware pre-screen dialogs
│   ├── settings/             # Settings dialog controllers
│   ├── telemetry/            # Browser collectors, normalizers, console
│   ├── vision/               # Camera processors, landmarker integration
│   ├── audio/                # Audio frame processors, speech extractors
│   ├── evidence/             # Correlator, store, console
│   ├── risk/                 # Coordinator, aggregator, store, console
│   └── interviewer/          # Question panels, scorecards, notes, stores
├── shared/                   # Shared layouts and hooks
├── services/                 # Hardware & Browser API Abstractions
├── store/                    # Segmented Zustand State Management
├── events/                   # Telemetry In-Memory Event Bus
└── types/                    # Common Domain models
```

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
   Go to [http://localhost:3000](http://localhost:3000) in your browser. Select a role and input the candidate name to test!
