import React from 'react';
import { usePermissionStore } from '../../store/usePermissionStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { Video, Mic, Wifi, WifiOff, LayoutGrid, CheckCircle2, XCircle } from 'lucide-react';

export const BottomStatusBar: React.FC = React.memo(() => {
  const cameraPermission = usePermissionStore((state) => state.cameraPermission);
  const microphonePermission = usePermissionStore((state) => state.microphonePermission);
  const browserSupported = usePermissionStore((state) => state.browserSupported);

  const cameraEnabled = useSettingsStore((state) => state.cameraEnabled);
  const microphoneEnabled = useSettingsStore((state) => state.microphoneEnabled);

  const isOnline = useNetworkStatus();

  return (
    <footer className="h-10 px-6 border-t border-zinc-900 bg-zinc-950/70 backdrop-blur-md flex items-center justify-between text-[11px] font-semibold text-zinc-500 select-none">
      <div className="flex items-center space-x-5">
        {/* Camera Indicator */}
        <div className="flex items-center space-x-1.5">
          <Video className="w-3.5 h-3.5 text-zinc-400" />
          <span>Camera:</span>
          {cameraPermission === 'granted' && cameraEnabled ? (
            <span className="text-emerald-400 font-bold flex items-center">
              Active
            </span>
          ) : (
            <span className="text-zinc-600 font-bold">Offline</span>
          )}
        </div>

        {/* Microphone Indicator */}
        <div className="flex items-center space-x-1.5">
          <Mic className="w-3.5 h-3.5 text-zinc-400" />
          <span>Mic:</span>
          {microphonePermission === 'granted' && microphoneEnabled ? (
            <span className="text-emerald-400 font-bold flex items-center">
              Active
            </span>
          ) : (
            <span className="text-zinc-600 font-bold">Offline</span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-5">
        {/* Network status */}
        <div className="flex items-center space-x-1.5">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-400 font-bold">No Internet</span>
            </>
          )}
        </div>

        {/* Browser support status */}
        <div className="flex items-center space-x-1.5 border-l border-zinc-900 pl-5">
          <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
          <span>Browser:</span>
          {browserSupported ? (
            <span className="text-emerald-400 font-bold flex items-center">
              <CheckCircle2 className="w-3 h-3 ml-1 text-emerald-400" />
            </span>
          ) : (
            <span className="text-rose-400 font-bold flex items-center">
              <XCircle className="w-3 h-3 ml-1 text-rose-400" />
            </span>
          )}
        </div>
      </div>
    </footer>
  );
});

BottomStatusBar.displayName = 'BottomStatusBar';
export default BottomStatusBar;
