import { eventBus } from '../../../events/eventBus';
import { useAudioStore } from '../../../store/useAudioStore';
import { AudioEvent } from '../types/audio';

export class AudioRecorder {
  private unsubscribe: (() => void) | null = null;

  start(): void {
    if (this.unsubscribe) return;

    this.unsubscribe = eventBus.subscribe((event) => {
      const audEvent = event as unknown as AudioEvent;

      // Filter only audio category events
      if (audEvent.category === 'Audio') {
        useAudioStore.getState().addAudioEvent(audEvent);
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

export const audioRecorder = new AudioRecorder();
export default audioRecorder;
