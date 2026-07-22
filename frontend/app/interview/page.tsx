'use client';

import React, { useEffect } from 'react';
import { useInterviewStore } from '../../store/useInterviewStore';
import { useQuestionStore } from '../../store/useQuestionStore';
import { useQuestions } from '../../shared/hooks/useQuestions';
import { InterviewLayout } from '../../shared/components/InterviewLayout';
import { CameraPreview } from '../../features/interview/components/CameraPreview';
import { QuestionCard } from '../../features/interview/components/QuestionCard';
import { NotesPanel } from '../../features/interview/components/NotesPanel';
import { ActionButtons } from '../../features/interview/components/ActionButtons';
import { InterviewTimer } from '../../features/interview/components/InterviewTimer';
import { PermissionDialog } from '../../features/permissions/components/PermissionDialog';
import { eventService } from '../../services/event.service';
import { StatusBadge } from '../../features/interview/components/StatusBadge';
import { User, Award, ArrowLeft, RefreshCcw, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { useVisionStore } from '../../store/useVisionStore';
import { useAudioStore } from '../../store/useAudioStore';
import { useEvidenceStore } from '../../features/evidence/store/useEvidenceStore';

export default function InterviewRoomPage() {
  const {
    interviewRunning,
    interviewStartedAt,
    interviewEndedAt,
    candidateName,
    endInterview,
    resetSession,
  } = useInterviewStore();

  const {
    questions,
    currentQuestionIndex,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    hasNext,
    hasPrevious,
  } = useQuestions();

  const resetQuestions = useQuestionStore((state) => state.resetQuestions);

  // Monitor tab change blur/focus events for security logging simulation
  useEffect(() => {
    if (!interviewRunning) return;

    const handleBlur = () => {
      eventService.emit('WINDOW_BLURRED', { description: 'Candidate switched tabs or left application focus' });
    };

    const handleFocus = () => {
      eventService.emit('WINDOW_FOCUSED', { description: 'Candidate returned to application focus' });
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [interviewRunning]);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleResetAndStartNew = () => {
    resetSession();
    resetQuestions();
    eventService.resetTimeline();
    useTelemetryStore.getState().clearEvents();
    useVisionStore.getState().clearVisionEvents();
    useAudioStore.getState().clearAudioEvents();
    useEvidenceStore.getState().clearEvidence();
  };

  // 1. Pre-interview State: Prompt for Permissions and Candidate name
  if (!interviewRunning && !interviewEndedAt) {
    return (
      <InterviewLayout>
        <PermissionDialog />
      </InterviewLayout>
    );
  }

  // 2. Interview Completed Summary State
  if (interviewEndedAt) {
    const timeline = eventService.getEventTimeline();
    const evidenceTimeline = useEvidenceStore.getState().timeline;

    return (
      <InterviewLayout>
        <div className="max-w-2xl mx-auto py-8 space-y-8 select-none">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
              <Award className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
              Session Completed
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Well done, {candidateName}! Your interview response data and hardware telemetries have been recorded.
            </p>
          </div>

          {/* Session Overview Card */}
          <div className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest border-b border-zinc-900 pb-2">
              Session Telemetry Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-zinc-400 text-xs">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-zinc-500">Candidate Name</p>
                <p className="text-zinc-200 font-semibold">{candidateName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-zinc-500">Start Time</p>
                <p className="text-zinc-200 font-semibold">{formatTime(interviewStartedAt)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-zinc-500">End Time</p>
                <p className="text-zinc-200 font-semibold">{formatTime(interviewEndedAt)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-zinc-500">System Logs Collected</p>
                <p className="text-violet-400 font-bold">{timeline.length} events logged</p>
              </div>
            </div>
          </div>

          {/* Fused Evidence Observations Report Card */}
          <div className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest flex items-center space-x-2">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                <span>Evidence Observations Report</span>
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold font-mono">
                {evidenceTimeline.length} Observations
              </span>
            </div>
            
            {evidenceTimeline.length === 0 ? (
              <p className="text-zinc-500 text-xs italic font-mono py-2">
                No high-level evidence observations were recorded during this session.
              </p>
            ) : (
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2 font-mono text-[10px]">
                {evidenceTimeline.map((evidence) => {
                  const isHigh = evidence.severity === 'high';
                  return (
                    <div
                      key={evidence.id}
                      className={`p-3 border rounded-xl space-y-2 ${
                        isHigh
                          ? 'border-rose-950/40 bg-rose-950/5 text-rose-300'
                          : 'border-zinc-900/60 bg-zinc-900/10 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-zinc-900/40 pb-1.5 text-zinc-500 font-semibold">
                        <span>[{evidence.id}] {evidence.type}</span>
                        <span className={`px-1.5 rounded uppercase font-bold text-[8px] ${
                          isHigh ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-900 text-zinc-500'
                        }`}>
                          {evidence.severity}
                        </span>
                      </div>
                      <div className="text-zinc-200 font-bold text-xs uppercase tracking-wide">
                        {evidence.title}
                      </div>
                      <div className="text-zinc-400 text-xs">
                        {evidence.description}
                      </div>
                      <div className="pt-1.5 border-t border-zinc-900/40 flex items-center justify-between text-zinc-500 text-[9px]">
                        <span>Confidence: {Math.round(evidence.confidence * 100)}%</span>
                        <span>Duration: {evidence.duration}s</span>
                      </div>
                      <div className="text-zinc-600 text-[8px] break-all">
                        Supporting events: {JSON.stringify(evidence.supportingEvents)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real-time Telemetry Timeline Playback (Decoupled compatibility demonstration) */}
          <div className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest border-b border-zinc-900 pb-2">
              Recorded Timeline Logs
            </h3>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 font-mono text-[10px] leading-normal">
              {timeline.map((event) => (
                <div key={event.id} className="flex items-start space-x-2 border-b border-zinc-900 pb-2">
                  <span className="text-zinc-600">[{new Date(event.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-violet-400 font-semibold">{event.type}</span>
                  <span className="text-zinc-400 truncate max-w-sm">
                    {JSON.stringify(event.payload)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-4">
            <Link href="/" passHref>
              <button className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-sm font-bold transition-all duration-200">
                <ArrowLeft className="w-4 h-4" />
                <span>Return Home</span>
              </button>
            </Link>
            <button
              onClick={handleResetAndStartNew}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold shadow-lg shadow-violet-950/20 transition-all duration-200"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Reset & Test Again</span>
            </button>
          </div>
        </div>
      </InterviewLayout>
    );
  }

  // 3. Active Interview State
  return (
    <InterviewLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start py-4 select-none">
        {/* Left Side: Telemetry / Webcam Stream Panel */}
        <section className="lg:col-span-5 space-y-6">
          <CameraPreview />

          {/* Device Telemetry Card */}
          <div className="p-5 border border-zinc-800 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center space-x-2">
              <User className="w-4 h-4 text-violet-400" />
              <span>Workspace telemetry</span>
            </h3>

            <div className="space-y-3.5 text-zinc-300 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2">
                <span className="text-zinc-500">Candidate Name</span>
                <span className="font-semibold text-zinc-200">{candidateName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2">
                <span className="text-zinc-500">Video Device State</span>
                <StatusBadge label="ACTIVE_PREVIEW" status="success" />
              </div>
              <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2">
                <span className="text-zinc-500">Audio Stream Track</span>
                <StatusBadge label="STREAMING" status="success" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-zinc-500">Current Session Duration</span>
                <InterviewTimer />
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Questions & Action Panel */}
        <section className="lg:col-span-7 space-y-6">
          <QuestionCard
            question={currentQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />

          <ActionButtons
            onNext={nextQuestion}
            onPrev={previousQuestion}
            onEnd={endInterview}
            hasNext={hasNext}
            hasPrev={hasPrevious}
          />

          <NotesPanel />
        </section>
      </div>
    </InterviewLayout>
  );
}
