'use client';

import React from 'react';
import { InterviewLayout } from '../../shared/components/InterviewLayout';
import { Switch } from '../../components/ui/switch';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useInterviewStore } from '../../store/useInterviewStore';
import { useQuestionStore } from '../../store/useQuestionStore';
import { eventService } from '../../services/event.service';
import { Camera, Mic, Moon, Sun, RotateCcw, MonitorPlay, Settings } from 'lucide-react';

export default function SettingsPage() {
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
    }
  };

  return (
    <InterviewLayout>
      <div className="max-w-xl mx-auto py-8 space-y-8 select-none">
        <header className="border-b border-zinc-900 pb-5">
          <div className="flex items-center space-x-2.5">
            <Settings className="w-6 h-6 text-violet-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100">Global Config Settings</h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">Configure hardware inputs, visual adjustments, and state settings.</p>
        </header>

        <div className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">Dark Interface Mode</p>
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
                <p className="text-sm font-semibold text-zinc-200">Camera Telemetry Stream</p>
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
                <p className="text-sm font-semibold text-zinc-200">Microphone Input Track</p>
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
                <p className="text-sm font-semibold text-zinc-200">Fluid Graphic Transitions</p>
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
          <div className="pt-5 border-t border-zinc-900 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-rose-400">Force Reset Session</p>
              <p className="text-xs text-zinc-500">Reset timers, name, and question logs</p>
            </div>
            <button
              onClick={handleResetSession}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-rose-950 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-xs font-semibold transition-all duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>
    </InterviewLayout>
  );
}
