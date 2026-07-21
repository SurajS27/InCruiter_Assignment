/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from 'react';
import { Camera, CameraOff, AlertCircle, RefreshCw } from 'lucide-react';
import { useCamera } from '../../../shared/hooks/useCamera';
import { useInterviewStore } from '../../../store/useInterviewStore';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { StatusBadge } from './StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';

import { useVisionLifecycle } from '../../vision/hooks/useVisionLifecycle';

export const CameraPreview: React.FC = React.memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, status, error, startCamera } = useCamera();
  const candidateName = useInterviewStore((state) => state.candidateName);
  const cameraEnabled = useSettingsStore((state) => state.cameraEnabled);
  const animationsEnabled = useSettingsStore((state) => state.animationsEnabled);

  // Drive MediaPipe Landmarker loop on the connected camera video stream
  useVisionLifecycle(videoRef, status === 'connected');

  useEffect(() => {
    if (videoRef.current && stream && cameraEnabled) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, cameraEnabled]);

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return <StatusBadge label="Live Feed" status="success" />;
      case 'loading':
        return <StatusBadge label="Connecting..." status="info" />;
      case 'denied':
        return <StatusBadge label="Permission Denied" status="error" />;
      case 'unavailable':
        return <StatusBadge label="No Hardware Found" status="error" />;
      case 'disconnected':
      default:
        return <StatusBadge label="Camera Off" status="warning" />;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animationProps = (animationsEnabled
    ? {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.3 },
      }
    : {}) as any;

  return (
    <div className="relative w-full aspect-video rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl group">
      {/* Video Stream */}
      {status === 'connected' && cameraEnabled && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />
      )}

      {/* Overlay & States */}
      <AnimatePresence mode="wait">
        {(!cameraEnabled || status !== 'connected') && (
          <motion.div
            key={status}
            {...animationProps}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-zinc-950/90 text-center z-10"
          >
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 rounded-full border-t-2 border-violet-500 border-zinc-800 animate-spin" />
                <p className="text-zinc-400 text-sm">Accessing camera stream...</p>
              </div>
            )}

            {status === 'denied' && (
              <div className="flex flex-col items-center space-y-3 max-w-xs">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-zinc-200 font-semibold text-sm">Permission Denied</h4>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Please enable camera access in your browser site settings and click Retry below.
                </p>
                <button
                  onClick={startCamera}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-all duration-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Request</span>
                </button>
              </div>
            )}

            {status === 'unavailable' && (
              <div className="flex flex-col items-center space-y-3 max-w-xs">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-zinc-200 font-semibold text-sm">Camera Unavailable</h4>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  No video input device could be initialized. Please attach a camera and retry.
                </p>
              </div>
            )}

            {status === 'disconnected' && (
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-full">
                  <CameraOff className="w-6 h-6" />
                </div>
                <h4 className="text-zinc-400 font-semibold text-sm">Camera Feed Disabled</h4>
                <p className="text-zinc-600 text-xs">Enable camera in settings to preview</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Indicators */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
        {getStatusBadge()}
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-xl border border-white/5 bg-zinc-900/60 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-200 tracking-wide truncate max-w-[150px]">
            {candidateName || 'Candidate Mode'}
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
          WEBCAM PREVIEW
        </span>
      </div>
    </div>
  );
});

CameraPreview.displayName = 'CameraPreview';
export default CameraPreview;
