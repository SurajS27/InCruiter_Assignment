export type PermissionStatus = 'prompt' | 'granted' | 'denied';

export interface PermissionState {
  camera: PermissionStatus;
  microphone: PermissionStatus;
  browserSupported: boolean;
}
