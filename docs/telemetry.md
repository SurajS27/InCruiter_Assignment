# Telemetry Platform SDK & Signal Collection

This document describes the telemetry collection infrastructure built in Phase 2. The telemetry platform operates independently from the primary UI, acting as a modular background collector.

---

## Architecture Pipeline

```
[Browser API (DOM Event)]
           ↓
     [Collectors]        ← Listens to raw events (focus, visibilitychange, keydown, etc.)
           ↓
    [Normalizers]        ← Converts raw signals to normalized TelemetryEvents
           ↓
     [Event Bus]         ← Dispatches TelemetryEvents dynamically
           ↓
      [Recorder]         ← Listens to Event Bus and stores history in Zustand
           ↓
  [useTelemetryStore]    ← Holds statistics and last 500 events (Circular Buffer)
           ↓
   [TelemetryConsole]    ← Collapsible console to inspect logs and export JSON/CSV
```

---

## Collector Modularity

Each browser interface has a standalone collector class inside `features/telemetry/collectors/` that is completely decoupled:
- **VisibilityCollector**: Listens to `visibilitychange` for tab swaps.
- **FocusCollector**: Tracks window `focus` / `blur` status.
- **WindowCollector**: Listens to `resize` (throttled to 250ms), `fullscreenchange`, and `orientationchange`.
- **NetworkCollector**: Tracks browser online/offline status.
- **KeyboardCollector**: Detects Typing frequency and modifier key presses (CTRL, ALT, SHIFT, META).
- **ClipboardCollector**: Tracks copy, cut, and paste event logs.
- **MouseCollector**: Listens to hover mouseenter, mouseleave, contextmenu (right click).

---

## Privacy Policy Compliance

To ensure candidate privacy, the platform adheres to strict data restrictions:
1. **No Keystrokes Logging**: The `KeyboardCollector` only registers modifier key toggles and count triggers. Actual typed character inputs are never captured.
2. **No Clipboard Scrape**: The `ClipboardCollector` records only paste, cut, or copy operations. Clipboard content text is never parsed.
3. **No Coordinates Tracking**: The `MouseCollector` captures mouse activity metadata (like leaving the exam boundaries) but excludes exact (X, Y) cursor coordinate tracking.

---

## Event Model Schema

Every emitted event uses sequential string IDs (`evt_000001`, `evt_000002`...) for ordering logs, conforming to this structure:
```json
{
  "id": "evt_000012",
  "timestamp": "2026-07-21T16:47:00.000Z",
  "category": "Clipboard",
  "source": "BrowserTelemetry",
  "type": "PASTE_EVENT",
  "severity": "warning",
  "payload": {
    "action": "paste"
  }
}
```

---

## Telemetry Console & Exporter

In development mode, a collapsible `<TelemetryConsole />` overlay floats in the lower-right corner. It allows:
- Real-time observation of the stream with auto-scroll and stream pause capabilities.
- Searching logs and filtering by Severity, Category, and Event Source.
- Live system status display and session counters.
- Single-click local downloads of logs as **JSON** or **CSV** formats (no backend required).
