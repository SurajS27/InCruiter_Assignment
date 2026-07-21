# Integration Roadmap

This document maps the implementation roadmap for integrating downstream validation modules into this experience foundation.

## Phase 2: Biometric Telemetry
1. **MediaPipe FaceMesh & Eye Tracking**
   - Bind MediaPipe runtime model within the `CameraPreview` component stream track hook.
   - Emit `RISK_GAZE_DEVIATION` and `FACE_ANOMALY` events to the `EventBus` when gaze coordinates drift outside screen boundaries.
2. **Audio Voice Recognition**
   - Bind Web Audio API analyzer nodes inside `MicrophoneService`.
   - Dispatch `AUDIO_AMBIENT_VOICE_DETECTED` events to the EventBus on detection of secondary speech spectrum.

---

## Phase 3: Environment Lockdowns
1. **Focus Auditing**
   - Integrate page focus and blur event listener hooks into the core application state.
   - Dispatch `WINDOW_BLURRED` event payloads with tab tracking duration details.
2. **Reviewer Replay Console**
   - Expand the `/dashboard` to parse the JSON array of events emitted by the Event Bus, drawing risk flags on a timeline graph matching video playback offsets.
