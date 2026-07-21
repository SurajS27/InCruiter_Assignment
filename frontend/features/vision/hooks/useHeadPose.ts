import { useVisionStore } from '../../../store/useVisionStore';

export function useHeadPose() {
  return useVisionStore((state) => state.latestHeadPose);
}

export default useHeadPose;
