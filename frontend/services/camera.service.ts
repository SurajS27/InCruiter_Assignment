export class CameraService {
  private activeStream: MediaStream | null = null;

  async getCameraStream(): Promise<MediaStream> {
    if (typeof window === 'undefined') {
      throw new Error('CameraService can only be used in client environments.');
    }

    if (this.activeStream) {
      return this.activeStream;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      this.activeStream = stream;
      return stream;
    } catch (err: any) {
      console.error('Error in CameraService.getCameraStream:', err);
      throw err;
    }
  }

  stopCameraStream(): void {
    if (this.activeStream) {
      this.activeStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.activeStream = null;
    }
  }
}

export const cameraService = new CameraService();
export default cameraService;
