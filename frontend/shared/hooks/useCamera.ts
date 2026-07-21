import { useState, useEffect, useCallback } from 'react';
import { CameraState } from '../../types/interview';
import { cameraService } from '../../services/camera.service';
import { useSettingsStore } from '../../store/useSettingsStore';
import { usePermissionStore } from '../../store/usePermissionStore';

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraState>('loading');
  const [error, setError] = useState<string | null>(null);
  const cameraEnabled = useSettingsStore((state) => state.cameraEnabled);
  const setCameraPermission = usePermissionStore((state) => state.setCameraPermission);

  const startCamera = useCallback(async () => {
    if (!cameraEnabled) {
      cameraService.stopCameraStream();
      setStream(null);
      setStatus('disconnected');
      return;
    }

    setStatus('loading');
    try {
      const camStream = await cameraService.getCameraStream();
      setStream(camStream);
      setStatus('connected');
      setCameraPermission('granted');
      setError(null);
    } catch (err: any) {
      console.error('useCamera start failed:', err);
      setStream(null);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatus('denied');
        setCameraPermission('denied');
        setError('Camera permission denied.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setStatus('unavailable');
        setError('No camera device found.');
      } else {
        setStatus('disconnected');
        setError(err.message || 'Failed to start camera.');
      }
    }
  }, [cameraEnabled, setCameraPermission]);

  const stopCamera = useCallback(() => {
    cameraService.stopCameraStream();
    setStream(null);
    setStatus('disconnected');
  }, []);

  useEffect(() => {
    startCamera();

    return () => {
      // Don't stop streaming globally unless component unmounts
      cameraService.stopCameraStream();
    };
  }, [startCamera]);

  return {
    stream,
    status,
    error,
    startCamera,
    stopCamera,
  };
}

export default useCamera;
