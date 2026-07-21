import { cameraService } from '../../../services/camera.service';

export class CameraController {
  private activeStream: MediaStream | null = null;

  async setupCamera(videoElement: HTMLVideoElement): Promise<MediaStream> {
    try {
      const stream = await cameraService.getCameraStream();
      videoElement.srcObject = stream;
      this.activeStream = stream;
      return stream;
    } catch (err) {
      console.error('CameraController failed to configure video stream source:', err);
      throw err;
    }
  }

  stopCamera(videoElement: HTMLVideoElement | null): void {
    if (videoElement) {
      videoElement.srcObject = null;
    }
    cameraService.stopCameraStream();
    this.activeStream = null;
  }
}

export const cameraController = new CameraController();
export default cameraController;
