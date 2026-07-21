import { useEffect } from 'react';
import { telemetryLifecycleService } from '../services/TelemetryLifecycleService';
import { useInterviewStore } from '../../../store/useInterviewStore';
import { useTelemetryStore } from '../../../store/useTelemetryStore';

export function useBrowserTelemetry(): void {
  const interviewRunning = useInterviewStore((state) => state.interviewRunning);
  const incrementSessionDuration = useTelemetryStore((state) => state.incrementSessionDuration);

  useEffect(() => {
    if (interviewRunning) {
      telemetryLifecycleService.start();
    } else {
      telemetryLifecycleService.stop();
    }

    return () => {
      telemetryLifecycleService.stop();
    };
  }, [interviewRunning]);

  // Keep stats session duration ticking when running
  useEffect(() => {
    if (!interviewRunning) return;
    const timer = setInterval(() => {
      incrementSessionDuration();
    }, 1000);
    return () => clearInterval(timer);
  }, [interviewRunning, incrementSessionDuration]);
}

export default useBrowserTelemetry;
