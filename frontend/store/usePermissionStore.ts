import { create } from 'zustand';
import { PermissionStatus } from '../types/permission';
import { eventService } from '../services/event.service';

interface PermissionState {
  cameraPermission: PermissionStatus;
  microphonePermission: PermissionStatus;
  browserSupported: boolean;
  setCameraPermission: (status: PermissionStatus) => void;
  setMicrophonePermission: (status: PermissionStatus) => void;
  setBrowserSupported: (supported: boolean) => void;
  syncPermissions: (cam: PermissionStatus, mic: PermissionStatus) => void;
}

export const usePermissionStore = create<PermissionState>((set) => ({
  cameraPermission: 'prompt',
  microphonePermission: 'prompt',
  browserSupported: true,

  setCameraPermission: (status) => {
    set((state) => {
      if (state.cameraPermission !== status) {
        eventService.emit('PERMISSION_CHANGED', { type: 'camera', from: state.cameraPermission, to: status });
      }
      return { cameraPermission: status };
    });
  },

  setMicrophonePermission: (status) => {
    set((state) => {
      if (state.microphonePermission !== status) {
        eventService.emit('PERMISSION_CHANGED', { type: 'microphone', from: state.microphonePermission, to: status });
      }
      return { microphonePermission: status };
    });
  },

  setBrowserSupported: (supported) => set({ browserSupported: supported }),

  syncPermissions: (cam, mic) => {
    set((state) => {
      if (state.cameraPermission !== cam || state.microphonePermission !== mic) {
        eventService.emit('PERMISSION_CHANGED', { camera: cam, microphone: mic });
      }
      return {
        cameraPermission: cam,
        microphonePermission: mic,
      };
    });
  },
}));

export default usePermissionStore;
