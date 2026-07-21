import { SilenceMeasurement } from '../types/audio';

export class SilenceExtractor {
  private longestSilenceMs = 0;
  private silenceStart: number | null = null;

  extract(speaking: boolean): SilenceMeasurement {
    const now = Date.now();
    let currentSilence = 0;

    if (!speaking) {
      if (this.silenceStart === null) {
        this.silenceStart = now;
      } else {
        currentSilence = now - this.silenceStart;
      }
    } else {
      if (this.silenceStart !== null) {
        const finishedSilence = now - this.silenceStart;
        this.longestSilenceMs = Math.max(this.longestSilenceMs, finishedSilence);
        this.silenceStart = null;
      }
    }

    const duration = currentSilence || (this.silenceStart ? now - this.silenceStart : 0);
    this.longestSilenceMs = Math.max(this.longestSilenceMs, duration);

    return {
      currentSilence: duration,
      longestSilence: this.longestSilenceMs,
      silenceDuration: duration,
      confidence: 0.95,
    };
  }

  reset(): void {
    this.longestSilenceMs = 0;
    this.silenceStart = null;
  }
}

export const silenceExtractor = new SilenceExtractor();
export default silenceExtractor;
