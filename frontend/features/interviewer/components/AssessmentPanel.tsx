import React from 'react';
import { useRiskStore } from '../../risk/store/useRiskStore';
import { AlertTriangle, TrendingUp, GitPullRequest } from 'lucide-react';
import { Card } from '../../../components/ui/card';

export const AssessmentPanel: React.FC = () => {
  const { currentAssessment, riskFactors } = useRiskStore();

  const activeFactors = currentAssessment?.riskFactors || [];

  // Match factor category values
  const getContribution = (category: string) => {
    const factor = activeFactors.find((f) => f.category === category);
    return factor ? factor.contribution : 0;
  };

  const categories = [
    { label: 'Attention', category: 'Attention', color: 'bg-rose-500' },
    { label: 'Browser Focus', category: 'Browser Focus', color: 'bg-orange-500' },
    { label: 'Presence', category: 'Presence', color: 'bg-amber-500' },
    { label: 'Response Timing', category: 'Response Timing', color: 'bg-indigo-500' },
    { label: 'Audio', category: 'Audio Reliability', color: 'bg-emerald-500' },
  ];

  // Calculate max contribution score dynamically (fallback to 100 for percentage drawing)
  const maxScore = 100;

  return (
    <Card className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-350">
            Explainable Risk Assessment
          </span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold tracking-wider ${
          currentAssessment?.overallRisk === 'CRITICAL'
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            : currentAssessment?.overallRisk === 'HIGH'
            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
            : currentAssessment?.overallRisk === 'MODERATE'
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          {currentAssessment?.overallRisk || 'LOW'}
        </span>
      </div>

      {/* Numerical Stats overview */}
      <div className="grid grid-cols-2 gap-4 text-zinc-400 text-xs font-mono">
        <div className="p-2 border border-zinc-900 rounded bg-zinc-900/10">
          <span className="text-[9px] text-zinc-550 block">Risk Score Index</span>
          <span className="text-zinc-200 font-bold text-sm">{currentAssessment?.totalContribution || 0.0} pts</span>
        </div>
        <div className="p-2 border border-zinc-900 rounded bg-zinc-900/10">
          <span className="text-[9px] text-zinc-550 block">Audit Confidence</span>
          <span className="text-zinc-200 font-bold text-sm">{currentAssessment ? Math.round(currentAssessment.averageConfidence * 100) : 100}%</span>
        </div>
      </div>

      {/* Contribution Visual Chart */}
      <div className="space-y-3">
        <span className="text-zinc-650 font-bold font-mono uppercase tracking-wider block text-[8px]">Risk Factor Breakdown</span>
        <div className="space-y-2.5">
          {categories.map((cat) => {
            const score = getContribution(cat.category);
            const percentage = Math.min(100, (score / maxScore) * 100) || 2; // Min width showing slightly
            return (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span className="font-medium">{cat.label}</span>
                  <span className="font-bold text-zinc-350">{score} pts</span>
                </div>
                {/* Horizontal Bar */}
                <div className="w-full h-2 bg-zinc-900 rounded overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded transition-all duration-500 ${cat.color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanatory summary text */}
      {currentAssessment?.summary && (
        <div className="p-3 rounded-lg border border-zinc-900 bg-zinc-950/60 text-zinc-450 leading-relaxed italic font-mono text-[10px]">
          {currentAssessment.summary}
        </div>
      )}
    </Card>
  );
};

export default AssessmentPanel;
