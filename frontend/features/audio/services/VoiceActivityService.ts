import { speechActivityExtractor } from '../extractors/SpeechActivityExtractor';
import { normalizeSpeech } from '../normalizers/AudioNormalizer';
import { eventBus } from '../../../events/eventBus';
import { useAudioStore } from '../../../store/useAudioStore';
import { responseLatencyExtractor } from '../extractors/ResponseLatencyExtractor';
import { normalizeLatency } from '../normalizers/AudioNormalizer';

export class VoiceActivityService {
  private thresholdRms = 12; // Minimum RMS level to count as voice activity
  private speakingActive = false;
  private silenceFramesCount = 0;
  private speechFramesCount = 0;
  
  // Hangover window counts to avoid rapid toggle stuttering on short breath pauses
  private hangoverFramesLimit = 15; // ~750ms at 20 updates per second
  private onsetFramesLimit = 2; // Immediate start detection (~100ms)

  processVolumeSample(rms: number): void {
    const rawSpeaking = rms >= this.thresholdRms;
    
    if (rawSpeaking) {
      this.speechFramesCount++;
      this.silenceFramesCount = 0;

      if (!this.speakingActive && this.speechFramesCount >= this.onsetFramesLimit) {
        this.speakingActive = true;
        this.speechFramesCount = 0;
        
        // Emit Speech Start
        const measurement = speechActivityExtractor.extract(true, 0.94);
        useAudioStore.getState().updateSpeechState(true, 0.94);
        eventBus.emit(normalizeSpeech(measurement, 'SPEECH_STARTED'));

        // Attempt to register response latency
        const latency = responseLatencyExtractor.registerSpeechStart();
        if (latency) {
          eventBus.emit(normalizeLatency(latency));
          useAudioStore.getState().updateResponseDelay(responseLatencyExtractor.getAverageDelay());
        }
      }
    } else {
      this.silenceFramesCount++;
      this.speechFramesCount = 0;

      if (this.speakingActive && this.silenceFramesCount >= this.hangoverFramesLimit) {
        this.speakingActive = false;
        this.silenceFramesCount = 0;

        // Emit Speech End
        const measurement = speechActivityExtractor.extract(false, 0.94);
        useAudioStore.getState().updateSpeechState(false, 0.94);
        eventBus.emit(normalizeSpeech(measurement, 'SPEECH_ENDED'));
      }
    }

    // Continuously update rolling state counters (e.g. stats ticks)
    useAudioStore.getState().updateSpeechState(this.speakingActive, 0.95);
  }

  isSpeaking(): boolean {
    return this.speakingActive;
  }

  reset(): void {
    this.speakingActive = false;
    this.silenceFramesCount = 0;
    this.speechFramesCount = 0;
  }
}

export const voiceActivityService = new VoiceActivityService();
export default voiceActivityService;
