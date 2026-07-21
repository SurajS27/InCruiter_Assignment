import React, { useState, useEffect, useRef } from 'react';
import { useAudioStore } from '../../../store/useAudioStore';
import { useAudio } from '../hooks/useAudio';
import {
  Mic,
  MicOff,
  Eye,
  EyeOff,
  Minimize2,
  Trash2,
  Volume2,
  Cpu,
  Clock,
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { audioLifecycleService } from '../services/AudioLifecycleService';

export const AudioConsole: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Dimensions (Resizable state)
  const [width, setWidth] = useState(480);
  const [height, setHeight] = useState(550);
  const isResizingRef = useRef(false);

  const streamEndRef = useRef<HTMLDivElement>(null);

  const {
    currentAudioLevel,
    speakingState,
    speechConfidence,
    speakingDuration,
    silenceDuration,
    longestSilence,
    averageResponseDelay,
    microphoneState,
    statistics,
    events,
    audioRunning,
    initError,
    clearAudioEvents,
  } = useAudioStore();

  useAudio(); // Activate audio event bus recorder subscription hook

  // Handle Resize Mouse Events
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = Math.max(380, Math.min(800, window.innerWidth - e.clientX));
    const newHeight = Math.max(300, Math.min(800, window.innerHeight - e.clientY));
    setWidth(newWidth);
    setHeight(newHeight);
  };

  const stopResize = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  // Buffer events when paused
  const [displayedEvents, setDisplayedEvents] = useState(events);
  useEffect(() => {
    if (!isPaused) {
      setDisplayedEvents(events);
    }
  }, [events, isPaused]);

  // Scroll to bottom
  useEffect(() => {
    if (autoScroll && streamEndRef.current) {
      streamEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedEvents, autoScroll]);

  // Dev mode constraint check
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-14 left-[520px] z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-zinc-950 text-emerald-400 hover:text-emerald-300 font-extrabold text-xs tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Volume2 className="w-4 h-4 animate-pulse" />
        <span>AUDIO CONSOLE</span>
      </button>
    );
  }

  return (
    <Card
      style={{ width: `${width}px`, height: `${height}px` }}
      className="fixed bottom-14 left-[520px] z-50 border border-zinc-800 bg-zinc-950/98 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden text-zinc-300"
    >
      {/* Resize Handle (Top-Left corner drag area) */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize border-t-2 border-l-2 border-zinc-800 hover:border-emerald-500 z-50"
      />

      {/* Header */}
      <header className="px-4 py-3 border-b border-zinc-900 flex items-center justify-between select-none bg-zinc-950">
        <div className="flex items-center space-x-2">
          {microphoneState.muted ? (
            <MicOff className="w-4 h-4 text-rose-400 animate-pulse" />
          ) : (
            <Mic className="w-4 h-4 text-emerald-400" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Audio SDK Console
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold font-mono">
            ACTIVE
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded hover:bg-zinc-900 text-xs font-semibold ${
              autoScroll ? 'text-emerald-400' : 'text-zinc-500'
            }`}
            title="Auto Scroll"
          >
            {autoScroll ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-1.5 rounded hover:bg-zinc-900 text-xs ${
              isPaused ? 'text-amber-400' : 'text-zinc-500'
            }`}
            title={isPaused ? 'Resume Stream' : 'Pause Stream'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {initError ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-zinc-950">
          <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertCircle className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-200">Audio Initialization Failed</h3>
            <p className="text-[10px] text-zinc-500 max-w-[280px] leading-relaxed break-words font-mono">
              {initError}
            </p>
          </div>
          <button
            onClick={() => audioLifecycleService.start()}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : (
        <>
          {/* Audio processing statistics */}
          <section className="grid grid-cols-4 gap-1 p-2 bg-zinc-950 border-b border-zinc-900/60 font-mono text-[9px] text-zinc-400">
            <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
              <span className="text-zinc-600 block">LEVEL</span>
              <span className="font-extrabold text-zinc-200">{Math.round(currentAudioLevel)} db</span>
            </div>
            <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
              <span className="text-zinc-600 block">SPEAKING</span>
              <span className="font-extrabold text-emerald-400">{speakingState ? 'YES' : 'NO'}</span>
            </div>
            <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
              <span className="text-zinc-600 block">SPEAK TIME</span>
              <span className="font-extrabold text-zinc-200">{Math.round(statistics.speakingTime)}s</span>
            </div>
            <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
              <span className="text-zinc-600 block">SILENT TIME</span>
              <span className="font-extrabold text-amber-500">{Math.round(statistics.silenceTime)}s</span>
            </div>
          </section>

          {/* Measurement Panel */}
          <section className="p-4 border-b border-zinc-900 bg-zinc-950/40 grid grid-cols-2 gap-4 text-[10px] font-mono select-none">
            <div className="space-y-2">
              <div>
                <span className="text-zinc-600 block text-[8px] uppercase font-bold">Microphone Status</span>
                <div className="flex justify-between mt-0.5">
                  <span>Connected:</span>
                  <span className={microphoneState.connected ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {microphoneState.connected ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>
                <div className="flex justify-between mt-0.5">
                  <span>Mute Switch:</span>
                  <span className={microphoneState.muted ? 'text-rose-400 font-bold' : 'text-zinc-500 font-semibold'}>
                    {microphoneState.muted ? 'MUTED' : 'UNMUTED'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-zinc-600 block text-[8px] uppercase font-bold">Speech Latency</span>
                <div className="flex justify-between mt-0.5">
                  <span>Avg Response Delay:</span>
                  <span className="text-zinc-200 font-bold">{Math.round(averageResponseDelay / 100) / 10}s</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-zinc-600 block text-[8px] uppercase font-bold">Speech Confidence</span>
                <div className="flex justify-between mt-0.5">
                  <span>Confidence:</span>
                  <span className="text-zinc-200 font-bold">{Math.round(speechConfidence * 100)}%</span>
                </div>
              </div>
              <div>
                <span className="text-zinc-600 block text-[8px] uppercase font-bold">Silence Durations</span>
                <div className="flex justify-between mt-0.5">
                  <span>Current:</span>
                  <span className="text-zinc-400">{Math.round(silenceDuration / 100) / 10}s</span>
                </div>
                <div className="flex justify-between mt-0.5">
                  <span>Longest:</span>
                  <span className="text-zinc-200 font-bold">{Math.round(longestSilence / 100) / 10}s</span>
                </div>
              </div>
            </div>
          </section>

          {/* Control Bar */}
          <div className="p-3 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between select-none">
            <div className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] text-zinc-400 font-bold">Bursts: {statistics.speechBurstCount} | Peak: {Math.round(statistics.peakAudioLevel)} db</span>
            </div>
            <button
              onClick={clearAudioEvents}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded border border-zinc-800 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-[10px] font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear logs</span>
            </button>
          </div>

          {/* Stream Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-zinc-950 font-mono text-[9px] leading-relaxed">
            {displayedEvents.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-600">
                <span>No audio telemetry logs.</span>
              </div>
            ) : (
              displayedEvents.map((event) => {
                const isWarning = event.severity === 'warning';
                return (
                  <div
                    key={event.id}
                    className={`p-2 border rounded-lg ${
                      isWarning
                        ? 'border-amber-950/40 bg-amber-950/5 text-amber-300'
                        : 'border-zinc-900/60 bg-zinc-900/10 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 text-zinc-500 font-semibold border-b border-zinc-900/40 pb-1">
                      <span>
                        [{event.id}] {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="px-1 rounded uppercase font-bold text-[8px] bg-zinc-900 text-zinc-500">
                        Conf: {event.confidence}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-zinc-200 uppercase tracking-wide">
                        {event.type}
                      </span>
                    </div>
                    <div className="mt-1 text-zinc-500 break-all text-[8px]">
                      {JSON.stringify(event.payload)}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={streamEndRef} />
          </div>

          {/* Footer */}
          <footer className="h-6 px-4 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between text-[8px] text-zinc-600 select-none">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span>Lifecycle: {audioRunning ? 'RUNNING' : 'STOPPED'}</span>
            </div>
            <div>
              <span>Duration: {statistics.sessionDuration}s</span>
            </div>
          </footer>
        </>
      )}
    </Card>
  );
});

AudioConsole.displayName = 'AudioConsole';
export default AudioConsole;
