import { telemetryLifecycleService } from '../services/TelemetryLifecycleService';
import { useTelemetryStore } from '../../../store/useTelemetryStore';

export function useTelemetryLifecycle() {
  const telemetryRunning = useTelemetryStore((state) => state.telemetryRunning);

  return {
    telemetryRunning,
    start: () => telemetryLifecycleService.start(),
    pause: () => telemetryLifecycleService.pause(),
    resume: () => telemetryLifecycleService.resume(),
    stop: () => telemetryLifecycleService.stop(),
  };
}

export default useTelemetryLifecycle;
