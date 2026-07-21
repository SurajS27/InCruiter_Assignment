import { MouseCollector } from '../collectors/MouseCollector';
import { normalizeMouse } from '../normalizers/TelemetryNormalizer';
import { eventBus } from '../../../events/eventBus';

export class MouseService {
  private collector: MouseCollector | null = null;

  start(): void {
    if (this.collector) return;
    this.collector = new MouseCollector((raw) => {
      const normalized = normalizeMouse(raw);
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

export const mouseService = new MouseService();
export default mouseService;
