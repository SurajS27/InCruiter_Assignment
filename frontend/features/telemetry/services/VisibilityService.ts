import { VisibilityCollector } from '../collectors/VisibilityCollector';
import { normalizeVisibility } from '../normalizers/TelemetryNormalizer';
import { eventBus } from '../../../events/eventBus';

export class VisibilityService {
  private collector: VisibilityCollector | null = null;

  start(): void {
    if (this.collector) return;
    this.collector = new VisibilityCollector((raw) => {
      const normalized = normalizeVisibility(raw);
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

export const visibilityService = new VisibilityService();
export default visibilityService;
