import { useAudioStore } from '../../../store/useAudioStore';
import { voiceActivityService } from '../services/VoiceActivityService';
import { audioLevelExtractor } from '../extractors/AudioLevelExtractor';
import { silenceExtractor } from '../extractors/SilenceExtractor';
import { speakingDurationExtractor } from '../extractors/SpeakingDurationExtractor';
import { normalizeAudioLevel, normalizeSilence } from '../normalizers/AudioNormalizer';
import { eventBus } from '../../../events/eventBus';

export class AudioFrameProcessor {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private intervalId: any = null;
  private active = false;

  constructor(mediaStream: MediaStream) {
    this.stream = mediaStream;
  }

  start(): void {
    if (this.active) return;
    this.active = true;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 512;

      this.sourceNode = this.audioContext.createMediaStreamSource(this.stream!);
      this.sourceNode.connect(this.analyserNode);

      // Start processing samples loop: 20 updates per second (50ms interval)
      const bufferLength = this.analyserNode.fftSize;
      const dataArray = new Float32Array(bufferLength);

      this.intervalId = setInterval(() => {
        if (!this.active || !this.analyserNode) return;

        const startProc = performance.now();
        this.analyserNode.getFloatTimeDomainData(dataArray);

        // 1. Calculate RMS Level
        let sumSquares = 0;
        let peak = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i];
          sumSquares += val * val;
          peak = Math.max(peak, Math.abs(val));
        }

        // Scale RMS to 0-100 range
        const rms = Math.sqrt(sumSquares / bufferLength) * 100;
        const peakScaled = peak * 100;
        const procLatency = performance.now() - startProc;

        // 2. Feed voice activity estimator
        voiceActivityService.processVolumeSample(rms);
        const speaking = voiceActivityService.isSpeaking();

        // 3. Update Audio Level Stats & Extractor
        const levelMeasurement = audioLevelExtractor.extract(rms, peakScaled);
        useAudioStore.getState().updateAudioLevel(levelMeasurement.averageLevel, levelMeasurement.peakLevel);
        
        // Periodic check to emit level warning
        if (levelMeasurement.levelCategory !== 'NORMAL' && Math.random() < 0.05) { // Throttled to ~1 per sec
          eventBus.emit(normalizeAudioLevel(levelMeasurement));
        }

        // 4. Update Silence Extractor & Events
        const silenceMeasurement = silenceExtractor.extract(speaking);
        useAudioStore.getState().updateSilenceDuration(silenceMeasurement.currentSilence, silenceMeasurement.longestSilence);
        
        if (silenceMeasurement.currentSilence > 10000 && Math.random() < 0.05) {
          eventBus.emit(normalizeSilence(silenceMeasurement, 'LONG_SILENCE'));
        } else if (silenceMeasurement.currentSilence > 2000 && Math.random() < 0.05) {
          eventBus.emit(normalizeSilence(silenceMeasurement, 'SHORT_SILENCE'));
        }

        // 5. Update Speaking Burst Extractor
        const speakingBurst = speakingDurationExtractor.extract(speaking);
        useAudioStore.getState().updateSpeakingDuration(speakingBurst.currentBurst);

        // 6. Update Frame Statistics
        useAudioStore.getState().updateStatistics((prev) => ({
          framesProcessed: prev.framesProcessed + 1,
          averageAudioLevel: Math.round(((prev.averageAudioLevel * prev.framesProcessed + rms) / (prev.framesProcessed + 1)) * 10) / 10,
          peakAudioLevel: Math.max(prev.peakAudioLevel, peakScaled),
          speakingTime: speaking ? prev.speakingTime + 0.05 : prev.speakingTime,
          silenceTime: !speaking ? prev.silenceTime + 0.05 : prev.silenceTime,
        }));

      }, 50);

    } catch (err) {
      console.error('AudioFrameProcessor failed to start context:', err);
      useAudioStore.getState().updateStatistics((prev) => ({
        framesSkipped: prev.framesSkipped + 1,
      }));
    }
  }

  stop(): void {
    this.active = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }

    if (this.audioContext) {
      try {
        if (this.audioContext.state !== 'closed') {
          this.audioContext.close();
        }
      } catch (e) {
        console.warn('Error closing AudioContext:', e);
      }
      this.audioContext = null;
    }
  }
}

export default AudioFrameProcessor;
