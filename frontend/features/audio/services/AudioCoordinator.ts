import { microphoneService } from './MicrophoneService';
import { AudioFrameProcessor } from '../processors/AudioFrameProcessor';
import { voiceActivityService } from './VoiceActivityService';
import { responseLatencyExtractor } from '../extractors/ResponseLatencyExtractor';
import { useAudioStore } from '../../../store/useAudioStore';

export class AudioCoordinator {
  private frameProcessor: AudioFrameProcessor | null = null;
  private stream: MediaStream | null = null;

  async start(): Promise<void> {
    try {
      // 1. Get mic stream via MicrophoneService
      this.stream = await microphoneService.requestMicrophone();

      // 2. Setup AudioFrameProcessor
      this.frameProcessor = new AudioFrameProcessor(this.stream);
      this.frameProcessor.start();

      // 3. Setup Extractors & Service states
      voiceActivityService.reset();
      responseLatencyExtractor.start();

      useAudioStore.getState().setAudioRunning(true);
    } catch (err) {
      console.error('AudioCoordinator failed to start:', err);
      this.stop();
      throw err;
    }
  }

  pause(): void {
    if (this.frameProcessor) {
      this.frameProcessor.stop();
    }
    voiceActivityService.reset();
  }

  resume(): void {
    if (this.frameProcessor) {
      this.frameProcessor.start();
    }
  }

  stop(): void {
    if (this.frameProcessor) {
      this.frameProcessor.stop();
      this.frameProcessor = null;
    }

    microphoneService.stop();
    responseLatencyExtractor.stop();
    this.stream = null;

    useAudioStore.getState().setAudioRunning(false);
  }
}

export const audioCoordinator = new AudioCoordinator();
export default audioCoordinator;
