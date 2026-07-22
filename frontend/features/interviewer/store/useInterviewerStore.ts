import { create } from 'zustand';
import { Scorecard, InterviewerNote, SessionTimelineEvent, RecommendationType } from '../types/interviewer';

interface InterviewerStoreState {
  currentQuestionIndex: number;
  questionHistory: string[];
  answeredQuestions: string[];
  notes: InterviewerNote[];
  scorecard: Scorecard;
  recommendation: RecommendationType | null;
  timeline: SessionTimelineEvent[];
  sessionState: 'waiting' | 'active' | 'completed';
  
  setQuestionIndex: (index: number) => void;
  markQuestionAnswered: (questionId: string) => void;
  addNote: (note: Omit<InterviewerNote, 'id' | 'timestamp'>) => void;
  updateNote: (id: string, content: string) => void;
  updateScorecard: (scorecard: Partial<Scorecard>) => void;
  setRecommendation: (recommendation: RecommendationType | null) => void;
  addTimelineEvent: (title: string, description: string, type: string) => void;
  setSessionState: (state: 'waiting' | 'active' | 'completed') => void;
  clearInterviewerSession: () => void;
}

const initialScorecard: Scorecard = {
  technicalKnowledge: 5,
  problemSolving: 5,
  communication: 5,
  systemDesign: 5,
  cultureFit: 5,
  comments: '',
};

export const useInterviewerStore = create<InterviewerStoreState>((set) => ({
  currentQuestionIndex: 0,
  questionHistory: [],
  answeredQuestions: [],
  notes: [],
  scorecard: initialScorecard,
  recommendation: null,
  timeline: [],
  sessionState: 'waiting',

  setQuestionIndex: (index) =>
    set((state) => {
      const history = [...state.questionHistory];
      const qIndexStr = String(index);
      if (!history.includes(qIndexStr)) {
        history.push(qIndexStr);
      }
      return {
        currentQuestionIndex: index,
        questionHistory: history,
      };
    }),

  markQuestionAnswered: (questionId) =>
    set((state) => {
      const answered = [...state.answeredQuestions];
      if (!answered.includes(questionId)) {
        answered.push(questionId);
      }
      return { answeredQuestions: answered };
    }),

  addNote: (note) =>
    set((state) => ({
      notes: [
        ...state.notes,
        {
          id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          timestamp: new Date().toLocaleTimeString(),
          ...note,
        },
      ],
    })),

  updateNote: (id, content) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, content } : n)),
    })),

  updateScorecard: (fields) =>
    set((state) => ({
      scorecard: {
        ...state.scorecard,
        ...fields,
      },
    })),

  setRecommendation: (rec) => set({ recommendation: rec }),

  addTimelineEvent: (title, description, type) =>
    set((state) => ({
      timeline: [
        ...state.timeline,
        {
          id: `evt_col_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          timestamp: new Date().toLocaleTimeString(),
          title,
          description,
          type,
        },
      ],
    })),

  setSessionState: (sState) => set({ sessionState: sState }),

  clearInterviewerSession: () =>
    set({
      currentQuestionIndex: 0,
      questionHistory: [],
      answeredQuestions: [],
      notes: [],
      scorecard: { ...initialScorecard },
      recommendation: null,
      timeline: [],
      sessionState: 'waiting',
    }),
}));

export default useInterviewerStore;
