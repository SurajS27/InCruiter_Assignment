import { useEffect } from 'react';
import { useInterviewStore } from '../../store/useInterviewStore';

export function useInterviewTimer() {
  const interviewRunning = useInterviewStore((state) => state.interviewRunning);
  const duration = useInterviewStore((state) => state.duration);
  const incrementDuration = useInterviewStore((state) => state.incrementDuration);

  useEffect(() => {
    if (!interviewRunning) return;

    const interval = setInterval(() => {
      incrementDuration();
    }, 1000);

    return () => clearInterval(interval);
  }, [interviewRunning, incrementDuration]);

  const formatDuration = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return {
    duration,
    formattedDuration: formatDuration(duration),
  };
}

export default useInterviewTimer;
