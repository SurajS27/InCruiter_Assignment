import React, { useState } from 'react';
import { FileText, Save } from 'lucide-react';
import { Textarea } from '../../../components/ui/textarea';

export const NotesPanel: React.FC = React.memo(() => {
  const [notes, setNotes] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col border border-zinc-800 rounded-xl bg-zinc-950/40 backdrop-blur-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-zinc-300">
          <FileText className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Scratchpad / Notes</span>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 text-[10px] font-bold transition-all duration-200"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saved ? 'Saved Locally' : 'Save Note'}</span>
        </button>
      </div>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type your notes, code draft, or thoughts here during the interview..."
        className="w-full min-h-[120px] max-h-[200px] border-zinc-800 bg-zinc-900/30 text-zinc-200 text-xs focus-visible:ring-violet-500/30 placeholder-zinc-600 leading-relaxed resize-y"
      />
    </div>
  );
});

NotesPanel.displayName = 'NotesPanel';
export default NotesPanel;
