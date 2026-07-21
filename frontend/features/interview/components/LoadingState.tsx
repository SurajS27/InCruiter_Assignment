import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = React.memo(({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 border border-zinc-800 rounded-2xl bg-black/40 backdrop-blur-md">
      <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      <p className="text-sm font-medium text-zinc-400">{message}</p>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';
export default LoadingState;
