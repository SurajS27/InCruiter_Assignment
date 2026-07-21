import { eventBus } from '../../../events/eventBus';
import { useTelemetryStore } from '../../../store/useTelemetryStore';
import { TelemetryEvent } from '../types/telemetry';

export class TelemetryRecorder {
  private unsubscribe: (() => void) | null = null;

  start(): void {
    if (this.unsubscribe) return;

    this.unsubscribe = eventBus.subscribe((event) => {
      // Cast the EventBus event as a TelemetryEvent
      const telEvent = event as unknown as TelemetryEvent;
      
      // Check if it's a telemetry event by checking category
      if (telEvent.category) {
        // Record event in Zustand circular buffer
        useTelemetryStore.getState().addTelemetryEvent(telEvent);

        // Update corresponding state models in store
        const payload = telEvent.payload;
        switch (telEvent.category) {
          case 'Browser':
            useTelemetryStore.getState().updateFocusState(payload.state === 'focus');
            break;
          case 'Visibility':
            useTelemetryStore.getState().updateVisibilityState(payload.state === 'visible', payload.state);
            break;
          case 'Window':
            if (telEvent.type === 'WINDOW_RESIZED') {
              useTelemetryStore.getState().updateWindowState(
                payload.width,
                payload.height,
                useTelemetryStore.getState().windowState.isFullscreen
              );
            } else if (telEvent.type === 'FULLSCREEN_ENTER' || telEvent.type === 'FULLSCREEN_EXIT') {
              useTelemetryStore.getState().updateWindowState(
                useTelemetryStore.getState().windowState.width,
                useTelemetryStore.getState().windowState.height,
                payload.isFullscreen
              );
            }
            break;
          case 'Network':
            useTelemetryStore.getState().updateNetworkState(payload.online);
            break;
          case 'Clipboard':
            useTelemetryStore.getState().updateClipboardState(payload.action);
            break;
          case 'Keyboard':
            useTelemetryStore.getState().updateKeyboardActivity(payload.modifiers);
            break;
          case 'Mouse':
            useTelemetryStore.getState().updateMouseActivity(payload.type);
            break;
        }
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

export const telemetryRecorder = new TelemetryRecorder();
export default telemetryRecorder;
