'use client';

import React, { use, useEffect } from 'react';
import { useInterviewStore } from '../../../../store/useInterviewStore';
import { InterviewLayout } from '../../../../shared/components/InterviewLayout';
import { CandidateVideo } from '../../../../features/interviewer/components/CandidateVideo';
import { InterviewerVideo } from '../../../../features/interviewer/components/InterviewerVideo';
import { InterviewTimer } from '../../../../features/interview/components/InterviewTimer';
import { StatusBadge } from '../../../../features/interview/components/StatusBadge';
import { Radio, Award, PhoneOff, Video, Mic, Globe } from 'lucide-react';
import Link from 'next/link';

export default function CandidateSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = use(params);
  const sessionId = resolvedParams.sessionId;

  const {
    interviewRunning,
    interviewEndedAt,
    endInterview,
  } = useInterviewStore();

  // Auto-start interview session if not started
  useEffect(() => {
    if (!interviewRunning && !interviewEndedAt) {
      useInterviewStore.getState().startInterview();
    }
  }, [interviewRunning, interviewEndedAt]);

  // 1. Post-interview Session Completed State
  if (interviewEndedAt) {
    return (
      <InterviewLayout>
        <div className="max-w-md mx-auto py-12 text-center space-y-6 select-none font-sans">
          <div className="inline-flex p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-zinc-100 tracking-tight">Interview Left</h1>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
              You have successfully left the interview session. Your responses and stream telemetry feeds have been recorded.
            </p>
          </div>
          <div className="p-4 border border-zinc-900 bg-zinc-950/40 rounded-xl text-left text-xs text-zinc-500 space-y-2 font-mono">
            <div className="flex justify-between">
              <span>Session ID:</span>
              <span className="text-zinc-300 font-bold">{sessionId}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>
                <InterviewTimer />
              </span>
            </div>
          </div>
          <div className="pt-2">
            <Link href="/" passHref>
              <button className="px-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-bold transition-all duration-200">
                Return Home
              </button>
            </Link>
          </div>
        </div>
      </InterviewLayout>
    );
  }

  // 2. Active Candidate Interview Experience (Zoom/Meet Style)
  return (
    <InterviewLayout>
      <div className="max-w-6xl mx-auto py-4 space-y-4 font-sans select-none">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xs">
              IC
            </div>
            <span className="text-xs font-black text-zinc-250 uppercase tracking-widest">InCruiter Meet</span>
          </div>
          <div className="flex items-center space-x-3 text-[10px] font-mono text-zinc-500">
            <span className="flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>Session: {sessionId}</span>
            </span>
            <StatusBadge label="LIVE_WORKSPACE" status="success" />
          </div>
        </div>

        {/* Meeting Arena - Picture-in-Picture Video Container */}
        <div className="relative w-full aspect-video rounded-3xl border border-zinc-900 bg-zinc-950 overflow-hidden shadow-2xl">
          {/* Main Focus: Interviewer Video stream */}
          <div className="w-full h-full">
            <InterviewerVideo />
          </div>

          {/* Picture-in-Picture: Small floating Candidate self preview */}
          <div className="absolute bottom-6 right-6 w-52 sm:w-64 aspect-video rounded-2xl border border-zinc-800 bg-zinc-950/90 shadow-2xl overflow-hidden z-20 hover:scale-105 active:scale-95 transition-all duration-200">
            <CandidateVideo />
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-950/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Audio/Video Indicators */}
          <div className="flex items-center space-x-4 text-zinc-450 font-mono text-[10px]">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-850">
              <Video className="w-3.5 h-3.5 text-emerald-400" />
              <span>Camera: Active</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-850">
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mic: Connected</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-850">
              <Globe className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Network: Excellent</span>
            </div>
          </div>

          {/* Session Timer & Action buttons */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-850 text-xs font-mono font-bold text-zinc-350">
              <span>Timer:</span>
              <InterviewTimer />
            </div>

            <button
              onClick={endInterview}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-lg hover:shadow-rose-950/20 transition-all duration-200 uppercase"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Interview</span>
            </button>
          </div>
        </div>

      </div>
    </InterviewLayout>
  );
}
