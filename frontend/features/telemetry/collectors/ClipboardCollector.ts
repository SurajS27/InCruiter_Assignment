export type RawClipboardEvent = {
  type: 'copy' | 'cut' | 'paste';
  timestamp: number;
};

export class ClipboardCollector {
  private active = false;
  private onEventCallback: (event: RawClipboardEvent) => void;

  constructor(onEvent: (event: RawClipboardEvent) => void) {
    this.onEventCallback = onEvent;
  }

  private handleCopy = () => {
    if (!this.active) return;
    this.onEventCallback({ type: 'copy', timestamp: Date.now() });
  };

  private handleCut = () => {
    if (!this.active) return;
    this.onEventCallback({ type: 'cut', timestamp: Date.now() });
  };

  private handlePaste = () => {
    if (!this.active) return;
    this.onEventCallback({ type: 'paste', timestamp: Date.now() });
  };

  start(): void {
    if (this.active) return;
    this.active = true;
    if (typeof window !== 'undefined') {
      document.addEventListener('copy', this.handleCopy);
      document.addEventListener('cut', this.handleCut);
      document.addEventListener('paste', this.handlePaste);
    }
  }

  stop(): void {
    if (!this.active) return;
    this.active = false;
    if (typeof window !== 'undefined') {
      document.removeEventListener('copy', this.handleCopy);
      document.removeEventListener('cut', this.handleCut);
      document.removeEventListener('paste', this.handlePaste);
    }
  }
}
