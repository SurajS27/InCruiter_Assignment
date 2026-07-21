import { create } from 'zustand';
import {
  AudioStatistics,
  AudioEvent,
  MicrophoneMeasurement,
} from '../features/audio/types/audio';

interface AudioStoreState {
  currentAudioLevel: number;
  speakingState: boolean;
  speechConfidence: number;
  speakingDuration: number;
  silenceDuration: number;
  longestSilence: number;
  averageResponseDelay: number;
  microphoneState: MicrophoneMeasurement;
  statistics: AudioStatistics;
  lastEvent: AudioEvent | null;
  events: AudioEvent[];
  audioRunning: boolean;
  initError: string | null;

  setAudioRunning: (running: boolean) => void;
  setInitError: (error: string | null) => void;
  addAudioEvent: (event: AudioEvent) => void;
  updateAudioLevel: (level: number, peak: number) => void;
  updateSpeechState: (speaking: boolean, confidence: number) => void;
  updateSilenceDuration: (current: number, longest: number) => void;
  updateSpeakingDuration: (duration: number) => void;
  updateResponseDelay: (delay: number) => void;
  updateMicrophoneState: (state: MicrophoneMeasurement) => void;
  updateStatistics: (updater: (stats: AudioStatistics) => Partial<AudioStatistics>) => void;
  clearAudioEvents: () => void;
  incrementSessionDuration: () => void;
}

const initialStatistics: AudioStatistics = {
  speakingTime: 0,
  silenceTime: 0,
  speechBurstCount: 0,
  longestSilence: 0,
  averageResponseDelay: 0,
  averageAudioLevel: 0,
  peakAudioLevel: 0,
  microphoneDisconnectCount: 0,
  framesProcessed: 0,
  framesSkipped: 0,
  sessionDuration: 0,
};

const initialMicrophoneState: MicrophoneMeasurement = {
  connected: true,
  muted: false,
  confidence: 1.0,
};

export const useAudioStore = create<AudioStoreState>((set) => ({
  currentAudioLevel: 0,
  speakingState: false,
  speechConfidence: 1.0,
  speakingDuration: 0,
  silenceDuration: 0,
  longestSilence: 0,
  averageResponseDelay: 0,
  microphoneState: initialMicrophoneState,
  statistics: initialStatistics,
  lastEvent: null,
  events: [],
  audioRunning: false,
  initError: null,

  setAudioRunning: (running) => set({ audioRunning: running }),
  setInitError: (error) => set({ initError: error }),

  addAudioEvent: (event) =>
    set((state) => {
      // Circular buffer (max 500)
      const newEvents = [...state.events, event];
      if (newEvents.length > 500) {
        newEvents.shift();
      }

      // Update counters based on event type
      const stats = { ...state.statistics };
      if (event.type === 'SPEECH_STARTED') {
        stats.speechBurstCount += 1;
      } else if (event.type === 'LONG_SILENCE') {
        stats.longestSilence = Math.max(stats.longestSilence, event.payload.duration || 0);
      } else if (event.type === 'RESPONSE_DELAY_UPDATED') {
        stats.averageResponseDelay = event.payload.averageDelay || event.payload.delay || 0;
      } else if (event.type === 'MICROPHONE_DISCONNECTED') {
        stats.microphoneDisconnectCount += 1;
      }

      return {
        events: newEvents,
        lastEvent: event,
        statistics: stats,
      };
    }),

  updateAudioLevel: (level, peak) =>
    set((state) => {
      const stats = { ...state.statistics };
      stats.peakAudioLevel = Math.max(stats.peakAudioLevel, peak);
      
      const processed = stats.framesProcessed || 1;
      stats.averageAudioLevel = Math.round(((stats.averageAudioLevel * (processed - 1) + level) / processed) * 10) / 10;

      return {
        currentAudioLevel: level,
        statistics: stats,
      };
    }),

  updateSpeechState: (speaking, confidence) =>
    set((state) => {
      const stats = { ...state.statistics };
      if (speaking) {
        // Ticks speaking time
        stats.speakingTime += 1;
      } else {
        // Ticks silence time
        stats.silenceTime += 1;
      }

      return {
        speakingState: speaking,
        speechConfidence: confidence,
        statistics: stats,
      };
    }),

  updateSilenceDuration: (current, longest) =>
    set((state) => ({
      silenceDuration: current,
      longestSilence: longest,
      statistics: {
        ...state.statistics,
        longestSilence: longest,
      },
    })),

  updateSpeakingDuration: (duration) => set({ speakingDuration: duration }),

  updateResponseDelay: (delay) =>
    set((state) => ({
      averageResponseDelay: delay,
      statistics: {
        ...state.statistics,
        averageResponseDelay: delay,
      },
    })),

  updateMicrophoneState: (micState) =>
    set((state) => ({
      microphoneState: micState,
      statistics: {
        ...state.statistics,
        microphoneDisconnectCount: !micState.connected
          ? state.statistics.microphoneDisconnectCount + 1
          : state.statistics.microphoneDisconnectCount,
      },
    })),

  updateStatistics: (updater) =>
    set((state) => ({
      statistics: {
        ...state.statistics,
        ...updater(state.statistics),
      },
    })),

  clearAudioEvents: () =>
    set({
      currentAudioLevel: 0,
      speakingState: false,
      speechConfidence: 1.0,
      speakingDuration: 0,
      silenceDuration: 0,
      longestSilence: 0,
      averageResponseDelay: 0,
      microphoneState: initialMicrophoneState,
      events: [],
      lastEvent: null,
      statistics: { ...initialStatistics },
    }),

  incrementSessionDuration: () =>
    set((state) => ({
      statistics: {
        ...state.statistics,
        sessionDuration: state.statistics.sessionDuration + 1,
      },
    })),
}));

export default useAudioStore;
