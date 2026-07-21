import { InterviewEvent } from '../types/event';

export type EventCallback = (event: InterviewEvent) => void;

export interface IEventBus {
  subscribe(callback: EventCallback): () => void;
  emit(event: Omit<InterviewEvent, 'id' | 'timestamp'> & Partial<Pick<InterviewEvent, 'id' | 'timestamp'>>): void;
  getEvents(): InterviewEvent[];
  clear(): void;
}
