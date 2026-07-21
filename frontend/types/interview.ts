export type CameraState = 'loading' | 'connected' | 'disconnected' | 'denied' | 'unavailable';
export type MicrophoneState = 'connected' | 'muted' | 'denied' | 'unavailable';

export interface Candidate {
  name: string;
}

export interface InterviewSession {
  id: string;
  candidateName: string;
  startedAt: string | null;
  endedAt: string | null;
  running: boolean;
  duration: number;
}
