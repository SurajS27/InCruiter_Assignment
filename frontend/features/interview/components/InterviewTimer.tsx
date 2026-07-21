import React from 'react';
import { Clock } from 'lucide-react';
import { useInterviewTimer } from '../../../shared/hooks/useInterviewTimer';

export const InterviewTimer: React.FC = React.memo(() => {
  const { formattedDuration } = useInterviewTimer();

  return (
    <div className="flex items-center space-x-2.5 px-4 py-2 border border-zinc-800 rounded-xl bg-zinc-950/60 backdrop-blur-md text-zinc-100 shadow-inner font-mono text-sm font-semibold tracking-wider">
      <Clock className="w-4 h-4 text-violet-400 animate-pulse" />
      <span>{formattedDuration}</span>
    </div>
  );
});

InterviewTimer.displayName = 'InterviewTimer';
export default InterviewTimer;
