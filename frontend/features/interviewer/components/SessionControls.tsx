import React from 'react';
import { useInterviewerStore } from '../store/useInterviewerStore';
import { useInterviewStore } from '../../../store/useInterviewStore';
import { RecommendationType } from '../types/interviewer';
import { ShieldCheck, Award, Flag } from 'lucide-react';
import { Card } from '../../../components/ui/card';

export const SessionControls: React.FC = () => {
  const { recommendation, setRecommendation } = useInterviewerStore();
  const { endInterview } = useInterviewStore();

  const handleRecChange = (rec: RecommendationType) => {
    setRecommendation(rec);
  };

  const recommendations: RecommendationType[] = [
    'Strong Hire',
    'Hire',
    'Needs Another Interview',
    'No Hire',
  ];

  return (
    <Card className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-350">
            Session Controls & Recommendation
          </span>
        </div>
      </div>

      {/* Manual Recommendation selector */}
      <div className="space-y-2">
        <span className="text-zinc-500 text-[10px] font-mono block">Overall Recommendation (Manual Only)</span>
        <div className="grid grid-cols-2 gap-2">
          {recommendations.map((rec) => {
            const isSelected = recommendation === rec;
            return (
              <button
                key={rec}
                onClick={() => handleRecChange(rec)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {rec}
              </button>
            );
          })}
        </div>
      </div>

      {/* End Interview Trigger */}
      <div className="pt-2 border-t border-zinc-900/60">
        <button
          onClick={endInterview}
          className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs tracking-wider shadow-lg hover:shadow-rose-950/20 active:scale-98 transition-all duration-200 uppercase"
        >
          End & Submit Evaluation
        </button>
      </div>
    </Card>
  );
};

export default SessionControls;
