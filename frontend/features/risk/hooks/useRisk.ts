import { useEffect } from 'react';
import { useRiskStore } from '../store/useRiskStore';
import { riskCoordinator } from '../services/RiskCoordinator';

export function useRisk() {
  const currentAssessment = useRiskStore((state) => state.currentAssessment);
  const riskFactors = useRiskStore((state) => state.riskFactors);
  const statistics = useRiskStore((state) => state.statistics);

  useEffect(() => {
    // Start listening and evaluating Evidence observations reactively
    riskCoordinator.start();
    return () => {
      riskCoordinator.stop();
    };
  }, []);

  return {
    currentAssessment,
    riskFactors,
    statistics,
    isRunning: riskCoordinator.isRunning(),
  };
}

export default useRisk;
