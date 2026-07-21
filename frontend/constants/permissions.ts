export const PERMISSION_TYPES = {
  CAMERA: 'camera' as const,
  MICROPHONE: 'microphone' as const,
};

export const BROWSER_REQUIREMENTS = {
  MIN_CAMERA_RESOLUTION: { width: 640, height: 480 },
  AUDIO_CONSTRAINTS: { echoCancellation: true, noiseSuppression: true },
};
