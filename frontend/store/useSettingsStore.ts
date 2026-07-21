import { create } from 'zustand';
import { storageService } from '../services/storage.service';
import { eventService } from '../services/event.service';

interface SettingsState {
  theme: 'light' | 'dark';
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
  animationsEnabled: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setCameraEnabled: (enabled: boolean) => void;
  setMicrophoneEnabled: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  loadSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',
  cameraEnabled: true,
  microphoneEnabled: true,
  animationsEnabled: true,

  setTheme: (theme) => {
    set((state) => {
      storageService.saveTheme(theme);
      eventService.emit('SETTINGS_UPDATED', { type: 'theme', from: state.theme, to: theme });
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
      }
      return { theme };
    });
  },

  setCameraEnabled: (enabled) => {
    set((state) => {
      const prefs = {
        cameraEnabled: enabled,
        microphoneEnabled: state.microphoneEnabled,
        animationsEnabled: state.animationsEnabled,
      };
      storageService.savePreferences(prefs);
      eventService.emit(enabled ? 'CAMERA_ENABLED' : 'CAMERA_DISABLED');
      return { cameraEnabled: enabled };
    });
  },

  setMicrophoneEnabled: (enabled) => {
    set((state) => {
      const prefs = {
        cameraEnabled: state.cameraEnabled,
        microphoneEnabled: enabled,
        animationsEnabled: state.animationsEnabled,
      };
      storageService.savePreferences(prefs);
      eventService.emit(enabled ? 'MICROPHONE_ENABLED' : 'MICROPHONE_DISABLED');
      return { microphoneEnabled: enabled };
    });
  },

  setAnimationsEnabled: (enabled) => {
    set((state) => {
      const prefs = {
        cameraEnabled: state.cameraEnabled,
        microphoneEnabled: state.microphoneEnabled,
        animationsEnabled: enabled,
      };
      storageService.savePreferences(prefs);
      eventService.emit('SETTINGS_UPDATED', { type: 'animations', from: state.animationsEnabled, to: enabled });
      return { animationsEnabled: enabled };
    });
  },

  loadSettings: () => {
    const theme = storageService.loadTheme();
    const prefs = storageService.loadPreferences();
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    if (prefs) {
      set({
        theme,
        cameraEnabled: prefs.cameraEnabled,
        microphoneEnabled: prefs.microphoneEnabled,
        animationsEnabled: prefs.animationsEnabled !== undefined ? prefs.animationsEnabled : true,
      });
    } else {
      set({ theme });
    }
  },
}));

export default useSettingsStore;
