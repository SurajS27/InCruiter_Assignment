import { useRiskStore } from '../store/useRiskStore';

export function useRiskAssessment() {
  return useRiskStore((state) => state.currentAssessment);
}

export default useRiskAssessment;
