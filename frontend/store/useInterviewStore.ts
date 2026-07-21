import { create } from 'zustand';
import { eventService } from '../services/event.service';

interface InterviewState {
  interviewRunning: boolean;
  interviewStartedAt: string | null;
  interviewEndedAt: string | null;
  duration: number;
  candidateName: string;
  setCandidateName: (name: string) => void;
  startInterview: () => void;
  endInterview: () => void;
  incrementDuration: () => void;
  resetSession: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  interviewRunning: false,
  interviewStartedAt: null,
  interviewEndedAt: null,
  duration: 0,
  candidateName: '',

  setCandidateName: (name) => set({ candidateName: name }),

  startInterview: () => {
    const now = new Date().toISOString();
    set({
      interviewRunning: true,
      interviewStartedAt: now,
      interviewEndedAt: null,
      duration: 0,
    });
    eventService.emit('INTERVIEW_STARTED', { timestamp: now });
  },

  endInterview: () => {
    const now = new Date().toISOString();
    set((state) => {
      eventService.emit('INTERVIEW_ENDED', { timestamp: now, duration: state.duration });
      return {
        interviewRunning: false,
        interviewEndedAt: now,
      };
    });
  },

  incrementDuration: () => set((state) => ({ duration: state.duration + 1 })),

  resetSession: () => {
    set({
      interviewRunning: false,
      interviewStartedAt: null,
      interviewEndedAt: null,
      duration: 0,
    });
  },
}));

export default useInterviewStore;
