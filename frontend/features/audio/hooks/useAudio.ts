import { useEffect } from 'react';
import { useAudioStore } from '../../../store/useAudioStore';
import { audioRecorder } from '../services/AudioRecorder';

export function useAudio() {
  const events = useAudioStore((state) => state.events);
  const statistics = useAudioStore((state) => state.statistics);
  const lastEvent = useAudioStore((state) => state.lastEvent);
  const audioRunning = useAudioStore((state) => state.audioRunning);

  useEffect(() => {
    // Start EventBus subscription recording
    audioRecorder.start();
    return () => {
      audioRecorder.stop();
    };
  }, []);

  return {
    events,
    statistics,
    lastEvent,
    audioRunning,
  };
}

export default useAudio;
