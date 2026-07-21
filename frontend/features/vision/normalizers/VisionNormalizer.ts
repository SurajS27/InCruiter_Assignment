import { VisionEvent, HeadPoseMeasurement, EyeGazeMeasurement, BlinkMeasurement, FacePresenceMeasurement } from '../types/vision';
import { SeverityLevel } from '../../telemetry/types/telemetry';

let eventCounter = 0;

export function generateVisionEventId(): string {
  eventCounter++;
  return `evt_vis_${String(eventCounter).padStart(6, '0')}`; // Keep vis suffix to differentiate
}

export function resetVisionEventCounter(): void {
  eventCounter = 0;
}

export function normalizeFacePresence(raw: FacePresenceMeasurement, type: 'FACE_DETECTED' | 'FACE_LOST' | 'MULTIPLE_FACES' | 'LOW_TRACKING_CONFIDENCE'): VisionEvent {
  let severity: SeverityLevel = 'info';
  if (type === 'FACE_LOST') severity = 'warning';
  else if (type === 'MULTIPLE_FACES') severity = 'warning';
  else if (type === 'LOW_TRACKING_CONFIDENCE') severity = 'warning';

  return {
    version: 1,
    id: generateVisionEventId(),
    timestamp: new Date().toISOString(),
    category: 'Vision',
    source: 'MediaPipe',
    type,
    severity,
    confidence: raw.confidence,
    payload: { faceCount: raw.faceCount },
  };
}

export function normalizeHeadPose(raw: HeadPoseMeasurement): VisionEvent {
  return {
    version: 1,
    id: generateVisionEventId(),
    timestamp: new Date().toISOString(),
    category: 'Vision',
    source: 'MediaPipe',
    type: 'HEAD_POSE_UPDATED',
    severity: 'info',
    confidence: raw.confidence,
    payload: { yaw: raw.yaw, pitch: raw.pitch, roll: raw.roll },
  };
}

export function normalizeEyeGaze(raw: EyeGazeMeasurement): VisionEvent {
  // Suspect look away directions
  const isLookAway = raw.direction !== 'Center';
  const severity: SeverityLevel = isLookAway ? 'warning' : 'info';

  return {
    version: 1,
    id: generateVisionEventId(),
    timestamp: new Date().toISOString(),
    category: 'Vision',
    source: 'MediaPipe',
    type: 'GAZE_DIRECTION_UPDATED',
    severity,
    confidence: raw.confidence,
    payload: { direction: raw.direction },
  };
}

export function normalizeBlink(raw: BlinkMeasurement): VisionEvent {
  return {
    version: 1,
    id: generateVisionEventId(),
    timestamp: new Date().toISOString(),
    category: 'Vision',
    source: 'MediaPipe',
    type: 'BLINK_DETECTED',
    severity: 'info',
    confidence: raw.confidence,
    payload: { duration: raw.duration, rate: raw.rate },
  };
}

export function normalizeFrameProcessed(latency: number, success: boolean): VisionEvent {
  return {
    version: 1,
    id: generateVisionEventId(),
    timestamp: new Date().toISOString(),
    category: 'Vision',
    source: 'MediaPipe',
    type: success ? 'VISION_FRAME_PROCESSED' : 'FRAME_DROPPED',
    severity: success ? 'info' : 'warning',
    confidence: 1,
    payload: { latencyMs: latency },
  };
}
