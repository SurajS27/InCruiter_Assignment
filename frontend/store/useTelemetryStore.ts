import { create } from 'zustand';
import {
  TelemetryEvent,
  BrowserState,
  WindowState,
  VisibilityState,
  FocusState,
  NetworkState,
  ClipboardState,
  KeyboardActivity,
  MouseActivity,
  TelemetryStatistics,
} from '../features/telemetry/types/telemetry';

interface TelemetryStoreState {
  events: TelemetryEvent[];
  lastEvent: TelemetryEvent | null;
  browserState: BrowserState;
  windowState: WindowState;
  visibilityState: VisibilityState;
  focusState: FocusState;
  networkState: NetworkState;
  clipboardState: ClipboardState;
  keyboardActivity: KeyboardActivity;
  mouseActivity: MouseActivity;
  statistics: TelemetryStatistics;
  telemetryRunning: boolean;

  setTelemetryRunning: (running: boolean) => void;
  addTelemetryEvent: (event: TelemetryEvent) => void;
  clearEvents: () => void;
  updateWindowState: (width: number, height: number, isFullscreen: boolean) => void;
  updateVisibilityState: (visible: boolean, state: 'visible' | 'hidden') => void;
  updateFocusState: (focused: boolean) => void;
  updateNetworkState: (online: boolean) => void;
  updateClipboardState: (op: 'copy' | 'cut' | 'paste') => void;
  updateKeyboardActivity: (modifiers: { ctrl: boolean; alt: boolean; shift: boolean; meta: boolean }) => void;
  updateMouseActivity: (type: any) => void;
  incrementSessionDuration: () => void;
}

const initialStatistics: TelemetryStatistics = {
  totalEvents: 0,
  eventsPerSecond: 0,
  focusChanges: 0,
  visibilityChanges: 0,
  clipboardOperations: 0,
  keyboardActivityCount: 0,
  mouseActivityCount: 0,
  networkChanges: 0,
  windowResizeCount: 0,
  sessionDuration: 0,
};

export const useTelemetryStore = create<TelemetryStoreState>((set) => ({
  events: [],
  lastEvent: null,

  browserState: {
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
    language: typeof navigator !== 'undefined' ? navigator.language : 'en',
    cookieEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : false,
    pdfViewerEnabled: typeof navigator !== 'undefined' ? navigator.pdfViewerEnabled : false,
  },

  windowState: {
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 720,
    isFullscreen: typeof document !== 'undefined' ? !!document.fullscreenElement : false,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
  },

  visibilityState: {
    visible: typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
    state: typeof document !== 'undefined' && document.visibilityState === 'visible' ? 'visible' : 'hidden',
  },

  focusState: {
    focused: typeof document !== 'undefined' ? document.hasFocus() : true,
  },

  networkState: {
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  },

  clipboardState: {
    lastOperation: null,
    timestamp: null,
  },

  keyboardActivity: {
    lastEventTimestamp: null,
    modifierKeys: { ctrl: false, alt: false, shift: false, meta: false },
    typingFrequency: 0,
  },

  mouseActivity: {
    lastEvent: null,
    timestamp: null,
  },

  statistics: initialStatistics,
  telemetryRunning: false,

  setTelemetryRunning: (running) => set({ telemetryRunning: running }),

  addTelemetryEvent: (event) =>
    set((state) => {
      // Enforce 500 max circular buffer limit
      let newEvents = [...state.events, event];
      if (newEvents.length > 500) {
        newEvents.shift();
      }

      // Update statistics
      const stats = { ...state.statistics };
      stats.totalEvents += 1;

      if (event.category === 'Browser') {
        stats.focusChanges += 1;
      } else if (event.category === 'Visibility') {
        stats.visibilityChanges += 1;
      } else if (event.category === 'Clipboard') {
        stats.clipboardOperations += 1;
      } else if (event.category === 'Keyboard') {
        stats.keyboardActivityCount += 1;
      } else if (event.category === 'Mouse') {
        stats.mouseActivityCount += 1;
      } else if (event.category === 'Network') {
        stats.networkChanges += 1;
      } else if (event.type === 'WINDOW_RESIZED') {
        stats.windowResizeCount += 1;
      }

      // Quick estimate of EPS (events per second) based on events in the last 5 seconds
      const now = Date.now();
      const eventsInLast5Seconds = newEvents.filter(
        (e) => now - new Date(e.timestamp).getTime() < 5000
      ).length;
      stats.eventsPerSecond = Math.round((eventsInLast5Seconds / 5) * 10) / 10;

      return {
        events: newEvents,
        lastEvent: event,
        statistics: stats,
      };
    }),

  clearEvents: () => set({ events: [], lastEvent: null, statistics: { ...initialStatistics } }),

  updateWindowState: (width, height, isFullscreen) =>
    set((state) => ({
      windowState: {
        width,
        height,
        isFullscreen,
        devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      },
    })),

  updateVisibilityState: (visible, state) =>
    set({
      visibilityState: { visible, state },
    }),

  updateFocusState: (focused) => set({ focusState: { focused } }),

  updateNetworkState: (online) => set({ networkState: { online } }),

  updateClipboardState: (op) =>
    set({
      clipboardState: { lastOperation: op, timestamp: new Date().toISOString() },
    }),

  updateKeyboardActivity: (modifiers) =>
    set((state) => ({
      keyboardActivity: {
        lastEventTimestamp: new Date().toISOString(),
        modifierKeys: modifiers,
        typingFrequency: state.keyboardActivity.typingFrequency, // static frequency indicator
      },
    })),

  updateMouseActivity: (type) =>
    set({
      mouseActivity: { lastEvent: type, timestamp: new Date().toISOString() },
    }),

  incrementSessionDuration: () =>
    set((state) => ({
      statistics: {
        ...state.statistics,
        sessionDuration: state.statistics.sessionDuration + 1,
      },
    })),
}));

export default useTelemetryStore;
