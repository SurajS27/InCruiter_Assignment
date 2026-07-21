import { eventBus } from '../../../events/eventBus';
import { useVisionStore } from '../../../store/useVisionStore';
import { VisionEvent } from '../types/vision';

export class VisionRecorder {
  private unsubscribe: (() => void) | null = null;

  start(): void {
    if (this.unsubscribe) return;

    this.unsubscribe = eventBus.subscribe((event) => {
      const visEvent = event as unknown as VisionEvent;
      
      // Filter only vision category events
      if (visEvent.category === 'Vision') {
        useVisionStore.getState().addVisionEvent(visEvent);
      }
    });
  }

  stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}

export const visionRecorder = new VisionRecorder();
export default visionRecorder;
