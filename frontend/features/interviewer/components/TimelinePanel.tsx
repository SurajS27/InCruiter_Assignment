import React from 'react';
import { eventService } from '../../../services/event.service';
import { useEvidenceStore } from '../../evidence/store/useEvidenceStore';
import { Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/ui/card';

export const TimelinePanel: React.FC = () => {
  const rawTimeline = eventService.getEventTimeline();
  const evidenceTimeline = useEvidenceStore((state) => state.timeline);

  // Combine and sort events chronologically
  const combinedEvents: Array<{
    id: string;
    timestamp: string;
    type: string;
    title: string;
    description: string;
  }> = [];

  rawTimeline.forEach((evt) => {
    if (evt.type === 'INTERVIEW_STARTED' || evt.type === 'INTERVIEW_STOPPED' || evt.type === 'QUESTION_CHANGED') {
      combinedEvents.push({
        id: evt.id,
        timestamp: evt.timestamp,
        type: evt.type,
        title: evt.type === 'QUESTION_CHANGED' ? 'Question Shifted' : evt.type.replace(/_/g, ' '),
        description: evt.type === 'QUESTION_CHANGED' ? `Active question index shifted.` : 'Interview milestone log.',
      });
    }
  });

  evidenceTimeline.forEach((evt) => {
    combinedEvents.push({
      id: evt.id,
      timestamp: evt.timestamp,
      type: evt.type,
      title: evt.title,
      description: evt.description,
    });
  });

  const sortedEvents = [...combinedEvents].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <Card className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4 font-mono select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-350">
            Chronological Session Timeline
          </span>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-4 space-y-4 border-l border-zinc-900/60 max-h-[300px] overflow-y-auto pr-1">
        {sortedEvents.length === 0 ? (
          <span className="text-[10px] text-zinc-550 italic block py-1">No session milestones logged yet.</span>
        ) : (
          sortedEvents.map((evt) => {
            const isEvidence = evt.id.startsWith('ev_');
            return (
              <div key={evt.id} className="relative space-y-1">
                {/* Node indicator */}
                <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 ${
                  isEvidence ? 'bg-indigo-600 border-indigo-500' : 'bg-zinc-800 border-zinc-700'
                }`} />
                
                <div className="flex items-center justify-between text-[8px] text-zinc-650">
                  <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  <span className="uppercase font-bold tracking-wider">{evt.type}</span>
                </div>
                <h4 className="text-[10px] font-bold text-zinc-200 uppercase">{evt.title}</h4>
                <p className="text-[9px] text-zinc-450 leading-relaxed font-sans">{evt.description}</p>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default TimelinePanel;
