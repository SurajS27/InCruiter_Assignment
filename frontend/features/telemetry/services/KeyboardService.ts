import { KeyboardCollector } from '../collectors/KeyboardCollector';
import { normalizeKeyboard } from '../normalizers/TelemetryNormalizer';
import { eventBus } from '../../../events/eventBus';

export class KeyboardService {
  private collector: KeyboardCollector | null = null;

  start(): void {
    if (this.collector) return;
    this.collector = new KeyboardCollector((raw) => {
      const normalized = normalizeKeyboard(raw);
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

export const keyboardService = new KeyboardService();
export default keyboardService;
