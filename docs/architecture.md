# Architecture Documentation

This document describes the architectural principles, patterns, and boundaries guiding the Interview Integrity Platform (Phase 1).

## Principles

1. **Separation of Concerns (SoC)**
   - Components only render view states and handle interaction logic.
   - Core states are managed by Zustand stores.
   - Hardware interfaces and persistent operations are encapsulated in standard TypeScript services.
   - Reusable hooks connect components to services and stores.

2. **SOLID Principles**
   - **Single Responsibility**: Each store, service, and hook manages exactly one functional area.
   - **Dependency Inversion**: Components and hooks depend on service abstractions (`cameraService`, `permissionService`) rather than interacting directly with window/navigator browser APIs.

3. **Feature-First Organization**
   - Functional slices (interview experience, settings, permissions) reside in the `features/` directory containing dedicated components and types.
   - Common utilities, layouts, and hooks reside in `shared/`.

---

## Technical Flow & Sequence

```
[Component View]
       ↓
    [Hooks]
       ↓
   [Services]  ⇄  [Zustand Stores]
       ↓
 [Browser APIs]
```

- **Example Flow: Camera Stream Init**
  1. `CameraPreview` mounts and calls `useCamera()`.
  2. `useCamera` calls `cameraService.getCameraStream()` to fetch the track.
  3. On success, `useCamera` updates `usePermissionStore` and stores the active stream.
  4. The stream is bound to the video element.

---

## Event Bus Telemetry Engine

Every critical state mutation emits a decoupled event to the `EventBus` singleton.
- **Timeline replay capability**: Events are accumulated in memory. Reviewers can replay candidate activity (e.g. settings changed, questions loaded, focus lost) sequentially.
- **Anomaly triggers**: Future phases can listen to `EventBus` signals directly and feed them to the risk score engine.
