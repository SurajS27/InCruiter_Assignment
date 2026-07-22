import React from 'react';
import { useInterviewerStore } from '../store/useInterviewerStore';
import { Star, Award } from 'lucide-react';
import { Card } from '../../../components/ui/card';

export const ScorecardPanel: React.FC = () => {
  const { scorecard, updateScorecard } = useInterviewerStore();

  const handleRatingChange = (category: keyof typeof scorecard, val: number) => {
    updateScorecard({ [category]: val });
  };

  const handleCommentsChange = (comments: string) => {
    updateScorecard({ comments });
  };

  const categories = [
    { key: 'technicalKnowledge' as const, label: 'Technical Knowledge' },
    { key: 'problemSolving' as const, label: 'Problem Solving' },
    { key: 'communication' as const, label: 'Communication' },
    { key: 'systemDesign' as const, label: 'System Design' },
    { key: 'cultureFit' as const, label: 'Culture Fit' },
  ];

  // Calculate overall manual score: average of 5 sliders
  const overallScore = Math.round(
    (scorecard.technicalKnowledge +
      scorecard.problemSolving +
      scorecard.communication +
      scorecard.systemDesign +
      scorecard.cultureFit) / 5 * 10
  ) / 10;

  return (
    <Card className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 select-none">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-350">
            Candidate Scorecard (Manual Only)
          </span>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold font-mono text-[10px]">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Avg: {overallScore}/10</span>
        </div>
      </div>

      {/* Ratings Sliders */}
      <div className="space-y-3.5 font-sans">
        {categories.map((cat) => {
          const score = scorecard[cat.key] as number;
          return (
            <div key={cat.key} className="space-y-1 text-xs">
              <div className="flex justify-between text-zinc-400 select-none">
                <span className="font-semibold">{cat.label}</span>
                <span className="font-bold text-zinc-200 font-mono">{score} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={score}
                onChange={(e) => handleRatingChange(cat.key, parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
              />
            </div>
          );
        })}
      </div>

      {/* Comments */}
      <div className="space-y-2">
        <span className="text-zinc-650 font-bold font-mono uppercase tracking-wider block text-[8px] select-none">Comments / Remarks</span>
        <textarea
          value={scorecard.comments}
          onChange={(e) => handleCommentsChange(e.target.value)}
          placeholder="Overall comments regarding candidate skills and performance..."
          className="w-full min-h-[60px] p-2.5 rounded-lg border border-zinc-900 bg-zinc-950/60 text-zinc-200 text-[10.5px] font-sans placeholder-zinc-700 focus:outline-none focus:border-zinc-800"
        />
      </div>
    </Card>
  );
};

export default ScorecardPanel;
