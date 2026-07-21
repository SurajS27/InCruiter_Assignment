'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Cpu, Database, Sparkles, BookOpen } from 'lucide-react';
import { InterviewLayout } from '../shared/components/InterviewLayout';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../store/useSettingsStore';

export default function LandingPage() {
  const animationsEnabled = useSettingsStore((state) => state.animationsEnabled);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerProps = (animationsEnabled
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
      }
    : {}) as any;

  const cardHover = animationsEnabled
    ? 'hover:-translate-y-1 hover:border-zinc-700/60 hover:shadow-2xl hover:shadow-violet-950/5'
    : '';

  return (
    <InterviewLayout>
      <motion.div {...containerProps} className="space-y-16 py-8">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phase 1 Experience Foundation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-zinc-100">
            Interview Integrity <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Platform & Verification Engine
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            A production-quality environment designed with modularity, decoupling, and high separation of concerns. Scalable infrastructure built to support real-time telemetry, WebRTC feeds, and telemetry auditing.
          </p>

          <div className="pt-4 flex items-center justify-center space-x-4">
            <Link href="/interview" passHref>
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-violet-950/20 flex items-center space-x-2 transition-all duration-300">
                <span>Start Interview</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button variant="outline" size="lg" className="border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900 text-zinc-300 font-semibold px-6 py-6 rounded-xl">
                Analytics Console
              </Button>
            </Link>
          </div>
        </section>

        {/* Features / Details */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className={`p-6 border border-zinc-900 bg-zinc-950/30 rounded-2xl transition-all duration-300 ${cardHover}`}>
            <div className="p-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl w-fit mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-200 mb-2">Decoupled Services</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Camera, microphone, and permission APIs are abstracted behind clean service boundaries. Reusable hooks interface only with stores and services, avoiding browser API coupling.
            </p>
          </div>

          {/* Card 2 */}
          <div className={`p-6 border border-zinc-900 bg-zinc-950/30 rounded-2xl transition-all duration-300 ${cardHover}`}>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-200 mb-2">Telemetry Event Engine</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              An in-memory event bus captures all environment and settings changes in real-time. This timeline log is structured for recording replay and telemetry verification in future phases.
            </p>
          </div>

          {/* Card 3 */}
          <div className={`p-6 border border-zinc-900 bg-zinc-950/30 rounded-2xl transition-all duration-300 ${cardHover}`}>
            <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl w-fit mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-200 mb-2">Granular State Stores</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Zustand stores are separated into independent, optimized modules for settings, questions, session timers, and hardware state, preventing global component re-renders.
            </p>
          </div>
        </section>

        {/* Architecture Section */}
        <section className="p-8 border border-zinc-900 bg-zinc-950/20 rounded-2xl backdrop-blur-sm space-y-6">
          <div className="flex items-center space-x-2 text-zinc-200">
            <BookOpen className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-bold">Modularity & Extension Blueprint</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                This foundation is architected specifically so that downstream verification modules can be plugged directly into the stream, store, or event bus. Future telemetry additions require zero refactoring of the main layout, timers, or navigation loop.
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  <span>MediaPipe FaceMesh integration boundary on webcam stream hooks</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Biometric and audio risk telemetry hooks hooked to the Event Bus</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <span>Workspace security monitoring utilizing focus/blur event listeners</span>
                </div>
              </div>
            </div>
            {/* Visual placeholder of flow */}
            <div className="p-6 border border-zinc-800 bg-zinc-950 rounded-xl space-y-3 font-mono text-[10px] text-zinc-400">
              <div className="flex items-center justify-between text-zinc-500 pb-1 border-b border-zinc-900">
                <span>telemetry_pipeline.log</span>
                <span>Active</span>
              </div>
              <div><span className="text-violet-400">eventBus</span>.emit(<span className="text-emerald-400">&apos;SESSION_STARTED&apos;</span>, &apos;{`{ id: 'sess_09A' }`}&apos;)</div>
              <div><span className="text-zinc-500">{"// Extension hook trigger:"}</span></div>
              <div className="text-indigo-400">eyeTracker.on(&apos;gaze_anomaly&apos;, (point) =&gt; eventBus.emit(&apos;RISK_GAZE&apos;, point))</div>
              <div className="text-pink-400">audioEngine.on(&apos;ambient_voice&apos;, (level) =&gt; eventBus.emit(&apos;RISK_AUDIO&apos;, level))</div>
              <div className="text-emerald-400">&gt; timeline_events_stored: 8 events</div>
            </div>
          </div>
        </section>
      </motion.div>
    </InterviewLayout>
  );
}
