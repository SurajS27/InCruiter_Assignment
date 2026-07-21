import { TelemetryEvent, SeverityLevel } from '../types/telemetry';
import { RawVisibilityEvent } from '../collectors/VisibilityCollector';
import { RawFocusEvent } from '../collectors/FocusCollector';
import { RawWindowEvent } from '../collectors/WindowCollector';
import { RawNetworkEvent } from '../collectors/NetworkCollector';
import { RawKeyboardEvent } from '../collectors/KeyboardCollector';
import { RawClipboardEvent } from '../collectors/ClipboardCollector';
import { RawMouseEvent } from '../collectors/MouseCollector';

let eventCounter = 0;

export function generateSequentialId(): string {
  eventCounter++;
  return `evt_${String(eventCounter).padStart(6, '0')}`;
}

export function resetEventCounter(): void {
  eventCounter = 0;
}

export function normalizeVisibility(raw: RawVisibilityEvent): TelemetryEvent {
  const type = raw.state === 'visible' ? 'TAB_VISIBLE' : 'TAB_HIDDEN';
  const severity: SeverityLevel = raw.state === 'visible' ? 'info' : 'warning';

  return {
    id: generateSequentialId(),
    timestamp: new Date(raw.timestamp).toISOString(),
    category: 'Visibility',
    source: 'BrowserTelemetry',
    type,
    severity,
    payload: { state: raw.state },
  };
}

export function normalizeFocus(raw: RawFocusEvent): TelemetryEvent {
  const type = raw.type === 'focus' ? 'WINDOW_FOCUS' : 'WINDOW_BLUR';
  const severity: SeverityLevel = raw.type === 'focus' ? 'info' : 'warning';

  return {
    id: generateSequentialId(),
    timestamp: new Date(raw.timestamp).toISOString(),
    category: 'Browser',
    source: 'BrowserTelemetry',
    type,
    severity,
    payload: { state: raw.type },
  };
}

export function normalizeWindow(raw: RawWindowEvent): TelemetryEvent {
  let type = '';
  let severity: SeverityLevel = 'info';
  let payload: Record<string, any> = {};

  if (raw.type === 'resize') {
    type = 'WINDOW_RESIZED';
    payload = { width: raw.width, height: raw.height };
  } else if (raw.type === 'fullscreen') {
    type = raw.isFullscreen ? 'FULLSCREEN_ENTER' : 'FULLSCREEN_EXIT';
    severity = raw.isFullscreen ? 'info' : 'warning';
    payload = { isFullscreen: raw.isFullscreen };
  } else if (raw.type === 'orientation') {
    type = 'WINDOW_ORIENTATION_CHANGED';
    payload = { angle: raw.angle, orientationType: raw.typeStr };
  }

  return {
    id: generateSequentialId(),
    timestamp: new Date(raw.timestamp).toISOString(),
    category: 'Window',
    source: 'BrowserTelemetry',
    type,
    severity,
    payload,
  };
}

export function normalizeNetwork(raw: RawNetworkEvent): TelemetryEvent {
  const type = raw.type === 'online' ? 'NETWORK_ONLINE' : 'NETWORK_OFFLINE';
  const severity: SeverityLevel = raw.type === 'online' ? 'info' : 'error';

  return {
    id: generateSequentialId(),
    timestamp: new Date(raw.timestamp).toISOString(),
    category: 'Network',
    source: 'BrowserTelemetry',
    type,
    severity,
    payload: { online: raw.type === 'online' },
  };
}

export function normalizeKeyboard(raw: RawKeyboardEvent): TelemetryEvent {
  const payload = {
    eventType: raw.type,
    modifiers: {
      ctrl: raw.ctrlKey,
      alt: raw.altKey,
      shift: raw.shiftKey,
      meta: raw.metaKey,
    },
  };

  // Warning severity if user uses suspect system commands/shortcuts
  const hasModifiers = raw.ctrlKey || raw.metaKey || raw.altKey;
  const severity: SeverityLevel = hasModifiers ? 'warning' : 'info';

  return {
    id: generateSequentialId(),
    timestamp: new Date(raw.timestamp).toISOString(),
    category: 'Keyboard',
    source: 'BrowserTelemetry',
    type: 'KEYBOARD_ACTIVITY',
    severity,
    payload,
  };
}

export function normalizeClipboard(raw: RawClipboardEvent): TelemetryEvent {
  let type = '';
  if (raw.type === 'copy') type = 'COPY_EVENT';
  else if (raw.type === 'cut') type = 'CUT_EVENT';
  else if (raw.type === 'paste') type = 'PASTE_EVENT';

  return {
    id: generateSequentialId(),
    timestamp: new Date(raw.timestamp).toISOString(),
    category: 'Clipboard',
    source: 'BrowserTelemetry',
    type,
    severity: 'warning', // Clipboard activity is suspect in exam settings
    payload: { action: raw.type },
  };
}

export function normalizeMouse(raw: RawMouseEvent): TelemetryEvent {
  let type = '';
  let severity: SeverityLevel = 'info';

  if (raw.type === 'mouseenter') {
    type = 'MOUSE_ENTER';
  } else if (raw.type === 'mouseleave') {
    type = 'MOUSE_LEAVE';
    severity = 'warning'; // Cursor leaves exam window area
  } else if (raw.type === 'contextmenu') {
    type = 'RIGHT_CLICK';
    severity = 'warning';
  } else if (raw.type === 'pointerenter') {
    type = 'POINTER_ENTER';
  } else if (raw.type === 'pointerleave') {
    type = 'POINTER_LEAVE';
  }

  return {
    id: generateSequentialId(),
    timestamp: new Date(raw.timestamp).toISOString(),
    category: 'Mouse',
    source: 'BrowserTelemetry',
    type,
    severity,
    payload: { type: raw.type },
  };
}
