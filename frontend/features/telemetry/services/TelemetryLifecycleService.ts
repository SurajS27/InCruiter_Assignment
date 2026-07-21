import { browserTelemetryService } from './BrowserTelemetryService';
import { telemetryRecorder } from './TelemetryRecorder';
import { useTelemetryStore } from '../../../store/useTelemetryStore';
import { eventBus } from '../../../events/eventBus';
import { resetEventCounter } from '../normalizers/TelemetryNormalizer';

export class TelemetryLifecycleService {
  start(): void {
    if (useTelemetryStore.getState().telemetryRunning) return;

    resetEventCounter();
    useTelemetryStore.getState().clearEvents();
    useTelemetryStore.getState().setTelemetryRunning(true);

    // Start recorder subscription
    telemetryRecorder.start();
    // Start hardware & window listeners
    browserTelemetryService.start();

    // Emit event on eventBus
    eventBus.emit({
      type: 'TELEMETRY_STARTED',
      payload: { timestamp: Date.now() },
    });
  }

  pause(): void {
    if (!useTelemetryStore.getState().telemetryRunning) return;

    browserTelemetryService.stop();

    eventBus.emit({
      type: 'TELEMETRY_PAUSED',
      payload: { timestamp: Date.now() },
    });
  }

  resume(): void {
    if (!useTelemetryStore.getState().telemetryRunning) return;

    browserTelemetryService.start();

    eventBus.emit({
      type: 'TELEMETRY_RESUMED',
      payload: { timestamp: Date.now() },
    });
  }

  stop(): void {
    if (!useTelemetryStore.getState().telemetryRunning) return;

    browserTelemetryService.stop();
    telemetryRecorder.stop();
    useTelemetryStore.getState().setTelemetryRunning(false);

    eventBus.emit({
      type: 'TELEMETRY_STOPPED',
      payload: { timestamp: Date.now() },
    });
  }
}

export const telemetryLifecycleService = new TelemetryLifecycleService();
export default telemetryLifecycleService;
