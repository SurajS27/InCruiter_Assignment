import { visionCoordinator } from './VisionCoordinator';
import { useVisionStore } from '../../../store/useVisionStore';
import { eventBus } from '../../../events/eventBus';
import { resetVisionEventCounter } from '../normalizers/VisionNormalizer';

export class VisionLifecycleService {
  private activeVideoElement: HTMLVideoElement | null = null;

  async start(videoElement: HTMLVideoElement): Promise<void> {
    if (useVisionStore.getState().visionRunning) return;

    this.activeVideoElement = videoElement;
    resetVisionEventCounter();
    useVisionStore.getState().clearVisionEvents();

    try {
      await visionCoordinator.start(videoElement);

      eventBus.emit({
        type: 'VISION_STARTED',
        payload: { timestamp: Date.now() },
      });
    } catch (err: any) {
      console.error('VisionLifecycleService failed to start:', err);
      // mediaPipeService initialize already emits VISION_INITIALIZATION_FAILED on model failure
      throw err;
    }
  }

  pause(): void {
    if (!useVisionStore.getState().visionRunning) return;

    visionCoordinator.pause();

    eventBus.emit({
      type: 'VISION_PAUSED',
      payload: { timestamp: Date.now() },
    });
  }

  resume(): void {
    if (!useVisionStore.getState().visionRunning) return;

    visionCoordinator.resume();

    eventBus.emit({
      type: 'VISION_RESUMED',
      payload: { timestamp: Date.now() },
    });
  }

  stop(): void {
    if (!useVisionStore.getState().visionRunning) return;

    visionCoordinator.stop(this.activeVideoElement);
    this.activeVideoElement = null;

    eventBus.emit({
      type: 'VISION_STOPPED',
      payload: { timestamp: Date.now() },
    });
  }

  async retry(): Promise<void> {
    const video = this.activeVideoElement || document.querySelector('video');
    if (video) {
      await this.start(video);
    } else {
      console.warn('No active video element found to retry vision initialization');
    }
  }
}

export const visionLifecycleService = new VisionLifecycleService();
export default visionLifecycleService;
