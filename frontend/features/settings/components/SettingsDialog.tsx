import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Switch } from '../../../components/ui/switch';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useInterviewStore } from '../../../store/useInterviewStore';
import { useQuestionStore } from '../../../store/useQuestionStore';
import { eventService } from '../../../services/event.service';
import { Camera, Mic, Moon, Sun, RotateCcw, MonitorPlay } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = React.memo(({
  open,
  onOpenChange,
}) => {
  const {
    theme,
    cameraEnabled,
    microphoneEnabled,
    animationsEnabled,
    setTheme,
    setCameraEnabled,
    setMicrophoneEnabled,
    setAnimationsEnabled,
  } = useSettingsStore();

  const resetInterviewSession = useInterviewStore((state) => state.resetSession);
  const resetQuestions = useQuestionStore((state) => state.resetQuestions);

  const handleResetSession = () => {
    if (confirm('Are you sure you want to reset the current interview session? This resets all progress, timers, and questions.')) {
      resetInterviewSession();
      resetQuestions();
      eventService.resetTimeline();
      eventService.emit('SETTINGS_UPDATED', { action: 'session_reset' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-950/95 backdrop-blur-xl text-zinc-100 max-w-sm sm:max-w-md rounded-2xl">
        <DialogHeader className="border-b border-zinc-800 pb-3">
          <DialogTitle className="text-lg font-bold text-zinc-100 flex items-center space-x-2">
            <span>Interview Environment Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-5">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">Dark Interface</p>
                <p className="text-xs text-zinc-500">Toggle light/dark visualization</p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>

          {/* Camera Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">Camera Feed</p>
                <p className="text-xs text-zinc-500">Enable or disable webcam preview</p>
              </div>
            </div>
            <Switch
              checked={cameraEnabled}
              onCheckedChange={setCameraEnabled}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>

          {/* Microphone Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">Microphone Input</p>
                <p className="text-xs text-zinc-500">Enable audio stream track</p>
              </div>
            </div>
            <Switch
              checked={microphoneEnabled}
              onCheckedChange={setMicrophoneEnabled}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>

          {/* Animations Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                <MonitorPlay className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">Fluid Animations</p>
                <p className="text-xs text-zinc-500">Enable transitions and motions</p>
              </div>
            </div>
            <Switch
              checked={animationsEnabled}
              onCheckedChange={setAnimationsEnabled}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>

          {/* Session Reset */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-rose-400">Reset Session</p>
              <p className="text-xs text-zinc-500">Clear timer, name, and question logs</p>
            </div>
            <button
              onClick={handleResetSession}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-rose-950 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-xs font-semibold transition-all duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Now</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

SettingsDialog.displayName = 'SettingsDialog';
export default SettingsDialog;
