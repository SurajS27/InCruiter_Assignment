import React from 'react';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  title = 'No Data',
  description = 'There is currently no information to display here.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40 backdrop-blur-sm">
      <div className="p-3 bg-zinc-900 rounded-full text-zinc-400">
        <Sparkles className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-zinc-200">{title}</h3>
      <p className="text-xs text-zinc-400 max-w-xs">{description}</p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
export default EmptyState;
