import { audioCoordinator } from './AudioCoordinator';
import { useAudioStore } from '../../../store/useAudioStore';
import { eventBus } from '../../../events/eventBus';
import { normalizeLifecycle, resetAudioEventCounter } from '../normalizers/AudioNormalizer';

export class AudioLifecycleService {
  async start(): Promise<void> {
    if (useAudioStore.getState().audioRunning) return;

    resetAudioEventCounter();
    useAudioStore.getState().clearAudioEvents();

    try {
      await audioCoordinator.start();
      eventBus.emit(normalizeLifecycle('AUDIO_STARTED'));
    } catch (err: any) {
      console.error('AudioLifecycleService failed to start:', err);
      eventBus.emit({
        version: 1,
        id: 'evt_aud_init_err',
        timestamp: new Date().toISOString(),
        category: 'Audio',
        source: 'Microphone',
        type: 'AUDIO_INITIALIZATION_FAILED',
        severity: 'error',
        confidence: 0.0,
        payload: { error: err.message || 'Microphone stream blocked' },
      });
      useAudioStore.getState().setInitError(err.message || 'Microphone access failed.');
      throw err;
    }
  }

  pause(): void {
    if (!useAudioStore.getState().audioRunning) return;

    audioCoordinator.pause();
    eventBus.emit(normalizeLifecycle('AUDIO_PAUSED'));
  }

  resume(): void {
    if (!useAudioStore.getState().audioRunning) return;

    audioCoordinator.resume();
    eventBus.emit(normalizeLifecycle('AUDIO_RESUMED'));
  }

  stop(): void {
    if (!useAudioStore.getState().audioRunning) return;

    audioCoordinator.stop();
    eventBus.emit(normalizeLifecycle('AUDIO_STOPPED'));
  }
}

export const audioLifecycleService = new AudioLifecycleService();
export default audioLifecycleService;
