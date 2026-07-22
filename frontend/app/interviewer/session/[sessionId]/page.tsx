'use client';

import React, { use, useEffect } from 'react';
import { useInterviewStore } from '../../../../store/useInterviewStore';
import { useInterviewerStore } from '../../../../features/interviewer/store/useInterviewerStore';
import { useEvidenceStore } from '../../../../features/evidence/store/useEvidenceStore';
import { useRiskStore } from '../../../../features/risk/store/useRiskStore';
import { mockQuestionsBank } from '../../../../features/interviewer/services/QuestionBankService';
import { InterviewLayout } from '../../../../shared/components/InterviewLayout';
import { CandidateVideo } from '../../../../features/interviewer/components/CandidateVideo';
import { InterviewerVideo } from '../../../../features/interviewer/components/InterviewerVideo';
import { QuestionPanel } from '../../../../features/interviewer/components/QuestionPanel';
import { NotesPanel } from '../../../../features/interviewer/components/NotesPanel';
import { ScorecardPanel } from '../../../../features/interviewer/components/ScorecardPanel';
import { SessionStatus } from '../../../../features/interviewer/components/SessionStatus';
import { SessionControls } from '../../../../features/interviewer/components/SessionControls';
import { AssessmentPanel } from '../../../../features/interviewer/components/AssessmentPanel';
import { EvidencePanel } from '../../../../features/interviewer/components/EvidencePanel';
import { TimelinePanel } from '../../../../features/interviewer/components/TimelinePanel';
import { eventService } from '../../../../services/event.service';
import {
  ArrowLeft,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
  Printer,
  Download,
  Star,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

export default function InterviewerSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = use(params);
  const sessionId = resolvedParams.sessionId;

  const {
    interviewRunning,
    interviewStartedAt,
    interviewEndedAt,
    candidateName,
    resetSession,
  } = useInterviewStore();

  const {
    notes,
    scorecard,
    recommendation,
    clearInterviewerSession,
  } = useInterviewerStore();

  const currentAssessment = useRiskStore((state) => state.currentAssessment);
  const evidenceTimeline = useEvidenceStore((state) => state.timeline);

  // Auto-start interview session if not started
  useEffect(() => {
    if (!interviewRunning && !interviewEndedAt) {
      useInterviewStore.getState().startInterview();
    }
  }, [interviewRunning, interviewEndedAt]);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleResetAndStartNew = () => {
    resetSession();
    clearInterviewerSession();
    eventService.resetTimeline();
    useEvidenceStore.getState().clearEvidence();
    useRiskStore.getState().clearRisk();
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportJSON = () => {
    if (typeof window === 'undefined') return;
    const reportData = {
      sessionId,
      candidateName,
      start: interviewStartedAt,
      end: interviewEndedAt,
      scorecard,
      recommendation,
      notes,
      assessment: currentAssessment,
      evidences: evidenceTimeline,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `final_interview_report_${sessionId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 1. Post-interview Completed Final Evaluation Report View
  if (interviewEndedAt) {
    const overallScore = Math.round(
      (scorecard.technicalKnowledge +
        scorecard.problemSolving +
        scorecard.communication +
        scorecard.systemDesign +
        scorecard.cultureFit) / 5 * 10
    ) / 10;

    return (
      <InterviewLayout>
        <div className="max-w-4xl mx-auto py-8 space-y-8 select-none font-sans text-zinc-300 print:bg-white print:text-zinc-900 print:max-w-full">
          {/* Header Action toolbar (hidden during printing) */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 print:hidden">
            <h1 className="text-xl font-black text-zinc-100 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span>Final Interview & Evaluation Report</span>
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-bold transition-all duration-200"
              >
                <Printer className="w-4 h-4" />
                <span>Print Report</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-bold transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Section: Candidate & Recommendation Status Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overview */}
            <div className="p-6 border border-zinc-900 bg-zinc-950/40 rounded-2xl md:col-span-2 space-y-3 print:border-zinc-300">
              <span className="text-[9px] font-mono text-zinc-550 font-bold uppercase tracking-widest block">Candidate Information</span>
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="text-zinc-500 block">Candidate Name:</span>
                  <span className="text-zinc-200 font-bold text-sm">{candidateName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Session ID:</span>
                  <span className="text-zinc-200 font-mono font-semibold">{sessionId}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Start Time:</span>
                  <span>{formatTime(interviewStartedAt)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">End Time:</span>
                  <span>{formatTime(interviewEndedAt)}</span>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-6 border border-zinc-900 bg-zinc-950/40 rounded-2xl flex flex-col justify-between items-center text-center space-y-4 print:border-zinc-300">
              <span className="text-[9px] font-mono text-zinc-550 font-bold uppercase tracking-widest block">Manual Recommendation</span>
              <div className={`px-4 py-2.5 rounded-xl border text-sm font-extrabold uppercase tracking-wide ${
                recommendation === 'Strong Hire' || recommendation === 'Hire'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : recommendation === 'Needs Another Interview'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {recommendation || 'No Decision Registered'}
              </div>
              <div className="text-[10px] text-zinc-550 italic font-mono">
                Manual interviewer selection
              </div>
            </div>
          </div>

          {/* Grid: Evaluation scorecard and Scratchpad Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scorecard */}
            <div className="p-6 border border-zinc-900 bg-zinc-950/40 rounded-2xl space-y-4 print:border-zinc-300">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest flex items-center space-x-2 border-b border-zinc-900 pb-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Interviewer Scorecard ({overallScore}/10)</span>
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Technical Knowledge', val: scorecard.technicalKnowledge },
                  { label: 'Problem Solving', val: scorecard.problemSolving },
                  { label: 'Communication Skills', val: scorecard.communication },
                  { label: 'System Design', val: scorecard.systemDesign },
                  { label: 'Culture Fit', val: scorecard.cultureFit },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between border-b border-zinc-900/60 pb-2">
                    <span className="text-zinc-500">{s.label}:</span>
                    <span className="font-bold text-zinc-200">{s.val} / 10</span>
                  </div>
                ))}
              </div>
              {scorecard.comments && (
                <div className="pt-2">
                  <span className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Scorecard remarks:</span>
                  <p className="text-[11px] text-zinc-400 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-900 leading-relaxed font-sans">{scorecard.comments}</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="p-6 border border-zinc-900 bg-zinc-950/40 rounded-2xl space-y-4 print:border-zinc-300">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest flex items-center space-x-2 border-b border-zinc-900 pb-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Interviewer Session Notes</span>
              </h3>
              {notes.length === 0 ? (
                <p className="text-zinc-500 text-xs italic font-mono py-4">No custom notes recorded during evaluation.</p>
              ) : (
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 font-mono text-[10px]">
                  {notes.map((n) => {
                    const qObj = mockQuestionsBank.find((q) => q.id === n.questionId);
                    return (
                      <div key={n.id} className="p-2.5 border border-zinc-900 rounded-lg bg-zinc-950/40">
                        <span className="text-zinc-550 block text-[8px] mb-1">Linked Question: {qObj?.title || 'General'}</span>
                        <p className="text-zinc-300 leading-normal">{n.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Explainable Assessment Summary Panel */}
          <div className="p-6 border border-zinc-900 bg-zinc-950/40 rounded-2xl space-y-4 print:border-zinc-300">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest flex items-center space-x-2 border-b border-zinc-900 pb-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Telemetry Risk Assessment Summary</span>
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span>Assessment Level:</span>
                <span className="font-extrabold text-indigo-400">{currentAssessment?.overallRisk || 'LOW'}</span>
              </div>
              <div className="flex justify-between">
                <span>Telemetry Contribution Score:</span>
                <span>{currentAssessment?.totalContribution || 0} pts</span>
              </div>
              {currentAssessment?.summary && (
                <div className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl leading-relaxed italic text-zinc-400 text-[10.5px]">
                  {currentAssessment.summary}
                </div>
              )}
            </div>
          </div>

          {/* Reset toolbar */}
          <div className="flex items-center justify-center space-x-4 pt-4 print:hidden">
            <Link href="/" passHref>
              <button className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-sm font-bold transition-all duration-200">
                <ArrowLeft className="w-4 h-4" />
                <span>Return Home</span>
              </button>
            </Link>
            <button
              onClick={handleResetAndStartNew}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-950/20 transition-all duration-200"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Reset & New Interview</span>
            </button>
          </div>
        </div>
      </InterviewLayout>
    );
  }

  // 2. Active Interviewer Workspace layout
  return (
    <InterviewLayout>
      <div className="max-w-[1780px] mx-auto py-6 space-y-6 font-sans select-none">
        {/* Workspace Title bar */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xs">
              IC
            </div>
            <span className="text-sm font-black text-zinc-100 uppercase tracking-widest">Interviewer Workspace</span>
          </div>
          <span className="flex items-center space-x-1.5 text-[10px] font-mono text-zinc-550 font-bold bg-zinc-950/60 border border-zinc-900 px-3 py-1 rounded-xl">
            <span>Session: {sessionId}</span>
          </span>
        </div>

        {/* 3-Column Split Panel Layout (Responsive) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Equal-size responsive Webcams + Scorecard rating forms */}
          <section className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <CandidateVideo />
              <InterviewerVideo />
            </div>

            <ScorecardPanel />
            <SessionControls />
          </section>

          {/* Column 2: Question panels + Markdown scratchpads */}
          <section className="lg:col-span-4 space-y-6">
            <QuestionPanel />
            <NotesPanel />
            <SessionStatus />
          </section>

          {/* Column 3: Telemetry Assessments summaries + Evidence streams */}
          <section className="lg:col-span-4 space-y-6">
            <AssessmentPanel />
            <EvidencePanel />
            <TimelinePanel />
          </section>
        </div>
      </div>
    </InterviewLayout>
  );
}
