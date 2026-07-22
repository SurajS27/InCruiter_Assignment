import { useEvidenceStore } from '../store/useEvidenceStore';

export function useEvidenceTimeline() {
  return useEvidenceStore((state) => state.timeline);
}

export default useEvidenceTimeline;
