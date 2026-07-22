import React, { useState, useEffect, useRef } from 'react';
import { useRiskStore } from '../store/useRiskStore';
import { useRisk } from '../hooks/useRisk';
import { riskRecorder } from '../services/RiskRecorder';
import { RiskWeights } from '../config/RiskWeights';
import {
  ShieldAlert,
  Eye,
  EyeOff,
  Minimize2,
  Trash2,
  Cpu,
  Clock,
  Download,
  AlertTriangle,
  Play,
  Pause,
} from 'lucide-react';
import { Card } from '../../../components/ui/card';

export const RiskConsole: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Dimensions (Resizable state)
  const [width, setWidth] = useState(480);
  const [height, setHeight] = useState(550);
  const isResizingRef = useRef(false);

  const streamEndRef = useRef<HTMLDivElement>(null);

  const {
    currentAssessment,
    assessmentTimeline,
    riskFactors,
    statistics,
    clearRisk,
  } = useRiskStore();

  useRisk(); // Activate risk coordinator subscription hook

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
  const [displayedTimeline, setDisplayedTimeline] = useState(assessmentTimeline);
  useEffect(() => {
    if (!isPaused) {
      setDisplayedTimeline(assessmentTimeline);
    }
  }, [assessmentTimeline, isPaused]);

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
        className="fixed bottom-14 left-[1020px] z-50 flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-zinc-950 text-rose-400 hover:text-rose-300 font-extrabold text-xs tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <ShieldAlert className="w-4 h-4 animate-pulse" />
        <span>RISK CONSOLE</span>
      </button>
    );
  }

  return (
    <Card
      style={{ width: `${width}px`, height: `${height}px` }}
      className="fixed bottom-14 left-[1020px] z-50 border border-zinc-800 bg-zinc-950/98 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden text-zinc-300"
    >
      {/* Resize Handle (Top-Left corner drag area) */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize border-t-2 border-l-2 border-zinc-800 hover:border-rose-500 z-50"
      />

      {/* Header */}
      <header className="px-4 py-3 border-b border-zinc-900 flex items-center justify-between select-none bg-zinc-950">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Risk Assessment Console
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold font-mono">
            AGGREGATOR
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded hover:bg-zinc-900 text-xs font-semibold ${
              autoScroll ? 'text-rose-400' : 'text-zinc-500'
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

      {/* Overall Assessment Banner */}
      <section className={`p-4 border-b text-center font-mono flex flex-col items-center justify-center select-none ${
        currentAssessment?.overallRisk === 'CRITICAL'
          ? 'bg-rose-950/20 border-rose-900/40 text-rose-400'
          : currentAssessment?.overallRisk === 'HIGH'
          ? 'bg-orange-950/20 border-orange-900/40 text-orange-400'
          : currentAssessment?.overallRisk === 'MODERATE'
          ? 'bg-amber-950/20 border-amber-900/40 text-amber-400'
          : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400'
      }`}>
        <AlertTriangle className="w-5 h-5 mb-1" />
        <span className="text-[10px] uppercase font-bold tracking-widest">Overall Risk Assessment</span>
        <span className="text-xl font-extrabold tracking-wider">{currentAssessment?.overallRisk || 'LOW'}</span>
        <span className="text-[9px] text-zinc-500 mt-1">Total Weight: {currentAssessment?.totalContribution || 0} | Confidence: {currentAssessment ? Math.round(currentAssessment.averageConfidence * 100) : 0}%</span>
      </section>

      {/* Weight Configurations Info Drawer */}
      <section className="grid grid-cols-4 gap-1 p-2 bg-zinc-950 border-b border-zinc-900/60 font-mono text-[8px] text-zinc-500 select-none">
        <div className="text-center p-1 border border-zinc-900 rounded">
          <span>Gaze: {RiskWeights.OFF_SCREEN_ATTENTION}</span>
        </div>
        <div className="text-center p-1 border border-zinc-900 rounded">
          <span>Focus: {RiskWeights.BROWSER_FOCUS_LOST}</span>
        </div>
        <div className="text-center p-1 border border-zinc-900 rounded">
          <span>Face: {RiskWeights.MULTIPLE_FACES_PRESENT}</span>
        </div>
        <div className="text-center p-1 border border-zinc-900 rounded">
          <span>Audio: {RiskWeights.LOW_AUDIO_LEVEL}</span>
        </div>
      </section>

      {/* Contribution Breakdown */}
      <section className="p-3 border-b border-zinc-900 bg-zinc-950/40 select-none">
        <span className="text-zinc-600 block text-[8px] uppercase font-extrabold mb-2 tracking-wider">Contribution Factors</span>
        {riskFactors.length === 0 ? (
          <span className="text-[10px] text-zinc-500 italic block py-1 font-mono">No active risk factors recorded.</span>
        ) : (
          <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
            {riskFactors.map((rf) => (
              <div
                key={rf.id}
                className="flex items-center justify-between p-1.5 border border-zinc-900 bg-zinc-900/10 rounded-md text-[9px] font-mono text-zinc-300"
              >
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-zinc-200">{rf.category}</span>
                  <span className="text-zinc-500 text-[8px]">({rf.supportingEvidence.length} Evidences)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-500">Weight: {rf.configuredWeight}</span>
                  <span className="font-bold text-rose-400">+{rf.contribution}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Control bar */}
      <div className="p-3 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 font-bold">
          <span>Assessment History ({displayedTimeline.length})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => riskRecorder.exportToJSON(assessmentTimeline)}
            className="p-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => riskRecorder.exportToCSV(assessmentTimeline)}
            className="p-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold"
            title="Export CSV"
          >
            CSV
          </button>
          <button
            onClick={clearRisk}
            className="p-1.5 rounded border border-zinc-800 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400"
            title="Clear Assessments"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Timeline Stream Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-zinc-950 font-mono text-[9px] leading-relaxed">
        {displayedTimeline.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-600">
            <span>No risk assessments calculated.</span>
          </div>
        ) : (
          displayedTimeline.map((evt) => {
            const isHighOrCritical = evt.overallRisk === 'HIGH' || evt.overallRisk === 'CRITICAL';
            return (
              <div
                key={evt.id}
                className={`p-2.5 border rounded-lg ${
                  isHighOrCritical
                    ? 'border-rose-950/40 bg-rose-950/5 text-rose-300'
                    : 'border-zinc-900/60 bg-zinc-900/10 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-zinc-500 font-semibold border-b border-zinc-900/40 pb-1">
                  <span>
                    [{evt.id}] {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-1.5 rounded uppercase font-extrabold text-[8px] ${
                    isHighOrCritical ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {evt.overallRisk}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-200 uppercase tracking-wide">
                    Contribution: {evt.totalContribution}
                  </span>
                </div>
                <div className="mt-0.5 text-zinc-400 text-[8.5px]">
                  {evt.summary}
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-zinc-900/60 flex items-center justify-between text-zinc-500 text-[8px]">
                  <span>Reasons: {evt.primaryReasons.join(', ')}</span>
                  <span>Confidence: {Math.round(evt.averageConfidence * 100)}%</span>
                </div>
                <div className="mt-1 text-zinc-650 break-all text-[7.5px]">
                  Consolidated Evidences: {JSON.stringify(evt.supportingEvidence)}
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
          <Cpu className="w-3 h-3 text-zinc-500" />
          <span>Evaluated count: {statistics.assessmentsEvaluatedCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-zinc-500" />
          <span>Evaluation Time: {statistics.processingTimeMs} ms</span>
        </div>
      </footer>
    </Card>
  );
});

RiskConsole.displayName = 'RiskConsole';
export default RiskConsole;
