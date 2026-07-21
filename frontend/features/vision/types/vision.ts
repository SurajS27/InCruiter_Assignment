import { SeverityLevel } from '../../telemetry/types/telemetry';

export interface HeadPoseMeasurement {
  yaw: number;
  pitch: number;
  roll: number;
  confidence: number;
}

export interface EyeGazeMeasurement {
  direction: 'Left' | 'Right' | 'Up' | 'Down' | 'Center';
  confidence: number;
}

export interface BlinkMeasurement {
  isBlinking: boolean;
  duration: number;
  rate: number;
  confidence: number;
}

export interface FacePresenceMeasurement {
  faceCount: number;
  confidence: number;
}

export interface VisionStatistics {
  framesReceived: number;
  framesProcessed: number;
  framesSkipped: number;
  framesDropped: number;
  averageFps: number;
  averageProcessingTime: number;
  trackingConfidence: number;
  blinkCount: number;
  faceLossCount: number;
  multipleFaceCount: number;
  headPoseUpdates: number;
  gazeUpdates: number;
  sessionDuration: number;
}

export interface VisionEvent {
  version: number; // always 1
  id: string; // sequential string (e.g. evt_001201)
  timestamp: string;
  category: 'Vision';
  source: 'MediaPipe';
  type: string;
  severity: SeverityLevel;
  confidence: number;
  payload: Record<string, any>;
}
