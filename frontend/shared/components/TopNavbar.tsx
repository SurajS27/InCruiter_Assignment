import React from 'react';
import { Settings, Shield, Play, Square } from 'lucide-react';
import { useClock } from '../hooks/useClock';
import { useInterviewStore } from '../../store/useInterviewStore';

interface TopNavbarProps {
  onOpenSettings: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = React.memo(({ onOpenSettings }) => {
  const clockTime = useClock();
  const interviewRunning = useInterviewStore((state) => state.interviewRunning);
  const interviewStartedAt = useInterviewStore((state) => state.interviewStartedAt);

  const getStatusLabel = () => {
    if (interviewRunning) {
      return (
        <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Session</span>
        </span>
      );
    }
    if (interviewStartedAt) {
      return (
        <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-bold">
          <Square className="w-3 h-3 fill-rose-500" />
          <span>Session Ended</span>
        </span>
      );
    }
    return (
      <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs font-bold">
        <Play className="w-3 h-3 fill-zinc-400" />
        <span>Pre-interview</span>
      </span>
    );
  };

  return (
    <nav className="h-16 px-6 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3 group">
        <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-900/10 group-hover:scale-105 transition-all duration-300">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-zinc-100 tracking-tight leading-none">
            InCruiter Integrity
          </span>
          <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">
            Platform Engine
          </span>
        </div>
      </div>

      {/* Clock & Status */}
      <div className="flex items-center space-x-4">
        {getStatusLabel()}
        <div className="hidden sm:flex px-3 py-1 rounded-lg border border-zinc-900 bg-zinc-950/40 text-xs font-bold text-zinc-400 font-mono">
          {clockTime || '--:--:--'}
        </div>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 active:scale-95 transition-all duration-200"
          aria-label="Open settings panel"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
});

TopNavbar.displayName = 'TopNavbar';
export default TopNavbar;
