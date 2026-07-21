export class SpeakingDurationExtractor {
  private speakingStart: number | null = null;
  private totalSpeakingMs = 0;
  private burstCount = 0;

  extract(speaking: boolean): { currentBurst: number; totalTime: number; averageBurst: number } {
    const now = Date.now();
    let currentBurst = 0;

    if (speaking) {
      if (this.speakingStart === null) {
        this.speakingStart = now;
        this.burstCount++;
      } else {
        currentBurst = now - this.speakingStart;
      }
    } else {
      if (this.speakingStart !== null) {
        const finishedBurst = now - this.speakingStart;
        this.totalSpeakingMs += finishedBurst;
        this.speakingStart = null;
      }
    }

    const duration = currentBurst || (this.speakingStart ? now - this.speakingStart : 0);
    const cumulativeTime = this.totalSpeakingMs + (speaking ? duration : 0);
    const averageBurst = this.burstCount > 0 ? Math.round(cumulativeTime / this.burstCount) : 0;

    return {
      currentBurst: duration,
      totalTime: cumulativeTime,
      averageBurst,
    };
  }

  reset(): void {
    this.speakingStart = null;
    this.totalSpeakingMs = 0;
    this.burstCount = 0;
  }
}

export const speakingDurationExtractor = new SpeakingDurationExtractor();
export default speakingDurationExtractor;
