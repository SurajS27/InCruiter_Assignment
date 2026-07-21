import { useVisionStore } from '../../../store/useVisionStore';

export function useBlinkDetection() {
  return useVisionStore((state) => state.latestBlinkRate);
}

export default useBlinkDetection;
