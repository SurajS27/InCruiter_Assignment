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
  | 'WINDOW_FOCUSED'
  | 'WINDOW_FOCUS'
  | 'WINDOW_BLUR'
  | 'TAB_VISIBLE'
  | 'TAB_HIDDEN'
  | 'WINDOW_RESIZED'
  | 'FULLSCREEN_ENTER'
  | 'FULLSCREEN_EXIT'
  | 'NETWORK_ONLINE'
  | 'NETWORK_OFFLINE'
  | 'KEYBOARD_ACTIVITY'
  | 'COPY_EVENT'
  | 'PASTE_EVENT'
  | 'CUT_EVENT'
  | 'MOUSE_ENTER'
  | 'MOUSE_LEAVE'
  | 'RIGHT_CLICK'
  | 'DEVELOPER_TOOLS_SUSPECTED'
  | 'TELEMETRY_STARTED'
  | 'TELEMETRY_PAUSED'
  | 'TELEMETRY_RESUMED'
  | 'TELEMETRY_STOPPED';

export interface InterviewEvent {
  id: string;
  timestamp: string;
  type: InterviewEventType | string;
  payload: Record<string, any>;
  category?: string;
  source?: string;
  severity?: string;
}
