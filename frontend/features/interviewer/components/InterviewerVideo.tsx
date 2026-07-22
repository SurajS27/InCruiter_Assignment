import React, { useEffect, useRef } from 'react';
import { Camera, ShieldAlert } from 'lucide-react';
import { useCamera } from '../../../shared/hooks/useCamera';

interface InterviewerVideoProps {
  localStream?: MediaStream | null;
  remoteStreamUrl?: string; // Placeholder for WebRTC remote links
}

export const InterviewerVideo: React.FC<InterviewerVideoProps> = ({ localStream, remoteStreamUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream } = useCamera();

  const activeStream = localStream !== undefined ? localStream : stream;

  useEffect(() => {
    if (videoRef.current && activeStream) {
      videoRef.current.srcObject = activeStream;
    }
  }, [activeStream]);

  return (
    <div className="relative w-full aspect-video rounded-2xl border border-zinc-900 bg-zinc-950/60 flex items-center justify-center overflow-hidden group shadow-2xl">
      {/* Video Stream Element */}
      {activeStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-2xl scale-x-[-1]"
        />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3 text-zinc-650">
          <Camera className="w-10 h-10 animate-pulse text-zinc-700" />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">Interviewer Stream Offline</span>
        </div>
      )}

      {/* Decorative Overlay Label */}
      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-zinc-900/60 backdrop-blur-md flex items-center space-x-1.5 select-none z-10">
        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
        <span className="text-[10px] font-bold text-zinc-350 tracking-wider font-mono">INTERVIEWER FEED</span>
      </div>
    </div>
  );
};

export default InterviewerVideo;
