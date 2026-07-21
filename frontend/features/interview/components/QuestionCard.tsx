/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/card';
import { Question } from '../../../types/question';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../../store/useSettingsStore';

interface QuestionCardProps {
  question: Question | null;
  currentIndex: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = React.memo(({
  question,
  currentIndex,
  totalQuestions,
}) => {
  const animationsEnabled = useSettingsStore((state) => state.animationsEnabled);

  if (!question) {
    return (
      <Card className="border-zinc-800 bg-zinc-950/40 backdrop-blur-md h-[300px] flex items-center justify-center">
        <p className="text-zinc-500 text-sm">No question loaded.</p>
      </Card>
    );
  }

  const getDifficultyColor = (diff: Question['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'Medium':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'Hard':
        return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animationProps = (animationsEnabled
    ? {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -15 },
        transition: { duration: 0.25, ease: 'easeOut' as const },
      }
    : {}) as any;

  return (
    <Card className="border-zinc-800 bg-zinc-950/40 backdrop-blur-md shadow-xl hover:shadow-2xl hover:border-zinc-700/60 transition-all duration-300 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600" />
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px] font-bold">
              {question.category}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[220px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div key={question.id} {...animationProps} className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight leading-snug">
              {question.title}
            </h2>
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-sm text-zinc-300 leading-relaxed font-normal">
              {question.description}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
});

QuestionCard.displayName = 'QuestionCard';
export default QuestionCard;
