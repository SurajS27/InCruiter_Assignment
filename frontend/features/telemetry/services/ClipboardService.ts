import { ClipboardCollector } from '../collectors/ClipboardCollector';
import { normalizeClipboard } from '../normalizers/TelemetryNormalizer';
import { eventBus } from '../../../events/eventBus';

export class ClipboardService {
  private collector: ClipboardCollector | null = null;

  start(): void {
    if (this.collector) return;
    this.collector = new ClipboardCollector((raw) => {
      const normalized = normalizeClipboard(raw);
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

export const clipboardService = new ClipboardService();
export default clipboardService;
