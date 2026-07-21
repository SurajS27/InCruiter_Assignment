import { mediaPipeService } from './MediaPipeService';
import { cameraController } from '../camera/CameraController';
import { FrameProcessor } from '../camera/FrameProcessor';
import { faceTrackingService } from './FaceTrackingService';
import { useVisionStore } from '../../../store/useVisionStore';

export class VisionCoordinator {
  private frameProcessor: FrameProcessor | null = null;
  private cameraStream: MediaStream | null = null;

  async start(videoElement: HTMLVideoElement): Promise<void> {
    try {
      // 1. Initialize MediaPipe Face Landmarker model
      const landmarker = await mediaPipeService.initialize();
      if (!landmarker) {
        throw new Error('MediaPipe Landmarker failed to resolve.');
      }

      // 2. Setup video stream via CameraController
      this.cameraStream = await cameraController.setupCamera(videoElement);

      // 3. Setup FrameProcessor
      this.frameProcessor = new FrameProcessor(videoElement, landmarker);
      
      // 4. Start tracking service
      faceTrackingService.start();

      // 5. Start frame loop
      this.frameProcessor.start();
      
      useVisionStore.getState().setVisionRunning(true);
    } catch (err) {
      console.error('VisionCoordinator start failed:', err);
      this.stop(videoElement);
      throw err;
    }
  }

  pause(): void {
    if (this.frameProcessor) {
      this.frameProcessor.stop();
    }
    faceTrackingService.stop();
  }

  resume(): void {
    if (this.frameProcessor) {
      this.frameProcessor.start();
      faceTrackingService.start();
    }
  }

  stop(videoElement: HTMLVideoElement | null): void {
    if (this.frameProcessor) {
      this.frameProcessor.stop();
      this.frameProcessor = null;
    }
    
    faceTrackingService.stop();
    cameraController.stopCamera(videoElement);
    this.cameraStream = null;

    useVisionStore.getState().setVisionRunning(false);
  }
}

export const visionCoordinator = new VisionCoordinator();
export default visionCoordinator;
