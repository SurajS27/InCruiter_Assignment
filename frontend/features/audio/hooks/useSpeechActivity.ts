import { useAudioStore } from '../../../store/useAudioStore';

export function useSpeechActivity() {
  const speakingState = useAudioStore((state) => state.speakingState);
  const speechConfidence = useAudioStore((state) => state.speechConfidence);

  return {
    speakingState,
    speechConfidence,
  };
}

export default useSpeechActivity;
