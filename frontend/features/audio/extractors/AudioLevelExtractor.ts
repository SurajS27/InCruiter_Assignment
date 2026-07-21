import { AudioLevelMeasurement } from '../types/audio';

export class AudioLevelExtractor {
  extract(avgRms: number, peakVolume: number): AudioLevelMeasurement {
    let levelCategory: 'LOW' | 'NORMAL' | 'HIGH' = 'NORMAL';

    // RMS bounds (approx mapped to 0-100 scale)
    if (avgRms < 10) {
      levelCategory = 'LOW';
    } else if (avgRms > 65) {
      levelCategory = 'HIGH';
    }

    return {
      averageLevel: Math.round(avgRms * 10) / 10,
      peakLevel: Math.round(peakVolume * 10) / 10,
      levelCategory,
      confidence: 0.98,
    };
  }
}

export const audioLevelExtractor = new AudioLevelExtractor();
export default audioLevelExtractor;
