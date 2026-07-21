import { MicrophoneMeasurement } from '../types/audio';

export class MicrophoneStateExtractor {
  extract(connected: boolean, muted: boolean): MicrophoneMeasurement {
    return {
      connected,
      muted,
      confidence: 1.0,
    };
  }
}

export const microphoneStateExtractor = new MicrophoneStateExtractor();
export default microphoneStateExtractor;
