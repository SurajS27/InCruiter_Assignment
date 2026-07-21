import { FocusCollector } from '../collectors/FocusCollector';
import { normalizeFocus } from '../normalizers/TelemetryNormalizer';
import { eventBus } from '../../../events/eventBus';

export class FocusService {
  private collector: FocusCollector | null = null;

  start(): void {
    if (this.collector) return;
    this.collector = new FocusCollector((raw) => {
      const normalized = normalizeFocus(raw);
      eventBus.emit(normalized);
    });
    this.collector.start();
  }

  stop(): void {
    if (this.collector) {
      this.collector.stop();
      this.collector = null;
    }
  }
}

export const focusService = new FocusService();
export default focusService;
