import React, { useState, useEffect } from 'react';
import { TopNavbar } from './TopNavbar';
import { BottomStatusBar } from './BottomStatusBar';
import { SettingsDialog } from '../../features/settings/components/SettingsDialog';
import { useSettingsStore } from '../../store/useSettingsStore';
import { eventLogger } from '../../events/logger';
import { useBrowserTelemetry } from '../../features/telemetry/hooks/useBrowserTelemetry';
import { TelemetryConsole } from '../../features/telemetry/components/TelemetryConsole';

import { VisionConsole } from '../../features/vision/components/VisionConsole';
import { useAudioLifecycle } from '../../features/audio/hooks/useAudioLifecycle';
import { AudioConsole } from '../../features/audio/components/AudioConsole';

interface InterviewLayoutProps {
  children: React.ReactNode;
}

export const InterviewLayout: React.FC<InterviewLayoutProps> = ({ children }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const theme = useSettingsStore((state) => state.theme);

  // Activate browser telemetry and audio lifecycle hooks
  useBrowserTelemetry();
  useAudioLifecycle();

  useEffect(() => {
    // Load persisted settings
    loadSettings();

    // Start event logger output
    eventLogger.startLogging();

    return () => {
      eventLogger.stopLogging();
    };
  }, [loadSettings]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950 text-zinc-100 dark' : 'bg-zinc-50 text-zinc-900 light'}`}>
      {/* Dynamic Aesthetic Background Gradients */}
      {theme === 'dark' ? (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/10 via-zinc-950 to-zinc-950 pointer-events-none z-0" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100/30 via-zinc-50 to-zinc-50 pointer-events-none z-0" />
      )}

      {/* Navigation Header */}
      <TopNavbar onOpenSettings={() => setSettingsOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 relative">
        {children}
      </main>

      {/* Status Bar Footer */}
      <BottomStatusBar />

      {/* Environment Config Modal */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Collapsible Telemetry Dev Console */}
      <TelemetryConsole />

      {/* Collapsible Vision Dev Console */}
      <VisionConsole />

      {/* Collapsible Audio Dev Console */}
      <AudioConsole />
    </div>
  );
};

export default InterviewLayout;
