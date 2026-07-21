export type RawVisibilityEvent = {
  state: 'visible' | 'hidden';
  timestamp: number;
};

export class VisibilityCollector {
  private active = false;
  private onEventCallback: (event: RawVisibilityEvent) => void;

  constructor(onEvent: (event: RawVisibilityEvent) => void) {
    this.onEventCallback = onEvent;
  }

  private handleVisibilityChange = () => {
    if (!this.active) return;
    const state = document.visibilityState === 'visible' ? 'visible' : 'hidden';
    this.onEventCallback({
      state,
      timestamp: Date.now(),
    });
  };

  start(): void {
    if (this.active) return;
    this.active = true;
    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  stop(): void {
    if (!this.active) return;
    this.active = false;
    if (typeof window !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }
}
