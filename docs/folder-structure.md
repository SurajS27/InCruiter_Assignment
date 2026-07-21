# Folder Structure Documentation

Below is the directory mapping of the Interview Experience Foundation frontend:

```
frontend/
│
├── app/                      # Next.js App Router Pages
│   ├── page.tsx              # Landing Page
│   ├── interview/            # Live Interview Room View
│   │   └── page.tsx
│   ├── dashboard/            # Reviewer Console Mock
│   │   └── page.tsx
│   └── settings/             # Settings Page Mock
│       └── page.tsx
│
├── features/                 # Modular Domain Features
│   ├── interview/            # Core Interview View Components
│   │   └── components/       # CameraPreview, QuestionCard, NotesPanel, etc.
│   ├── permissions/          # Permission Request Dialogs
│   │   └── components/
│   └── settings/             # Environment Settings Dialog
│       └── components/
│
├── shared/                   # Common Shared Assets
│   ├── components/           # TopNavbar, BottomStatusBar, InterviewLayout
│   ├── hooks/                # useCamera, useMicrophone, useClock, etc.
│   └── ui/                   # shadcn base primitives (button, dialog, switch)
│
├── services/                 # Abstraction Layer for Hardware & Browser APIs
│   ├── camera.service.ts
│   ├── microphone.service.ts
│   ├── permission.service.ts
│   ├── storage.service.ts
│   └── event.service.ts
│
├── store/                    # Segmented Zustand State Management
│   ├── useInterviewStore.ts
│   ├── usePermissionStore.ts
│   ├── useQuestionStore.ts
│   └── useSettingsStore.ts
│
├── events/                   # Telemetry In-Memory Event Engine
│   ├── eventBus.ts
│   ├── logger.ts
│   └── types.ts
│
├── types/                    # Common Domain Models
│   ├── interview.ts
│   ├── event.ts
│   └── ...
│
└── constants/                # Project Configuration & Engineering Questions
    ├── questions.ts
    └── ...
```
