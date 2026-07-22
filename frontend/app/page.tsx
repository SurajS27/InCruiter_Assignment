'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '../store/useInterviewStore';
import { ArrowRight, User, ShieldAlert, Sparkles } from 'lucide-react';
import { InterviewLayout } from '../shared/components/InterviewLayout';

export default function LandingPage() {
  const router = useRouter();
  const [candidateNameInput, setCandidateNameInput] = useState('Sam');
  const [sessionIdInput, setSessionIdInput] = useState('mock-session-123');

  const startSession = (role: 'candidate' | 'interviewer') => {
    // Save to stores
    useInterviewStore.getState().setCandidateName(candidateNameInput);
    
    // Redirect to the respective dynamic route session pages
    router.push(`/${role}/session/${sessionIdInput}`);
  };

  return (
    <InterviewLayout>
      <div className="max-w-4xl mx-auto py-8 space-y-12 select-none font-sans text-zinc-300">
        
        {/* Title / Hero Header */}
        <section className="text-center max-w-2xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-bold uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collaboration Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-zinc-100">
            Interview Integrity Platform
          </h1>
          <p className="text-xs sm:text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
            Enter a session identifier and candidate name to launch the two-party collaborative interview room.
          </p>
        </section>

        {/* Input Form Fields Card */}
        <section className="max-w-md mx-auto p-6 border border-zinc-900 bg-zinc-950/40 rounded-2xl space-y-4 shadow-xl">
          <span className="text-[9px] font-mono text-zinc-550 font-bold uppercase tracking-widest block border-b border-zinc-900 pb-2">Session Parameters</span>
          
          <div className="space-y-3.5">
            {/* Candidate Name Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Candidate Name</label>
              <input
                type="text"
                value={candidateNameInput}
                onChange={(e) => setCandidateNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-900 bg-zinc-950/60 text-xs text-zinc-200 focus:outline-none focus:border-zinc-800 transition-colors"
                placeholder="Enter candidate name..."
              />
            </div>

            {/* Session ID Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono">Session ID</label>
              <input
                type="text"
                value={sessionIdInput}
                onChange={(e) => setSessionIdInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-900 bg-zinc-950/60 text-xs text-zinc-200 focus:outline-none focus:border-zinc-800 transition-colors font-mono"
                placeholder="Enter session ID..."
              />
            </div>
          </div>
        </section>

        {/* Role Selector Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Card 1: Candidate Application launch */}
          <div className="p-6 border border-zinc-900 bg-zinc-950/30 rounded-2xl hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-200">Candidate Interface</h3>
              <p className="text-xs text-zinc-550 leading-relaxed">
                Participate in the live interview workspace. Includes webcam feedback feeds and reactive question display panels. Completely isolates and hides all telemetry risk analysis.
              </p>
            </div>
            <button
              onClick={() => startSession('candidate')}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-950/20"
            >
              <span>Launch Candidate Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Interviewer Workspace launch */}
          <div className="p-6 border border-zinc-900 bg-zinc-950/30 rounded-2xl hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl w-fit">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-200">Interviewer Workspace</h3>
              <p className="text-xs text-zinc-550 leading-relaxed">
                Conduct and evaluate the live session. Features dual webcam feeds, scorecard metrics, markdown scratchpads, and real-time trace risk assessments and fused evidence tables.
              </p>
            </div>
            <button
              onClick={() => startSession('interviewer')}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-950/20"
            >
              <span>Launch Interviewer Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Development configuration tip footer */}
        <footer className="text-center text-[10px] text-zinc-650 font-mono select-none">
          <span>Incruiter Integrity Platform • Phase 7 Production Workspace Baseline</span>
        </footer>

      </div>
    </InterviewLayout>
  );
}
