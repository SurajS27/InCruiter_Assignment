export type RawKeyboardEvent = {
  type: 'keydown' | 'keyup';
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  timestamp: number;
};

export class KeyboardCollector {
  private active = false;
  private onEventCallback: (event: RawKeyboardEvent) => void;

  constructor(onEvent: (event: RawKeyboardEvent) => void) {
    this.onEventCallback = onEvent;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.active) return;
    this.onEventCallback({
      type: 'keydown',
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      timestamp: Date.now(),
    });
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (!this.active) return;
    this.onEventCallback({
      type: 'keyup',
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      timestamp: Date.now(),
    });
  };

  start(): void {
    if (this.active) return;
    this.active = true;
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
    }
  }

  stop(): void {
    if (!this.active) return;
    this.active = false;
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
    }
  }
}
