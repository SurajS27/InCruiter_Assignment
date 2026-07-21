import { InterviewSession } from './interview';

export type SessionState = {
  currentSession: InterviewSession | null;
  isLoading: boolean;
  error: string | null;
};
