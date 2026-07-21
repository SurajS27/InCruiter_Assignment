import { LatencyMeasurement } from '../types/audio';
import { eventBus } from '../../../events/eventBus';

export class ResponseLatencyExtractor {
  private lastQuestionDisplayedTimestamp = 0;
  private hasSpokenForCurrentQuestion = false;
  private unsubscribe: (() => void) | null = null;
  private delayHistory: number[] = [];

  start(): void {
    this.lastQuestionDisplayedTimestamp = Date.now();
    this.hasSpokenForCurrentQuestion = false;
    this.delayHistory = [];

    // Subscribe to Event Bus to catch QUESTION_CHANGED
    this.unsubscribe = eventBus.subscribe((event) => {
      if (event.type === 'QUESTION_CHANGED') {
        this.lastQuestionDisplayedTimestamp = Date.now();
        this.hasSpokenForCurrentQuestion = false;
      }
    });
  }

  stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  // Called when speaking starts
  registerSpeechStart(): LatencyMeasurement | null {
    if (this.hasSpokenForCurrentQuestion || this.lastQuestionDisplayedTimestamp === 0) {
      return null;
    }

    const now = Date.now();
    const delay = now - this.lastQuestionDisplayedTimestamp;
    
    this.hasSpokenForCurrentQuestion = true;
    this.delayHistory.push(delay);

    return {
      responseDelay: delay,
      confidence: 0.95,
    };
  }

  getAverageDelay(): number {
    if (this.delayHistory.length === 0) return 0;
    const sum = this.delayHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.delayHistory.length);
  }
}

export const responseLatencyExtractor = new ResponseLatencyExtractor();
export default responseLatencyExtractor;
