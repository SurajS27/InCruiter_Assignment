import { useEffect, useCallback } from 'react';
import { visionLifecycleService } from '../services/VisionLifecycleService';
import { useVisionStore } from '../../../store/useVisionStore';
import { useInterviewStore } from '../../../store/useInterviewStore';

export function useVisionLifecycle(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  cameraConnected: boolean
) {
  const visionRunning = useVisionStore((state) => state.visionRunning);
  const interviewRunning = useInterviewStore((state) => state.interviewRunning);
  const incrementSessionDuration = useVisionStore((state) => state.incrementSessionDuration);
  const initError = useVisionStore((state) => state.initError);

  const startVision = useCallback(async () => {
    if (videoRef.current) {
      try {
        await visionLifecycleService.start(videoRef.current);
      } catch (e) {
        console.warn('Failed starting vision lifecycle:', e);
      }
    }
  }, [videoRef]);

  // Monitor interview lifecycle & camera connection to control vision lifecycle
  useEffect(() => {
    if (interviewRunning && cameraConnected && videoRef.current) {
      startVision();
    } else {
      visionLifecycleService.stop();
    }

    return () => {
      visionLifecycleService.stop();
    };
  }, [interviewRunning, cameraConnected, videoRef, startVision]);

  // Session duration ticking
  useEffect(() => {
    if (!visionRunning) return;
    const interval = setInterval(() => {
      incrementSessionDuration();
    }, 1000);
    return () => clearInterval(interval);
  }, [visionRunning, incrementSessionDuration]);

  return {
    visionRunning,
    initError,
    retry: startVision,
    pause: () => visionLifecycleService.pause(),
    resume: () => visionLifecycleService.resume(),
    stop: () => visionLifecycleService.stop(),
  };
}

export default useVisionLifecycle;
