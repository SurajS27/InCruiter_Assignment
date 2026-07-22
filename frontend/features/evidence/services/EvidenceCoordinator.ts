import { eventBus } from '../../../events/eventBus';
import { evidenceCorrelator } from './EvidenceCorrelator';

export class EvidenceCoordinator {
  private unsubscribe: (() => void) | null = null;
  private running = false;

  start(): void {
    if (this.running) return;
    this.running = true;

    evidenceCorrelator.clear();

    // Subscribe to shared Event Bus to receive Browser, Vision, and Audio events
    this.unsubscribe = eventBus.subscribe((event) => {
      if (!this.running) return;
      evidenceCorrelator.correlate(event);
    });
  }

  stop(): void {
    this.running = false;
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    evidenceCorrelator.clear();
  }

  isRunning(): boolean {
    return this.running;
  }
}

export const evidenceCoordinator = new EvidenceCoordinator();
export default evidenceCoordinator;
