import React from 'react';
import { ArrowLeft, ArrowRight, StopCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface ActionButtonsProps {
  onNext: () => void;
  onPrev: () => void;
  onEnd: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = React.memo(({
  onNext,
  onPrev,
  onEnd,
  hasNext,
  hasPrev,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-zinc-800 rounded-xl bg-zinc-950/40 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <Button
          onClick={onPrev}
          disabled={!hasPrev}
          variant="outline"
          size="sm"
          className="border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-semibold px-4 py-2 flex items-center space-x-1.5 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={onNext}
          disabled={!hasNext}
          variant="outline"
          size="sm"
          className="border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-semibold px-4 py-2 flex items-center space-x-1.5 transition-all duration-200"
        >
          <span>Next Question</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <Button
        onClick={onEnd}
        variant="destructive"
        size="sm"
        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2 flex items-center space-x-1.5 shadow-lg shadow-rose-900/20 transition-all duration-200"
      >
        <StopCircle className="w-4 h-4" />
        <span>End Interview</span>
      </Button>
    </div>
  );
});

ActionButtons.displayName = 'ActionButtons';
export default ActionButtons;
