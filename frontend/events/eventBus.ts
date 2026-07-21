import { InterviewEvent } from '../types/event';
import { IEventBus, EventCallback } from './types';

class EventBus implements IEventBus {
  private subscribers: EventCallback[] = [];
  private events: InterviewEvent[] = [];

  subscribe(callback: EventCallback): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  emit(eventData: Omit<InterviewEvent, 'id' | 'timestamp'> & Partial<Pick<InterviewEvent, 'id' | 'timestamp'>>): void {
    const event: InterviewEvent = {
      ...eventData,
      id: eventData.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9)),
      timestamp: eventData.timestamp || new Date().toISOString(),
    };

    this.events.push(event);

    // Notify subscribers
    this.subscribers.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error('Error in EventBus subscriber:', err);
      }
    });
  }

  getEvents(): InterviewEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}

// Export singleton instance
export const eventBus = new EventBus();
export default eventBus;
