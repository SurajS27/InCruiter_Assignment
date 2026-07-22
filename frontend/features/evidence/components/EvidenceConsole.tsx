import React, { useState, useEffect, useRef } from 'react';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { useEvidence } from '../hooks/useEvidence';
import { evidenceRecorder } from '../services/EvidenceRecorder';
import {
  Terminal,
  Activity,
  Eye,
  EyeOff,
  Minimize2,
  Trash2,
  GitBranch,
  Cpu,
  Clock,
  Download,
  Play,
  Pause,
} from 'lucide-react';
import { Card } from '../../../components/ui/card';

export const EvidenceConsole: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Dimensions (Resizable state)
  const [width, setWidth] = useState(480);
  const [height, setHeight] = useState(550);
  const isResizingRef = useRef(false);

  const streamEndRef = useRef<HTMLDivElement>(null);

  const {
    activeEvidence,
    historicalEvidence,
    timeline,
    statistics,
    clearEvidence,
  } = useEvidenceStore();

  useEvidence(); // Activate evidence subscription correlation hooks

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
  const [displayedTimeline, setDisplayedTimeline] = useState(timeline);
  useEffect(() => {
    if (!isPaused) {
      setDisplayedTimeline(timeline);
    }
  }, [timeline, isPaused]);

  // Scroll to bottom
  useEffect(() => {
    if (autoScroll && streamEndRef.current) {
      streamEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedTimeline, autoScroll]);

  // Dev mode constraint check
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-14 right-[520px] z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-zinc-950 text-indigo-400 hover:text-indigo-300 font-extrabold text-xs tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <GitBranch className="w-4 h-4 animate-pulse" />
        <span>EVIDENCE CONSOLE</span>
      </button>
    );
  }

  return (
    <Card
      style={{ width: `${width}px`, height: `${height}px` }}
      className="fixed bottom-14 right-[520px] z-50 border border-zinc-800 bg-zinc-950/98 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden text-zinc-300"
    >
      {/* Resize Handle (Top-Left corner drag area) */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize border-t-2 border-l-2 border-zinc-800 hover:border-indigo-500 z-50"
      />

      {/* Header */}
      <header className="px-4 py-3 border-b border-zinc-900 flex items-center justify-between select-none bg-zinc-950">
        <div className="flex items-center space-x-2">
          <GitBranch className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Evidence Fusion Console
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold font-mono">
            REASONING
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
            title={isPaused ? 'Pause Stream' : 'Resume Stream'}
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

      {/* Correlator statistics */}
      <section className="grid grid-cols-4 gap-1 p-2 bg-zinc-950 border-b border-zinc-900/60 font-mono text-[9px] text-zinc-400">
        <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
          <span className="text-zinc-600 block">OBSERVATIONS</span>
          <span className="font-extrabold text-zinc-200">{statistics.evidenceCount}</span>
        </div>
        <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
          <span className="text-zinc-600 block">ACTIVE</span>
          <span className="font-extrabold text-indigo-400">{statistics.activeCount}</span>
        </div>
        <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
          <span className="text-zinc-600 block">EVALUATIONS</span>
          <span className="font-extrabold text-zinc-200">{statistics.rulesEvaluatedCount}</span>
        </div>
        <div className="p-1.5 border border-zinc-900 rounded bg-zinc-900/20 text-center">
          <span className="text-zinc-600 block">LATENCY</span>
          <span className="font-extrabold text-amber-500">{statistics.processingTimeMs} ms</span>
        </div>
      </section>

      {/* Active Evidence List Pane */}
      <section className="p-3 border-b border-zinc-900 bg-zinc-950/40 select-none">
        <span className="text-zinc-600 block text-[8px] uppercase font-extrabold mb-2 tracking-wider">Active Observations</span>
        {activeEvidence.length === 0 ? (
          <span className="text-[10px] text-zinc-500 italic block py-1 font-mono">No active ongoing observations.</span>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto">
            {activeEvidence.map((e) => (
              <div
                key={e.id}
                className="px-2 py-1 border border-indigo-950 bg-indigo-950/20 rounded-md text-[9px] font-mono text-indigo-300 flex items-center space-x-1.5 animate-pulse"
              >
                <Activity className="w-3 h-3 text-indigo-400" />
                <span>{e.type} ({e.duration}s)</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Control bar */}
      <div className="p-3 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 font-bold">
          <span>Observed History ({historicalEvidence.length} closed)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => evidenceRecorder.exportToJSON(timeline)}
            className="p-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => evidenceRecorder.exportToCSV(timeline)}
            className="p-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold"
            title="Export CSV"
          >
            CSV
          </button>
          <button
            onClick={clearEvidence}
            className="p-1.5 rounded border border-zinc-800 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Timeline Stream Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-zinc-950 font-mono text-[9px] leading-relaxed">
        {displayedTimeline.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-600">
            <span>No evidence fusion events recorded.</span>
          </div>
        ) : (
          displayedTimeline.map((evt) => {
            const isHigh = evt.severity === 'high';
            return (
              <div
                key={evt.id}
                className={`p-2.5 border rounded-lg ${
                  isHigh
                    ? 'border-rose-950/40 bg-rose-950/5 text-rose-300'
                    : 'border-zinc-900/60 bg-zinc-900/10 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-zinc-500 font-semibold border-b border-zinc-900/40 pb-1">
                  <span>
                    [{evt.id}] {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-1.5 rounded uppercase font-extrabold text-[8px] ${
                    evt.status === 'ACTIVE' ? 'bg-indigo-500/10 text-indigo-400 animate-pulse' : 'bg-zinc-900 text-zinc-500'
                  }`}>
                    {evt.status}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-200 uppercase tracking-wide">
                    {evt.title}
                  </span>
                </div>
                <div className="mt-0.5 text-zinc-400">
                  {evt.description}
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-zinc-900/60 grid grid-cols-2 gap-2 text-zinc-500 text-[8px]">
                  <div>
                    <span>Rule: {evt.generatedBy} (v{evt.ruleVersion})</span>
                  </div>
                  <div className="text-right">
                    <span>Confidence: {Math.round(evt.confidence * 100)}%</span>
                  </div>
                </div>
                <div className="mt-1 text-zinc-600 break-all text-[7.5px]">
                  Supporting events: {JSON.stringify(evt.supportingEvents)}
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
          <span>Active Observations Window: 30s</span>
        </div>
        <div>
          <span>Confidence Avg: {statistics.averageConfidence}</span>
        </div>
      </footer>
    </Card>
  );
});

EvidenceConsole.displayName = 'EvidenceConsole';
export default EvidenceConsole;
