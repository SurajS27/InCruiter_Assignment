import { SpeechMeasurement } from '../types/audio';

export class SpeechActivityExtractor {
  extract(speaking: boolean, confidence: number): SpeechMeasurement {
    return {
      speaking,
      confidence,
    };
  }
}

export const speechActivityExtractor = new SpeechActivityExtractor();
export default speechActivityExtractor;
