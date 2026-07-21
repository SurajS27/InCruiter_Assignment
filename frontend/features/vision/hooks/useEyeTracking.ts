import { useVisionStore } from '../../../store/useVisionStore';

export function useEyeTracking() {
  return useVisionStore((state) => state.latestGazeDirection);
}

export default useEyeTracking;
