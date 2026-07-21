'use client';

import React from 'react';
import { InterviewLayout } from '../../shared/components/InterviewLayout';
import { ShieldCheck, Calendar, Activity, ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <InterviewLayout>
      <div className="space-y-8 py-6 select-none">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100">Reviewer Analytics Console</h1>
            <p className="text-xs text-zinc-500 mt-1">Audit verification timeline and integrity logs of completed sessions.</p>
          </div>
          <Link href="/interview" passHref>
            <button className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-950/20 transition-all duration-200">
              <span>Launch Mock Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </header>

        {/* Dashboard Statistics Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 border border-zinc-900 bg-zinc-950/30 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-zinc-500">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Completed Sessions</span>
            </div>
            <p className="text-2xl font-extrabold text-zinc-200">12</p>
            <p className="text-[10px] text-zinc-500">Last 7 Days</p>
          </div>

          <div className="p-5 border border-zinc-900 bg-zinc-950/30 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Pass Rate</span>
            </div>
            <p className="text-2xl font-extrabold text-zinc-200">91.6%</p>
            <p className="text-[10px] text-emerald-500">No anomalies detected</p>
          </div>

          <div className="p-5 border border-zinc-900 bg-zinc-950/30 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-zinc-500">
              <Activity className="w-4 h-4 text-pink-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Biometric Telemetries</span>
            </div>
            <p className="text-2xl font-extrabold text-zinc-200">Ready</p>
            <p className="text-[10px] text-zinc-500">Phase 2 integration boundary active</p>
          </div>
        </section>

        {/* Architecture blueprint notice */}
        <section className="p-6 border border-zinc-900 bg-zinc-950/15 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2.5">
            <Layers className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-bold text-zinc-200">Future Biometric Analytics Pipeline</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            Phase 2 will integrate face verification, eye-tracking deviation charts, and speech analytics stream graphs on this dashboard. The timeline playback engine utilizes the Event Bus telemetry schema created in Phase 1.
          </p>
          <div className="border border-zinc-800 rounded-xl overflow-hidden font-mono text-[9px] text-zinc-500 bg-zinc-950">
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 text-zinc-400 flex items-center justify-between">
              <span>upcoming_telemetry_schema.json</span>
              <span className="text-violet-400 uppercase font-bold tracking-widest text-[8px]">Blueprint</span>
            </div>
            <div className="p-4 space-y-1.5 leading-normal">
              <div>{`{`}</div>
              <div className="pl-4">{`"session_id": "sess_09A",`}</div>
              <div className="pl-4">{`"risk_timeline": [`}</div>
              <div className="pl-8 text-rose-400">{`{ "timestamp": 124, "type": "GAZE_OUT_OF_BOUNDS", "confidence": 0.94 },`}</div>
              <div className="pl-8 text-rose-400">{`{ "timestamp": 182, "type": "MULTIPLE_FACES_DETECTED", "confidence": 0.99 }`}</div>
              <div className="pl-4">{`],`}</div>
              <div className="pl-4">{`"integrity_score": 0.85`}</div>
              <div>{`}`}</div>
            </div>
          </div>
        </section>
      </div>
    </InterviewLayout>
  );
}
