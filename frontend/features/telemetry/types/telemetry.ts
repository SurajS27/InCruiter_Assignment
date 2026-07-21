export type TelemetryCategory =
  | 'Browser'
  | 'Window'
  | 'Visibility'
  | 'Keyboard'
  | 'Clipboard'
  | 'Mouse'
  | 'Network'
  | 'System'
  | 'Interview';

export type TelemetrySource =
  | 'BrowserTelemetry'
  | 'Interview'
  | 'Camera'
  | 'MediaPipe'
  | 'Speech'
  | 'RiskEngine'
  | 'Dashboard'
  | 'System';

export type SeverityLevel = 'info' | 'warning' | 'error';

export interface TelemetryEvent {
  id: string; // Sequential ID (e.g. evt_000001)
  timestamp: string;
  category: TelemetryCategory;
  source: TelemetrySource;
  type: string;
  severity: SeverityLevel;
  payload: Record<string, any>;
}

export interface BrowserState {
  userAgent: string;
  language: string;
  cookieEnabled: boolean;
  pdfViewerEnabled: boolean;
}

export interface WindowState {
  width: number;
  height: number;
  isFullscreen: boolean;
  devicePixelRatio: number;
}

export interface VisibilityState {
  visible: boolean;
  state: 'visible' | 'hidden';
}

export interface FocusState {
  focused: boolean;
}

export interface NetworkState {
  online: boolean;
}

export interface ClipboardState {
  lastOperation: 'copy' | 'cut' | 'paste' | null;
  timestamp: string | null;
}

export interface KeyboardActivity {
  lastEventTimestamp: string | null;
  modifierKeys: {
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    meta: boolean;
  };
  typingFrequency: number; // events per second estimation
}

export interface MouseActivity {
  lastEvent: 'mouseenter' | 'mouseleave' | 'contextmenu' | 'pointerenter' | 'pointerleave' | null;
  timestamp: string | null;
}

export interface TelemetryStatistics {
  totalEvents: number;
  eventsPerSecond: number;
  focusChanges: number;
  visibilityChanges: number;
  clipboardOperations: number;
  keyboardActivityCount: number;
  mouseActivityCount: number;
  networkChanges: number;
  windowResizeCount: number;
  sessionDuration: number;
}
