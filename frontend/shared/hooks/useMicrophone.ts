import { useState, useEffect, useCallback } from 'react';
import { MicrophoneState } from '../../types/interview';
import { microphoneService } from '../../services/microphone.service';
import { useSettingsStore } from '../../store/useSettingsStore';
import { usePermissionStore } from '../../store/usePermissionStore';

export function useMicrophone() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<MicrophoneState>('muted');
  const [error, setError] = useState<string | null>(null);
  const microphoneEnabled = useSettingsStore((state) => state.microphoneEnabled);
  const setMicrophonePermission = usePermissionStore((state) => state.setMicrophonePermission);

  const startMicrophone = useCallback(async () => {
    if (!microphoneEnabled) {
      microphoneService.stopMicrophoneStream();
      setStream(null);
      setStatus('muted');
      return;
    }

    try {
      const micStream = await microphoneService.getMicrophoneStream();
      setStream(micStream);
      setStatus('connected');
      setMicrophonePermission('granted');
      setError(null);
    } catch (err: any) {
      console.error('useMicrophone start failed:', err);
      setStream(null);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatus('unavailable');
        setMicrophonePermission('denied');
        setError('Microphone permission denied.');
      } else {
        setStatus('unavailable');
        setError(err.message || 'Failed to start microphone.');
      }
    }
  }, [microphoneEnabled, setMicrophonePermission]);

  const stopMicrophone = useCallback(() => {
    microphoneService.stopMicrophoneStream();
    setStream(null);
    setStatus('muted');
  }, []);

  useEffect(() => {
    startMicrophone();

    return () => {
      microphoneService.stopMicrophoneStream();
    };
  }, [startMicrophone]);

  return {
    stream,
    status,
    error,
    startMicrophone,
    stopMicrophone,
  };
}

export default useMicrophone;
