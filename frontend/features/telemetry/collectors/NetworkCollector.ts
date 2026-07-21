export type RawNetworkEvent = {
  type: 'online' | 'offline';
  timestamp: number;
};

export class NetworkCollector {
  private active = false;
  private onEventCallback: (event: RawNetworkEvent) => void;

  constructor(onEvent: (event: RawNetworkEvent) => void) {
    this.onEventCallback = onEvent;
  }

  private handleOnline = () => {
    if (!this.active) return;
    this.onEventCallback({ type: 'online', timestamp: Date.now() });
  };

  private handleOffline = () => {
    if (!this.active) return;
    this.onEventCallback({ type: 'offline', timestamp: Date.now() });
  };

  start(): void {
    if (this.active) return;
    this.active = true;
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  stop(): void {
    if (!this.active) return;
    this.active = false;
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
  }
}
