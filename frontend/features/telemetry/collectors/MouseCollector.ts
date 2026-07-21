export type RawMouseEvent = {
  type: 'mouseenter' | 'mouseleave' | 'contextmenu' | 'pointerenter' | 'pointerleave';
  timestamp: number;
};

export class MouseCollector {
  private active = false;
  private onEventCallback: (event: RawMouseEvent) => void;

  constructor(onEvent: (event: RawMouseEvent) => void) {
    this.onEventCallback = onEvent;
  }

  private handleMouseEnter = () => {
    if (!this.active) return;
    this.onEventCallback({ type: 'mouseenter', timestamp: Date.now() });
  };

  private handleMouseLeave = () => {
    if (!this.active) return;
    this.onEventCallback({ type: 'mouseleave', timestamp: Date.now() });
  };

  private handleContextMenu = (e: MouseEvent) => {
    if (!this.active) return;
    e.preventDefault(); // Suspected Developer Tools or right click context block option
    this.onEventCallback({ type: 'contextmenu', timestamp: Date.now() });
  };

  private handlePointerEnter = () => {
    if (!this.active) return;
    this.onEventCallback({ type: 'pointerenter', timestamp: Date.now() });
  };

  private handlePointerLeave = () => {
    if (!this.active) return;
    this.onEventCallback({ type: 'pointerleave', timestamp: Date.now() });
  };

  start(): void {
    if (this.active) return;
    this.active = true;
    if (typeof window !== 'undefined') {
      document.addEventListener('mouseenter', this.handleMouseEnter);
      document.addEventListener('mouseleave', this.handleMouseLeave);
      document.addEventListener('contextmenu', this.handleContextMenu);
      document.addEventListener('pointerenter', this.handlePointerEnter);
      document.addEventListener('pointerleave', this.handlePointerLeave);
    }
  }

  stop(): void {
    if (!this.active) return;
    this.active = false;
    if (typeof window !== 'undefined') {
      document.removeEventListener('mouseenter', this.handleMouseEnter);
      document.removeEventListener('mouseleave', this.handleMouseLeave);
      document.removeEventListener('contextmenu', this.handleContextMenu);
      document.removeEventListener('pointerenter', this.handlePointerEnter);
      document.removeEventListener('pointerleave', this.handlePointerLeave);
    }
  }
}
