export type RawWindowEvent =
  | { type: 'resize'; width: number; height: number; timestamp: number }
  | { type: 'fullscreen'; isFullscreen: boolean; timestamp: number }
  | { type: 'orientation'; angle: number; typeStr: string; timestamp: number };

export class WindowCollector {
  private active = false;
  private onEventCallback: (event: RawWindowEvent) => void;
  private resizeThrottleTimer: NodeJS.Timeout | null = null;

  constructor(onEvent: (event: RawWindowEvent) => void) {
    this.onEventCallback = onEvent;
  }

  private handleResize = () => {
    if (!this.active) return;
    if (this.resizeThrottleTimer) return;

    this.resizeThrottleTimer = setTimeout(() => {
      this.resizeThrottleTimer = null;
      if (typeof window !== 'undefined') {
        this.onEventCallback({
          type: 'resize',
          width: window.innerWidth,
          height: window.innerHeight,
          timestamp: Date.now(),
        });
      }
    }, 250); // Throttle to 250ms
  };

  private handleFullscreen = () => {
    if (!this.active) return;
    const isFullscreen = !!document.fullscreenElement;
    this.onEventCallback({
      type: 'fullscreen',
      isFullscreen,
      timestamp: Date.now(),
    });
  };

  private handleOrientation = () => {
    if (!this.active) return;
    const angle = window.screen?.orientation?.angle || 0;
    const typeStr = window.screen?.orientation?.type || 'unknown';
    this.onEventCallback({
      type: 'orientation',
      angle,
      typeStr,
      timestamp: Date.now(),
    });
  };

  start(): void {
    if (this.active) return;
    this.active = true;
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
      document.addEventListener('fullscreenchange', this.handleFullscreen);
      window.addEventListener('orientationchange', this.handleOrientation);
    }
  }

  stop(): void {
    if (!this.active) return;
    this.active = false;
    if (this.resizeThrottleTimer) {
      clearTimeout(this.resizeThrottleTimer);
      this.resizeThrottleTimer = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
      document.removeEventListener('fullscreenchange', this.handleFullscreen);
      window.removeEventListener('orientationchange', this.handleOrientation);
    }
  }
}
