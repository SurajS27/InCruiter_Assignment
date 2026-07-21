import { eventBus } from '../events/eventBus';
import { InterviewEventType } from '../types/event';

export class EventService {
  emit(type: InterviewEventType, payload: Record<string, any> = {}): void {
    eventBus.emit({
      type,
      payload,
    });
  }

  getEventTimeline(): any[] {
    return eventBus.getEvents();
  }

  resetTimeline(): void {
    eventBus.clear();
  }
}

export const eventService = new EventService();
export default eventService;
