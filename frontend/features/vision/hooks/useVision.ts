import { useEffect } from 'react';
import { useVisionStore } from '../../../store/useVisionStore';
import { visionRecorder } from '../services/VisionRecorder';

export function useVision() {
  const events = useVisionStore((state) => state.events);
  const statistics = useVisionStore((state) => state.statistics);
  const lastEvent = useVisionStore((state) => state.lastEvent);
  const visionRunning = useVisionStore((state) => state.visionRunning);

  useEffect(() => {
    // Start listening to EventBus and recording
    visionRecorder.start();
    return () => {
      visionRecorder.stop();
    };
  }, []);

  return {
    events,
    statistics,
    lastEvent,
    visionRunning,
  };
}

export default useVision;
