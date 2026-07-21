import { useAudioStore } from '../../../store/useAudioStore';

export function useResponseLatency() {
  const averageResponseDelay = useAudioStore((state) => state.averageResponseDelay);

  return {
    averageResponseDelay,
  };
}

export default useResponseLatency;
