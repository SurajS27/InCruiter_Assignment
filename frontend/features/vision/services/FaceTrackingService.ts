import { facePresenceExtractor } from '../extractors/FacePresenceExtractor';
import { normalizeFacePresence } from '../normalizers/VisionNormalizer';
import { eventBus } from '../../../events/eventBus';
import { useVisionStore } from '../../../store/useVisionStore';

export class FaceTrackingService {
  private lastFaceCount = 0;
  private trackingActive = false;

  start(): void {
    this.trackingActive = true;
    this.lastFaceCount = 0;
    eventBus.emit({
      type: 'FACE_TRACKING_STARTED',
      payload: { timestamp: Date.now() },
    });
  }

  stop(): void {
    this.trackingActive = false;
    eventBus.emit({
      type: 'FACE_TRACKING_STOPPED',
      payload: { timestamp: Date.now() },
    });
  }

  processFacePresence(faceLandmarksList: any[][]): void {
    if (!this.trackingActive) return;

    const presence = facePresenceExtractor.extract(faceLandmarksList);
    const count = presence.faceCount;

    // Update Zustand Store
    useVisionStore.getState().updateFaceTracking(count, presence.confidence);

    // Evaluate state transitions and emit corresponding events
    if (count !== this.lastFaceCount) {
      if (count === 0) {
        eventBus.emit(normalizeFacePresence(presence, 'FACE_LOST'));
      } else if (count === 1 && this.lastFaceCount === 0) {
        eventBus.emit(normalizeFacePresence(presence, 'FACE_DETECTED'));
      } else if (count > 1) {
        eventBus.emit(normalizeFacePresence(presence, 'MULTIPLE_FACES'));
      }
    }

    // Monitor confidence levels
    if (count > 0 && presence.confidence < 0.6) {
      eventBus.emit(normalizeFacePresence(presence, 'LOW_TRACKING_CONFIDENCE'));
    }

    this.lastFaceCount = count;
  }
}

export const faceTrackingService = new FaceTrackingService();
export default faceTrackingService;
