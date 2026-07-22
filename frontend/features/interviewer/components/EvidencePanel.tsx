import React, { useState } from 'react';
import { useEvidenceStore } from '../../evidence/store/useEvidenceStore';
import { ShieldCheck, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Card } from '../../../components/ui/card';

export const EvidencePanel: React.FC = () => {
  const timeline = useEvidenceStore((state) => state.timeline);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState<'NEWEST' | 'CONFIDENCE' | 'DURATION'>('NEWEST');

  // Filters Options List
  const filters = [
    { key: 'ALL', label: 'All' },
    { key: 'OFF_SCREEN_ATTENTION', label: 'Attention' },
    { key: 'BROWSER_FOCUS_LOST', label: 'Focus' },
    { key: 'MULTIPLE_FACES_PRESENT', label: 'Presence' },
    { key: 'DELAYED_RESPONSE', label: 'Response' },
    { key: 'EXTENDED_SILENCE', label: 'Silence' },
  ];

  // 1. Apply Search and Categories Filtering
  let filtered = timeline.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = activeFilter === 'ALL' || e.type === activeFilter;

    return matchesSearch && matchesType;
  });

  // 2. Apply Sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortOption === 'CONFIDENCE') {
      return b.confidence - a.confidence;
    } else if (sortOption === 'DURATION') {
      return b.duration - a.duration;
    } else {
      // DEFAULT: Newest timestamp
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  return (
    <Card className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4 font-sans text-zinc-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 select-none">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-350">
            Fused Evidence Timeline
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
          {timeline.length} Observations
        </span>
      </div>

      {/* Filter / Search Inputs Toolbar */}
      <div className="space-y-2 select-none">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-650" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or description..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-950/60 text-[10.5px] font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-800"
          />
        </div>

        {/* Categories Badges */}
        <div className="flex flex-wrap gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-2 py-1 rounded border text-[9px] font-bold font-mono transition-colors ${
                activeFilter === f.key
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-zinc-500">
          <span className="flex items-center space-x-1">
            <Filter className="w-3 h-3 text-zinc-600" />
            <span>Sorting By:</span>
          </span>
          <div className="flex space-x-2">
            {(['NEWEST', 'CONFIDENCE', 'DURATION'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSortOption(opt)}
                className={`hover:text-zinc-300 font-bold ${
                  sortOption === opt ? 'text-indigo-400 font-extrabold' : 'text-zinc-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline List Scrollable Pane */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center text-zinc-600 font-mono text-[10px] py-4 select-none">
            No matching observations recorded.
          </div>
        ) : (
          filtered.map((evt) => {
            const isHigh = evt.severity === 'high';
            return (
              <div
                key={evt.id}
                className={`p-3 border rounded-xl space-y-2 font-mono text-[9px] leading-relaxed transition-all duration-200 ${
                  isHigh
                    ? 'border-rose-950/40 bg-rose-950/5 text-rose-300'
                    : 'border-zinc-900/60 bg-zinc-900/10 text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between border-b border-zinc-900/40 pb-1 text-zinc-500 font-semibold select-none">
                  <span>
                    [{evt.id}] {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-1.5 rounded uppercase font-bold text-[8px] ${
                    isHigh ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-900 text-zinc-500'
                  }`}>
                    {evt.severity}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-zinc-200 uppercase tracking-wide">
                    {evt.title}
                  </span>
                </div>
                <div className="text-zinc-400 text-[8.5px]">
                  {evt.description}
                </div>
                <div className="pt-1.5 border-t border-zinc-900/40 flex items-center justify-between text-zinc-500 text-[8px] select-none">
                  <span>Confidence: {Math.round(evt.confidence * 100)}%</span>
                  <span>Duration: {evt.duration}s</span>
                </div>
                <div className="text-zinc-650 break-all text-[7.5px] select-none">
                  Supporting events: {JSON.stringify(evt.supportingEvents)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default EvidencePanel;
