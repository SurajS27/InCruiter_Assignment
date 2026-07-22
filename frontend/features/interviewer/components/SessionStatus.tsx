import React from 'react';
import { useInterviewerStore } from '../store/useInterviewerStore';
import { useAudioStore } from '../../../store/useAudioStore';
import { useVisionStore } from '../../../store/useVisionStore';
import { mockQuestionsBank } from '../services/QuestionBankService';
import { Activity, Circle } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { InterviewTimer } from '../../interview/components/InterviewTimer';

export const SessionStatus: React.FC = () => {
  const { currentQuestionIndex } = useInterviewerStore();
  const audioRunning = useAudioStore((state) => state.audioRunning);
  const visionRunning = useVisionStore((state) => state.visionRunning);
  const facePresent = useVisionStore((state) => state.facePresent);

  const stats = [
    { label: 'Candidate Link', status: 'Connected', active: true },
    { label: 'Interviewer Link', status: 'Connected', active: true },
    { label: 'Video Camera Feed', status: visionRunning ? 'Active' : 'Offline', active: visionRunning },
    { label: 'Microphone Stream', status: audioRunning ? 'Streaming' : 'Offline', active: audioRunning },
    { label: 'Vision Analytics', status: visionRunning ? 'Running' : 'Stopped', active: visionRunning },
    { label: 'Audio Analytics', status: audioRunning ? 'Running' : 'Stopped', active: audioRunning },
    { label: 'Face Present', status: facePresent ? 'Yes' : 'No', active: facePresent },
    { label: 'Link Latency', status: '12ms', active: true },
  ];

  return (
    <Card className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4 font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-350">
            Live Session Status
          </span>
        </div>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-2 gap-3 text-[10px] text-zinc-400">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-2 rounded-lg border border-zinc-900 bg-zinc-900/10"
          >
            <span>{item.label}:</span>
            <span className="flex items-center space-x-1.5">
              <Circle className={`w-2 h-2 fill-current ${item.active ? 'text-emerald-400' : 'text-rose-500'}`} />
              <span className={`font-bold ${item.active ? 'text-zinc-200' : 'text-zinc-550'}`}>{item.status}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Progress Footer */}
      <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[9px] text-zinc-500">
        <div className="flex items-center space-x-1">
          <span>Timer:</span>
          <InterviewTimer />
        </div>
        <div>
          <span>Progress: {currentQuestionIndex + 1} / {mockQuestionsBank.length}</span>
        </div>
      </div>
    </Card>
  );
};

export default SessionStatus;
