import { useVisionStore } from '../../../store/useVisionStore';
import { landmarkService } from '../services/LandmarkService';
import { faceTrackingService } from '../services/FaceTrackingService';
import { eventBus } from '../../../events/eventBus';
import { normalizeFrameProcessed } from '../normalizers/VisionNormalizer';

export class FrameProcessor {
  private videoElement: HTMLVideoElement | null = null;
  private landmarker: any = null;
  private loopActive = false;
  private lastFrameTime = 0;
  private frameIntervalMs = 60; // ~16.6 FPS target (60ms)
  private animationFrameId: number | null = null;

  constructor(video: HTMLVideoElement, landmarkerInstance: any) {
    this.videoElement = video;
    this.landmarker = landmarkerInstance;
  }

  start(): void {
    if (this.loopActive) return;
    this.loopActive = true;
    this.lastFrameTime = performance.now();
    this.processingLoop();
  }

  stop(): void {
    this.loopActive = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private processingLoop = (): void => {
    if (!this.loopActive || !this.videoElement || !this.landmarker) return;

    const now = performance.now();
    const elapsed = now - this.lastFrameTime;

    // Trigger update if interval is met
    if (elapsed >= this.frameIntervalMs) {
      this.lastFrameTime = now - (elapsed % this.frameIntervalMs);
      
      const stats = useVisionStore.getState().statistics;
      useVisionStore.getState().updateStatistics(() => ({
        framesReceived: stats.framesReceived + 1,
      }));

      // Check if video is ready
      if (this.videoElement.readyState >= 2) {
        const startProc = performance.now();
        
        try {
          const timestamp = performance.now();
          const result = this.landmarker.detectForVideo(this.videoElement, timestamp);
          
          const procTime = performance.now() - startProc;
          
          // Update frame statistics
          useVisionStore.getState().updateStatistics((prev) => {
            const processed = prev.framesProcessed + 1;
            const avgTime = (prev.averageProcessingTime * prev.framesProcessed + procTime) / processed;
            const currentFps = Math.round(1000 / (performance.now() - startProc + elapsed));
            return {
              framesProcessed: processed,
              averageProcessingTime: Math.round(avgTime * 10) / 10,
              averageFps: Math.round(((prev.averageFps * prev.framesProcessed + currentFps) / processed) * 10) / 10,
            };
          });

          // Forward features to tracking and extraction services
          if (result && result.faceLandmarks) {
            faceTrackingService.processFacePresence(result.faceLandmarks);
            landmarkService.processLandmarks(result.faceLandmarks);
            
            // Emit success telemetry event
            eventBus.emit(normalizeFrameProcessed(procTime, true));
          } else {
            useVisionStore.getState().updateStatistics((prev) => ({
              framesDropped: prev.framesDropped + 1,
            }));
            eventBus.emit(normalizeFrameProcessed(procTime, false));
          }
        } catch (err) {
          console.error('FrameProcessor detection loop failed:', err);
          useVisionStore.getState().updateStatistics((prev) => ({
            framesDropped: prev.framesDropped + 1,
          }));
        }
      } else {
        // Frame skipped (video not ready)
        useVisionStore.getState().updateStatistics((prev) => ({
          framesSkipped: prev.framesSkipped + 1,
        }));
      }
    }

    this.animationFrameId = requestAnimationFrame(this.processingLoop);
  };
}

export default FrameProcessor;
