import { create } from 'zustand';
import { Evidence, EvidenceStatistics } from '../types/evidence';

interface EvidenceStoreState {
  activeEvidence: Evidence[];
  historicalEvidence: Evidence[];
  timeline: Evidence[];
  statistics: EvidenceStatistics;
  lastEvidence: Evidence | null;

  addEvidence: (evidence: Evidence) => void;
  updateEvidence: (evidence: Evidence) => void;
  expireEvidence: (id: string) => void;
  resolveEvidence: (id: string) => void;
  updateStatistics: (updater: (stats: EvidenceStatistics) => Partial<EvidenceStatistics>) => void;
  clearEvidence: () => void;
}

const initialStatistics: EvidenceStatistics = {
  evidenceCount: 0,
  activeCount: 0,
  expiredCount: 0,
  resolvedCount: 0,
  averageConfidence: 0.0,
  rulesEvaluatedCount: 0,
  processingTimeMs: 0,
};

export const useEvidenceStore = create<EvidenceStoreState>((set) => ({
  activeEvidence: [],
  historicalEvidence: [],
  timeline: [],
  statistics: initialStatistics,
  lastEvidence: null,

  addEvidence: (evidence) =>
    set((state) => {
      // Manage 500 max circular buffer in timeline
      const newTimeline = [...state.timeline, evidence];
      if (newTimeline.length > 500) {
        newTimeline.shift();
      }

      const activeList = evidence.status === 'ACTIVE'
        ? [...state.activeEvidence, evidence]
        : state.activeEvidence;

      const historicalList = evidence.status !== 'ACTIVE'
        ? [...state.historicalEvidence, evidence]
        : state.historicalEvidence;

      // Stats calculations
      const totalCount = state.statistics.evidenceCount + 1;
      const avgConf = (state.statistics.averageConfidence * state.statistics.evidenceCount + evidence.confidence) / totalCount;

      return {
        timeline: newTimeline,
        activeEvidence: activeList,
        historicalEvidence: historicalList,
        lastEvidence: evidence,
        statistics: {
          ...state.statistics,
          evidenceCount: totalCount,
          activeCount: activeList.length,
          expiredCount: historicalList.filter((e) => e.status === 'EXPIRED').length,
          resolvedCount: historicalList.filter((e) => e.status === 'RESOLVED').length,
          averageConfidence: Math.round(avgConf * 100) / 100,
        },
      };
    }),

  updateEvidence: (evidence) =>
    set((state) => {
      const updateList = (list: Evidence[]) =>
        list.map((e) => (e.id === evidence.id ? evidence : e));

      const updatedActive = state.activeEvidence.map((e) => (e.id === evidence.id ? evidence : e));
      const updatedHistory = state.historicalEvidence.map((e) => (e.id === evidence.id ? evidence : e));
      const updatedTimeline = state.timeline.map((e) => (e.id === evidence.id ? evidence : e));

      return {
        activeEvidence: updatedActive,
        historicalEvidence: updatedHistory,
        timeline: updatedTimeline,
      };
    }),

  expireEvidence: (id) =>
    set((state) => {
      const target = state.activeEvidence.find((e) => e.id === id);
      if (!target) return {};

      const updatedTarget: Evidence = { ...target, status: 'EXPIRED' };
      const remainingActive = state.activeEvidence.filter((e) => e.id !== id);
      const newHistory = [...state.historicalEvidence, updatedTarget];

      const updatedTimeline = state.timeline.map((e) => (e.id === id ? updatedTarget : e));

      return {
        activeEvidence: remainingActive,
        historicalEvidence: newHistory,
        timeline: updatedTimeline,
        statistics: {
          ...state.statistics,
          activeCount: remainingActive.length,
          expiredCount: newHistory.filter((e) => e.status === 'EXPIRED').length,
        },
      };
    }),

  resolveEvidence: (id) =>
    set((state) => {
      const target = state.activeEvidence.find((e) => e.id === id) || state.historicalEvidence.find((e) => e.id === id);
      if (!target) return {};

      const updatedTarget: Evidence = { ...target, status: 'RESOLVED' };
      const remainingActive = state.activeEvidence.filter((e) => e.id !== id);
      
      const filteredHistory = state.historicalEvidence.filter((e) => e.id !== id);
      const newHistory = [...filteredHistory, updatedTarget];

      const updatedTimeline = state.timeline.map((e) => (e.id === id ? updatedTarget : e));

      return {
        activeEvidence: remainingActive,
        historicalEvidence: newHistory,
        timeline: updatedTimeline,
        statistics: {
          ...state.statistics,
          activeCount: remainingActive.length,
          expiredCount: newHistory.filter((e) => e.status === 'EXPIRED').length,
          resolvedCount: newHistory.filter((e) => e.status === 'RESOLVED').length,
        },
      };
    }),

  updateStatistics: (updater) =>
    set((state) => ({
      statistics: {
        ...state.statistics,
        ...updater(state.statistics),
      },
    })),

  clearEvidence: () =>
    set({
      activeEvidence: [],
      historicalEvidence: [],
      timeline: [],
      lastEvidence: null,
      statistics: { ...initialStatistics },
    }),
}));

export default useEvidenceStore;
