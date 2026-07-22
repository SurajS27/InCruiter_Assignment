import { useEvidenceStore } from '../store/useEvidenceStore';

export function useActiveEvidence() {
  return useEvidenceStore((state) => state.activeEvidence);
}

export default useActiveEvidence;
