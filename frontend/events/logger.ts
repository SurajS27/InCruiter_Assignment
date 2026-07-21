import { eventBus } from './eventBus';
import { InterviewEvent } from '../types/event';

export class EventLogger {
  private unsubscribe: (() => void) | null = null;

  startLogging(): void {
    if (this.unsubscribe) return;

    this.unsubscribe = eventBus.subscribe((event: InterviewEvent) => {
      const styles: Record<string, string> = {
        INTERVIEW_STARTED: 'color: #10B981; font-weight: bold;',
        INTERVIEW_ENDED: 'color: #EF4444; font-weight: bold;',
        CAMERA_ENABLED: 'color: #3B82F6;',
        CAMERA_DISABLED: 'color: #F59E0B;',
        MICROPHONE_ENABLED: 'color: #3B82F6;',
        MICROPHONE_DISABLED: 'color: #F59E0B;',
        QUESTION_CHANGED: 'color: #8B5CF6;',
        SETTINGS_UPDATED: 'color: #EC4899;',
        PERMISSION_CHANGED: 'color: #6366F1;',
        WINDOW_BLURRED: 'color: #EF4444; text-decoration: underline;',
        WINDOW_FOCUSED: 'color: #10B981; text-decoration: underline;',
      };

      const style = styles[event.type] || 'color: #6B7280;';
      console.log(
        `%c[Event Engine] [${new Date(event.timestamp).toLocaleTimeString()}] ${event.type}`,
        style,
        event.payload
      );
    });
  }

  stopLogging(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}

export const eventLogger = new EventLogger();
export default eventLogger;
