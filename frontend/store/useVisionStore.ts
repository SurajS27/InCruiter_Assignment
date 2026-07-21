import { create } from 'zustand';
import {
  HeadPoseMeasurement,
  EyeGazeMeasurement,
  BlinkMeasurement,
  VisionStatistics,
  VisionEvent,
} from '../features/vision/types/vision';

interface VisionStoreState {
  latestHeadPose: HeadPoseMeasurement | null;
  latestGazeDirection: EyeGazeMeasurement | null;
  latestBlinkRate: BlinkMeasurement | null;
  trackingConfidence: number;
  faceCount: number;
  facePresent: boolean;
  statistics: VisionStatistics;
  lastEvent: VisionEvent | null;
  events: VisionEvent[];
  visionRunning: boolean;
  initError: string | null;

  setVisionRunning: (running: boolean) => void;
  setInitError: (error: string | null) => void;
  addVisionEvent: (event: VisionEvent) => void;
  updateHeadPose: (pose: HeadPoseMeasurement) => void;
  updateGazeDirection: (gaze: EyeGazeMeasurement) => void;
  updateBlinkRate: (blink: BlinkMeasurement) => void;
  updateFaceTracking: (count: number, confidence: number) => void;
  updateStatistics: (updater: (stats: VisionStatistics) => Partial<VisionStatistics>) => void;
  clearVisionEvents: () => void;
  incrementSessionDuration: () => void;
}

const initialStatistics: VisionStatistics = {
  framesReceived: 0,
  framesProcessed: 0,
  framesSkipped: 0,
  framesDropped: 0,
  averageFps: 0,
  averageProcessingTime: 0,
  trackingConfidence: 1,
  blinkCount: 0,
  faceLossCount: 0,
  multipleFaceCount: 0,
  headPoseUpdates: 0,
  gazeUpdates: 0,
  sessionDuration: 0,
};

export const useVisionStore = create<VisionStoreState>((set) => ({
  latestHeadPose: null,
  latestGazeDirection: null,
  latestBlinkRate: null,
  trackingConfidence: 1,
  faceCount: 0,
  facePresent: false,
  statistics: initialStatistics,
  lastEvent: null,
  events: [],
  visionRunning: false,
  initError: null,

  setVisionRunning: (running) => set({ visionRunning: running }),
  setInitError: (error) => set({ initError: error }),

  addVisionEvent: (event) =>
    set((state) => {
      // Circular buffer (max 500)
      const newEvents = [...state.events, event];
      if (newEvents.length > 500) {
        newEvents.shift();
      }

      // Update counters based on event type
      const stats = { ...state.statistics };
      if (event.type === 'FACE_DETECTED') {
        stats.faceLossCount = Math.max(0, stats.faceLossCount - 1);
      } else if (event.type === 'FACE_LOST') {
        stats.faceLossCount += 1;
      } else if (event.type === 'MULTIPLE_FACES') {
        stats.multipleFaceCount += 1;
      } else if (event.type === 'HEAD_POSE_UPDATED') {
        stats.headPoseUpdates += 1;
      } else if (event.type === 'GAZE_DIRECTION_UPDATED') {
        stats.gazeUpdates += 1;
      } else if (event.type === 'BLINK_DETECTED') {
        stats.blinkCount += 1;
      }

      return {
        events: newEvents,
        lastEvent: event,
        statistics: stats,
      };
    }),

  updateHeadPose: (pose) => set({ latestHeadPose: pose }),
  updateGazeDirection: (gaze) => set({ latestGazeDirection: gaze }),
  updateBlinkRate: (blink) => set({ latestBlinkRate: blink }),

  updateFaceTracking: (count, confidence) =>
    set((state) => ({
      faceCount: count,
      facePresent: count > 0,
      trackingConfidence: confidence,
      statistics: {
        ...state.statistics,
        trackingConfidence: confidence,
      },
    })),

  updateStatistics: (updater) =>
    set((state) => ({
      statistics: {
        ...state.statistics,
        ...updater(state.statistics),
      },
    })),

  clearVisionEvents: () =>
    set({
      latestHeadPose: null,
      latestGazeDirection: null,
      latestBlinkRate: null,
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

export default useVisionStore;
