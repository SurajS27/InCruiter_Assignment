import { useRiskStore } from '../store/useRiskStore';

export function useAssessmentTimeline() {
  return useRiskStore((state) => state.assessmentTimeline);
}

export default useAssessmentTimeline;
