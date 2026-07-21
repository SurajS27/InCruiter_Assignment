import { NetworkCollector } from '../collectors/NetworkCollector';
import { normalizeNetwork } from '../normalizers/TelemetryNormalizer';
import { eventBus } from '../../../events/eventBus';

export class NetworkService {
  private collector: NetworkCollector | null = null;

  start(): void {
    if (this.collector) return;
    this.collector = new NetworkCollector((raw) => {
      const normalized = normalizeNetwork(raw);
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

export const networkService = new NetworkService();
export default networkService;
