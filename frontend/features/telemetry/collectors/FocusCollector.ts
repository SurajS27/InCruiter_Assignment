export type RawFocusEvent = {
  type: 'focus' | 'blur';
  timestamp: number;
};

export class FocusCollector {
  private active = false;
  private onEventCallback: (event: RawFocusEvent) => void;

  constructor(onEvent: (event: RawFocusEvent) => void) {
    this.onEventCallback = onEvent;
  }

  private handleFocus = () => {
    if (!this.active) return;
    this.onEventCallback({ type: 'focus', timestamp: Date.now() });
  };

  private handleBlur = () => {
    if (!this.active) return;
    this.onEventCallback({ type: 'blur', timestamp: Date.now() });
  };

  start(): void {
    if (this.active) return;
    this.active = true;
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', this.handleFocus);
      window.addEventListener('blur', this.handleBlur);
    }
  }

  stop(): void {
    if (!this.active) return;
    this.active = false;
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', this.handleFocus);
      window.removeEventListener('blur', this.handleBlur);
    }
  }
}
