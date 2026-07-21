import { SeverityLevel } from '../../telemetry/types/telemetry';

export interface SpeechMeasurement {
  speaking: boolean;
  confidence: number;
}

export interface SilenceMeasurement {
  currentSilence: number;
  longestSilence: number;
  silenceDuration: number;
  confidence: number;
}

export interface LatencyMeasurement {
  responseDelay: number;
  confidence: number;
}

export interface AudioLevelMeasurement {
  averageLevel: number;
  peakLevel: number;
  levelCategory: 'LOW' | 'NORMAL' | 'HIGH';
  confidence: number;
}

export interface MicrophoneMeasurement {
  connected: boolean;
  muted: boolean;
  confidence: number;
}

export interface AudioStatistics {
  speakingTime: number;
  silenceTime: number;
  speechBurstCount: number;
  longestSilence: number;
  averageResponseDelay: number;
  averageAudioLevel: number;
  peakAudioLevel: number;
  microphoneDisconnectCount: number;
  framesProcessed: number;
  framesSkipped: number;
  sessionDuration: number;
}

export interface AudioEvent {
  version: number; // always 1
  id: string; // sequential string (e.g. evt_002451)
  timestamp: string;
  category: 'Audio';
  source: 'Microphone';
  type: string;
  severity: SeverityLevel;
  confidence: number;
  payload: Record<string, any>;
}
