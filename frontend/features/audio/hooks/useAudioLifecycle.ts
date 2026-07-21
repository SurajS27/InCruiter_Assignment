import { useEffect } from 'react';
import { audioLifecycleService } from '../services/AudioLifecycleService';
import { useAudioStore } from '../../../store/useAudioStore';
import { useInterviewStore } from '../../../store/useInterviewStore';

export function useAudioLifecycle() {
  const audioRunning = useAudioStore((state) => state.audioRunning);
  const interviewRunning = useInterviewStore((state) => state.interviewRunning);
  const incrementSessionDuration = useAudioStore((state) => state.incrementSessionDuration);

  useEffect(() => {
    if (interviewRunning) {
      audioLifecycleService.start();
    } else {
      audioLifecycleService.stop();
    }

    return () => {
      audioLifecycleService.stop();
    };
  }, [interviewRunning]);

  // Session duration ticking
  useEffect(() => {
    if (!audioRunning) return;
    const interval = setInterval(() => {
      incrementSessionDuration();
    }, 1000);
    return () => clearInterval(interval);
  }, [audioRunning, incrementSessionDuration]);
}

export default useAudioLifecycle;
