import { useAudioStore } from '../../../store/useAudioStore';

export function useSilence() {
  const silenceDuration = useAudioStore((state) => state.silenceDuration);
  const longestSilence = useAudioStore((state) => state.longestSilence);

  return {
    silenceDuration,
    longestSilence,
  };
}

export default useSilence;
