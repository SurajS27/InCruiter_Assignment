import React from 'react';
import { useInterviewerStore } from '../store/useInterviewerStore';
import { mockQuestionsBank } from '../services/QuestionBankService';
import { ArrowLeft, ArrowRight, CheckCircle2, Bookmark } from 'lucide-react';
import { Card } from '../../../components/ui/card';

export const QuestionPanel: React.FC = () => {
  const { currentQuestionIndex, setQuestionIndex, answeredQuestions, markQuestionAnswered } = useInterviewerStore();

  const currentQuestion = mockQuestionsBank[currentQuestionIndex];
  const isAnswered = answeredQuestions.includes(currentQuestion.id);

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestionsBank.length - 1) {
      setQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <Card className="p-6 border border-zinc-900 bg-zinc-950/40 backdrop-blur-md rounded-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 select-none">
        <div className="flex items-center space-x-2">
          <Bookmark className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-350">
            Question Manager
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-zinc-500">
          Question {currentQuestionIndex + 1} of {mockQuestionsBank.length}
        </span>
      </div>

      {/* Main Question Display */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider ${
            currentQuestion.difficulty === 'Easy'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : currentQuestion.difficulty === 'Medium'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {currentQuestion.difficulty}
          </span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase tracking-wider">
            {currentQuestion.category}
          </span>
        </div>
        <h2 className="text-sm font-bold text-zinc-100">{currentQuestion.title}</h2>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">{currentQuestion.description}</p>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-900/60 select-none">
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-800/80 text-[10px] font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === mockQuestionsBank.length - 1}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-800/80 text-[10px] font-bold"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => markQuestionAnswered(currentQuestion.id)}
          disabled={isAnswered}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border text-[10px] font-bold transition-all duration-200 ${
            isAnswered
              ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400'
              : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isAnswered ? 'Answered' : 'Mark Answered'}</span>
        </button>
      </div>
    </Card>
  );
};

export default QuestionPanel;
