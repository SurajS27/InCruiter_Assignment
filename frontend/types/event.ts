export type InterviewEventType =
  | 'INTERVIEW_STARTED'
  | 'INTERVIEW_ENDED'
  | 'CAMERA_ENABLED'
  | 'CAMERA_DISABLED'
  | 'MICROPHONE_ENABLED'
  | 'MICROPHONE_DISABLED'
  | 'QUESTION_CHANGED'
  | 'SETTINGS_UPDATED'
  | 'PERMISSION_CHANGED'
  | 'WINDOW_BLURRED'
  | 'WINDOW_FOCUSED';

export interface InterviewEvent {
  id: string;
  timestamp: string;
  type: InterviewEventType;
  payload: Record<string, any>;
}
