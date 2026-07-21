import { AudioEvent, SpeechMeasurement, SilenceMeasurement, LatencyMeasurement, AudioLevelMeasurement, MicrophoneMeasurement } from '../types/audio';
import { SeverityLevel } from '../../telemetry/types/telemetry';

let eventCounter = 0;

export function generateAudioEventId(): string {
  eventCounter++;
  return `evt_aud_${String(eventCounter).padStart(6, '0')}`;
}

export function resetAudioEventCounter(): void {
  eventCounter = 0;
}

export function normalizeSpeech(raw: SpeechMeasurement, type: 'SPEECH_STARTED' | 'SPEECH_ENDED' | 'VOICE_ACTIVITY_UPDATED'): AudioEvent {
  return {
    version: 1,
    id: generateAudioEventId(),
    timestamp: new Date().toISOString(),
    category: 'Audio',
    source: 'Microphone',
    type,
    severity: 'info',
    confidence: raw.confidence,
    payload: { speaking: raw.speaking },
  };
}

export function normalizeSilence(raw: SilenceMeasurement, type: 'LONG_SILENCE' | 'SHORT_SILENCE'): AudioEvent {
  // Long silence (e.g. > 10 seconds) could be flagged as a warning in metadata
  const severity: SeverityLevel = type === 'LONG_SILENCE' ? 'warning' : 'info';
  
  return {
    version: 1,
    id: generateAudioEventId(),
    timestamp: new Date().toISOString(),
    category: 'Audio',
    source: 'Microphone',
    type,
    severity,
    confidence: raw.confidence,
    payload: { durationMs: raw.silenceDuration, longestMs: raw.longestSilence },
  };
}

export function normalizeLatency(raw: LatencyMeasurement): AudioEvent {
  // High response delay (e.g., > 15 seconds) might indicate suspicious delay
  const severity: SeverityLevel = raw.responseDelay > 15000 ? 'warning' : 'info';
  
  return {
    version: 1,
    id: generateAudioEventId(),
    timestamp: new Date().toISOString(),
    category: 'Audio',
    source: 'Microphone',
    type: 'RESPONSE_DELAY_UPDATED',
    severity,
    confidence: raw.confidence,
    payload: { delayMs: raw.responseDelay },
  };
}

export function normalizeAudioLevel(raw: AudioLevelMeasurement): AudioEvent {
  let type = 'AUDIO_LEVEL_NORMAL';
  let severity: SeverityLevel = 'info';

  if (raw.levelCategory === 'LOW') {
    type = 'AUDIO_LEVEL_LOW';
    severity = 'warning'; // Warning if volume is too low to capture voice properly
  } else if (raw.levelCategory === 'HIGH') {
    type = 'AUDIO_LEVEL_HIGH';
  }

  return {
    version: 1,
    id: generateAudioEventId(),
    timestamp: new Date().toISOString(),
    category: 'Audio',
    source: 'Microphone',
    type,
    severity,
    confidence: raw.confidence,
    payload: { average: raw.averageLevel, peak: raw.peakLevel },
  };
}

export function normalizeMicrophone(raw: MicrophoneMeasurement, type: 'MICROPHONE_CONNECTED' | 'MICROPHONE_DISCONNECTED' | 'MICROPHONE_MUTED' | 'MICROPHONE_UNMUTED' | 'MICROPHONE_DEVICE_CHANGED'): AudioEvent {
  const severity: SeverityLevel = type === 'MICROPHONE_DISCONNECTED' || type === 'MICROPHONE_MUTED' ? 'warning' : 'info';
  
  return {
    version: 1,
    id: generateAudioEventId(),
    timestamp: new Date().toISOString(),
    category: 'Audio',
    source: 'Microphone',
    type,
    severity,
    confidence: raw.confidence,
    payload: { connected: raw.connected, muted: raw.muted },
  };
}

export function normalizeLifecycle(type: 'AUDIO_STARTED' | 'AUDIO_PAUSED' | 'AUDIO_RESUMED' | 'AUDIO_STOPPED'): AudioEvent {
  return {
    version: 1,
    id: generateAudioEventId(),
    timestamp: new Date().toISOString(),
    category: 'Audio',
    source: 'Microphone',
    type,
    severity: 'info',
    confidence: 1.0,
    payload: { timestamp: Date.now() },
  };
}
