import { WindowCollector } from '../collectors/WindowCollector';
import { normalizeWindow } from '../normalizers/TelemetryNormalizer';
import { eventBus } from '../../../events/eventBus';

export class WindowService {
  private collector: WindowCollector | null = null;

  start(): void {
    if (this.collector) return;
    this.collector = new WindowCollector((raw) => {
      const normalized = normalizeWindow(raw);
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

export const windowService = new WindowService();
export default windowService;
