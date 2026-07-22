import { create } from 'zustand';
import { RiskAssessment, RiskFactor, RiskStatistics } from '../types/risk';

interface RiskStoreState {
  currentAssessment: RiskAssessment | null;
  assessmentHistory: RiskAssessment[];
  assessmentTimeline: RiskAssessment[];
  riskFactors: RiskFactor[];
  statistics: RiskStatistics;

  setAssessment: (assessment: RiskAssessment) => void;
  updateRiskFactors: (factors: RiskFactor[]) => void;
  updateStatistics: (updater: (stats: RiskStatistics) => Partial<RiskStatistics>) => void;
  clearRisk: () => void;
}

const initialStatistics: RiskStatistics = {
  assessmentsEvaluatedCount: 0,
  rulesEvaluatedCount: 0,
  averageConfidence: 0.0,
  processingTimeMs: 0,
};

export const useRiskStore = create<RiskStoreState>((set) => ({
  currentAssessment: null,
  assessmentHistory: [],
  assessmentTimeline: [],
  riskFactors: [],
  statistics: initialStatistics,

  setAssessment: (assessment) =>
    set((state) => {
      // Circular history buffer limit 100
      const newHistory = [...state.assessmentHistory, assessment];
      if (newHistory.length > 100) {
        newHistory.shift();
      }

      const totalCount = state.statistics.assessmentsEvaluatedCount + 1;
      const newAvgConf = (state.statistics.averageConfidence * state.statistics.assessmentsEvaluatedCount + assessment.averageConfidence) / totalCount;

      return {
        currentAssessment: assessment,
        assessmentHistory: newHistory,
        assessmentTimeline: newHistory,
        statistics: {
          ...state.statistics,
          assessmentsEvaluatedCount: totalCount,
          averageConfidence: Math.round(newAvgConf * 100) / 100,
        },
      };
    }),

  updateRiskFactors: (factors) => set({ riskFactors: factors }),

  updateStatistics: (updater) =>
    set((state) => ({
      statistics: {
        ...state.statistics,
        ...updater(state.statistics),
      },
    })),

  clearRisk: () =>
    set({
      currentAssessment: null,
      assessmentHistory: [],
      assessmentTimeline: [],
      riskFactors: [],
      statistics: { ...initialStatistics },
    }),
}));

export default useRiskStore;
