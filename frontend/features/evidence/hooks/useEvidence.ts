import { useEffect } from 'react';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { evidenceCoordinator } from '../services/EvidenceCoordinator';

export function useEvidence() {
  const timeline = useEvidenceStore((state) => state.timeline);
  const activeEvidence = useEvidenceStore((state) => state.activeEvidence);
  const historicalEvidence = useEvidenceStore((state) => state.historicalEvidence);
  const statistics = useEvidenceStore((state) => state.statistics);
  const lastEvidence = useEvidenceStore((state) => state.lastEvidence);

  useEffect(() => {
    // Start listening and correlating EventBus events into higher reasoning layers
    evidenceCoordinator.start();
    return () => {
      evidenceCoordinator.stop();
    };
  }, []);

  return {
    timeline,
    activeEvidence,
    historicalEvidence,
    statistics,
    lastEvidence,
    isRunning: evidenceCoordinator.isRunning(),
  };
}

export default useEvidence;
