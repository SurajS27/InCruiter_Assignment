import { useAudioStore } from '../../../store/useAudioStore';

export function useMicrophoneState() {
  const microphoneState = useAudioStore((state) => state.microphoneState);

  return {
    microphoneState,
  };
}

export default useMicrophoneState;
