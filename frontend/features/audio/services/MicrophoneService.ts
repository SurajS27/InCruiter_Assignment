import { eventBus } from '../../../events/eventBus';
import { useAudioStore } from '../../../store/useAudioStore';
import { normalizeMicrophone } from '../normalizers/AudioNormalizer';

export class MicrophoneService {
  private activeStream: MediaStream | null = null;
  private onDeviceChangeCallback: (() => void) | null = null;

  async requestMicrophone(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.activeStream = stream;

      // Listen to track events
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.onmute = () => {
          const mic = { connected: true, muted: true, confidence: 1.0 };
          useAudioStore.getState().updateMicrophoneState(mic);
          eventBus.emit(normalizeMicrophone(mic, 'MICROPHONE_MUTED'));
        };

        audioTrack.onunmute = () => {
          const mic = { connected: true, muted: false, confidence: 1.0 };
          useAudioStore.getState().updateMicrophoneState(mic);
          eventBus.emit(normalizeMicrophone(mic, 'MICROPHONE_UNMUTED'));
        };

        audioTrack.onended = () => {
          const mic = { connected: false, muted: false, confidence: 1.0 };
          useAudioStore.getState().updateMicrophoneState(mic);
          eventBus.emit(normalizeMicrophone(mic, 'MICROPHONE_DISCONNECTED'));
        };
      }

      // Track connection events
      const mic = { connected: true, muted: false, confidence: 1.0 };
      useAudioStore.getState().updateMicrophoneState(mic);
      eventBus.emit(normalizeMicrophone(mic, 'MICROPHONE_CONNECTED'));

      // Listen to hardware change events
      this.setupDeviceListener();

      return stream;
    } catch (err: any) {
      console.error('MicrophoneService stream request failed:', err);
      const mic = { connected: false, muted: false, confidence: 0.0 };
      useAudioStore.getState().updateMicrophoneState(mic);
      eventBus.emit(normalizeMicrophone(mic, 'MICROPHONE_DISCONNECTED'));
      throw err;
    }
  }

  private setupDeviceListener(): void {
    if (typeof window === 'undefined') return;

    this.onDeviceChangeCallback = () => {
      eventBus.emit(normalizeMicrophone(
        { connected: !!this.activeStream, muted: false, confidence: 1.0 },
        'MICROPHONE_DEVICE_CHANGED'
      ));
    };

    navigator.mediaDevices.addEventListener('devicechange', this.onDeviceChangeCallback);
  }

  stop(): void {
    if (this.activeStream) {
      this.activeStream.getTracks().forEach((track) => track.stop());
      this.activeStream = null;
    }

    if (this.onDeviceChangeCallback) {
      navigator.mediaDevices.removeEventListener('devicechange', this.onDeviceChangeCallback);
      this.onDeviceChangeCallback = null;
    }
  }

  getStream(): MediaStream | null {
    return this.activeStream;
  }
}

export const microphoneService = new MicrophoneService();
export default microphoneService;
