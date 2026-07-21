import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useVisionStore } from '../../../store/useVisionStore';
import { useVision } from '../hooks/useVision';
import {
  Terminal,
  Activity,
  Eye,
  EyeOff,
  Minimize2,
  Trash2,
  TrendingUp,
  Cpu,
  Clock,
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { visionLifecycleService } from '../services/VisionLifecycleService';

export const VisionConsole: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Dimensions (Resizable state)
  const [width, setWidth] = useState(480);
  const [height, setHeight] = useState(550);
  const isResizingRef = useRef(false);

  const streamEndRef = useRef<HTMLDivElement>(null);

  const {
    latestHeadPose,
    latestGazeDirection,
    latestBlinkRate,
    faceCount,
    facePresent,
    trackingConfidence,
    statistics,
    events,
    visionRunning,
    clearVisionEvents,
    initError,
  } = useVisionStore();

  useVision(); // Activate vision event bus recorder subscription hook

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
        className="fixed bottom-14 left-6 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-zinc-950 text-indigo-400 hover:text-indigo-300 font-extrabold text-xs tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <TrendingUp className="w-4 h-4 animate-pulse" />
        <span>VISION CONSOLE</span>
      </button>
    );
  }

  return (
    <Card
      style={{ width: `${width}px`, height: `${height}px` }}
      className="fixed bottom-14 left-6 z-50 border border-zinc-800 bg-zinc-950/98 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden text-zinc-300"
    >
      {/* Resize Handle (Top-Left corner drag area) */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize border-t-2 border-l-2 border-zinc-800 hover:border-indigo-500 z-50"
      />

      {/* Header */}
      <header className="px-4 py-3 border-b border-zinc-900 flex items-center justify-between select-none bg-zinc-950">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Vision SDK Console
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold font-mono">
            ACTIVE
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded hover:bg-zinc-900 text-xs font-semibold ${
              autoScroll ? 'text-indigo-400' : 'text-zinc-500'
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
            <h3 className="text-sm font-bold text-zinc-200">Vision Initialization Failed</h3>
            <p className="text-[10px] text-zinc-500 max-w-[280px] leading-relaxed break-words font-mono">
              {initError}
            </p>
          </div>
          <button
            onClick={() => visionLifecycleService.retry()}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-lg active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : (
        <>
          {/* Frame Processor statistics */}
          <section className="grid grid-cols-4 gap-1 p-2 bg-zinc-950 border-b border-zinc-900/60 font-mono text-[9px] text-zinc-400">
            <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
              <span className="text-zinc-600 block">FPS</span>
              <span className="font-extrabold text-zinc-200">{statistics.averageFps} hz</span>
            </div>
            <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
              <span className="text-zinc-600 block">LATENCY</span>
              <span className="font-extrabold text-indigo-400">{statistics.averageProcessingTime} ms</span>
            </div>
            <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
              <span className="text-zinc-600 block">PROCESSED</span>
              <span className="font-extrabold text-zinc-200">{statistics.framesProcessed}</span>
            </div>
            <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
              <span className="text-zinc-600 block">SKIPPED</span>
              <span className="font-extrabold text-amber-500">{statistics.framesSkipped}</span>
            </div>
          </section>

          {/* Feature Measurement Panel */}
          <section className="p-4 border-b border-zinc-900 bg-zinc-950/40 grid grid-cols-2 gap-4 text-[10px] font-mono select-none">
            <div className="space-y-2">
              <div>
                <span className="text-zinc-600 block text-[8px] uppercase font-bold">Face Status</span>
                <div className="flex justify-between mt-0.5">
                  <span>Present:</span>
                  <span className={facePresent ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {facePresent ? 'DETECTED' : 'LOST'}
                  </span>
                </div>
                <div className="flex justify-between mt-0.5">
                  <span>Face Count:</span>
                  <span className="text-zinc-200 font-semibold">{faceCount}</span>
                </div>
              </div>
              <div>
                <span className="text-zinc-600 block text-[8px] uppercase font-bold">Eye Gaze Direction</span>
                <div className="flex justify-between mt-0.5">
                  <span>Direction:</span>
                  <span className={latestGazeDirection?.direction === 'Center' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {latestGazeDirection?.direction || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-zinc-600 block text-[8px] uppercase font-bold">Head Rotation Angles</span>
                <div className="grid grid-cols-3 gap-1 text-center mt-0.5 text-zinc-400">
                  <div className="border border-zinc-900 rounded bg-zinc-950/50 p-1">
                    <span>Yaw</span>
                    <span className="block text-zinc-200 font-bold">{latestHeadPose?.yaw || 0}°</span>
                  </div>
                  <div className="border border-zinc-900 rounded bg-zinc-950/50 p-1">
                    <span>Pitch</span>
                    <span className="block text-zinc-200 font-bold">{latestHeadPose?.pitch || 0}°</span>
                  </div>
                  <div className="border border-zinc-900 rounded bg-zinc-950/50 p-1">
                    <span>Roll</span>
                    <span className="block text-zinc-200 font-bold">{latestHeadPose?.roll || 0}°</span>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-zinc-600 block text-[8px] uppercase font-bold">Blink Analytics</span>
                <div className="flex justify-between mt-0.5">
                  <span>Blink Frequency:</span>
                  <span className="text-zinc-200 font-semibold">{latestBlinkRate?.rate || 0} bpm</span>
                </div>
              </div>
            </div>
          </section>

          {/* Control Bar */}
          <div className="p-3 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between select-none">
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] text-zinc-400 font-bold">Tracking Confidence: {Math.round(trackingConfidence * 100)}%</span>
            </div>
            <button
              onClick={clearVisionEvents}
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
                <span>No vision telemetry logs.</span>
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
              <span>Lifecycle: {visionRunning ? 'RUNNING' : 'STOPPED'}</span>
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

VisionConsole.displayName = 'VisionConsole';
export default VisionConsole;
