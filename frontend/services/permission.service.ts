import { PermissionStatus } from '../types/permission';

export class PermissionService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  isBrowserSupported(): boolean {
    if (!this.isBrowser()) return false;
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  async checkPermission(name: 'camera' | 'microphone'): Promise<PermissionStatus> {
    if (!this.isBrowser()) return 'prompt';

    try {
      // Query permissions API if supported
      if (navigator.permissions && navigator.permissions.query) {
        const permissionName = name === 'camera' ? 'camera' as PermissionName : 'microphone' as PermissionName;
        const result = await navigator.permissions.query({ name: permissionName });
        return result.state as PermissionStatus;
      }
    } catch (e) {
      console.warn('Permissions API query not supported or failed:', e);
    }

    return 'prompt';
  }

  async requestPermissions(): Promise<{ camera: boolean; microphone: boolean }> {
    if (!this.isBrowserSupported()) {
      return { camera: false, microphone: false };
    }

    let cameraGranted = false;
    let microphoneGranted = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Stop stream immediately after acquiring permissions
      stream.getTracks().forEach((track) => track.stop());
      cameraGranted = true;
      microphoneGranted = true;
    } catch (err: any) {
      console.warn('Dual permission request failed. Trying individually...', err);

      // Try camera individually
      try {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
        camStream.getTracks().forEach((track) => track.stop());
        cameraGranted = true;
      } catch (camErr) {
        console.error('Camera access denied:', camErr);
      }

      // Try microphone individually
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream.getTracks().forEach((track) => track.stop());
        microphoneGranted = true;
      } catch (micErr) {
        console.error('Microphone access denied:', micErr);
      }
    }

    return { camera: cameraGranted, microphone: microphoneGranted };
  }
}

export const permissionService = new PermissionService();
export default permissionService;
