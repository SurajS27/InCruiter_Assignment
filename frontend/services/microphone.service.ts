export class MicrophoneService {
  private activeStream: MediaStream | null = null;

  async getMicrophoneStream(): Promise<MediaStream> {
    if (typeof window === 'undefined') {
      throw new Error('MicrophoneService can only be used in client environments.');
    }

    if (this.activeStream) {
      return this.activeStream;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      this.activeStream = stream;
      return stream;
    } catch (err: any) {
      console.error('Error in MicrophoneService.getMicrophoneStream:', err);
      throw err;
    }
  }

  stopMicrophoneStream(): void {
    if (this.activeStream) {
      this.activeStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.activeStream = null;
    }
  }
}

export const microphoneService = new MicrophoneService();
export default microphoneService;
