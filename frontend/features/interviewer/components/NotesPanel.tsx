import React, { useState, useEffect } from 'react';
import { useInterviewerStore } from '../store/useInterviewerStore';
import { mockQuestionsBank } from '../services/QuestionBankService';
import { Edit3, Clock, CheckCircle } from 'lucide-react';
import { Card } from '../../../components/ui/card';

export const NotesPanel: React.FC = () => {
  const { currentQuestionIndex, notes, addNote, updateNote } = useInterviewerStore();
  const currentQuestion = mockQuestionsBank[currentQuestionIndex];

  const [activeText, setActiveText] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Filter notes linked to current question
  const currentNotes = notes.filter((n) => n.questionId === currentQuestion.id);

  // Autosave simulation
  useEffect(() => {
    if (!activeText.trim()) return;
    
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      // Find if we already have an unsaved draft note for this question, or create a new note
      const existingDraft = currentNotes[currentNotes.length - 1];
      if (existingDraft) {
        updateNote(existingDraft.id, activeText);
      } else {
        addNote({
          questionId: currentQuestion.id,
          content: activeText,
        });
      }
      setSaveStatus('saved');
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeText]);

  // Reset active editor text when changing questions
  useEffect(() => {
    const lastNote = currentNotes[currentNotes.length - 1];
    setActiveText(lastNote ? lastNote.content : '');
  }, [currentQuestionIndex]);

  const insertTimestamp = () => {
    const timeStr = ` [${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] `;
    setActiveText((prev) => prev + timeStr);
  };

  return (
    <Card className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 select-none">
        <div className="flex items-center space-x-2">
          <Edit3 className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-350">
            Scratch Pad (Autosaved)
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[9px] font-mono text-zinc-500">
          <button
            onClick={insertTimestamp}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            title="Insert Timeline Timestamp"
          >
            <Clock className="w-3 h-3" />
            <span>Time</span>
          </button>
          {saveStatus === 'saved' ? (
            <span className="text-emerald-400 font-bold flex items-center space-x-0.5">
              <CheckCircle className="w-3 h-3" />
              <span>SAVED</span>
            </span>
          ) : (
            <span className="text-zinc-500 font-bold animate-pulse">SAVING...</span>
          )}
        </div>
      </div>

      {/* Markdown Area */}
      <div className="space-y-3">
        <span className="text-[10px] text-zinc-500 font-mono">
          Notes linked to: <span className="font-bold text-zinc-300">{currentQuestion.title}</span>
        </span>
        <textarea
          value={activeText}
          onChange={(e) => setActiveText(e.target.value)}
          placeholder="- Candidate explained isolation levels correctly&#10;- Strong systems design understanding&#10;- Bullet lists and free typing supported..."
          className="w-full min-h-[140px] p-3 rounded-xl border border-zinc-900 bg-zinc-950/60 text-zinc-200 text-xs font-mono placeholder-zinc-700 focus:outline-none focus:border-zinc-800 transition-colors leading-relaxed"
        />
      </div>

      {/* Historical List */}
      {currentNotes.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-900/60 font-mono text-[9px]">
          <span className="text-zinc-650 font-bold uppercase tracking-wider block">Notes Timeline Logs</span>
          <div className="space-y-1.5 max-h-[80px] overflow-y-auto pr-1">
            {currentNotes.map((n) => (
              <div key={n.id} className="flex justify-between text-zinc-500">
                <span className="truncate max-w-[280px]">{n.content}</span>
                <span className="text-zinc-650">{n.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default NotesPanel;
