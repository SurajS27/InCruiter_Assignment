import { create } from 'zustand';
import { Question } from '../types/question';
import { QUESTIONS } from '../constants/questions';
import { eventService } from '../services/event.service';

interface QuestionState {
  questions: Question[];
  currentQuestionIndex: number;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setQuestions: (questions: Question[]) => void;
  resetQuestions: () => void;
  getCurrentQuestion: () => Question | null;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: QUESTIONS,
  currentQuestionIndex: 0,

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      set({ currentQuestionIndex: nextIndex });
      eventService.emit('QUESTION_CHANGED', {
        fromIndex: currentQuestionIndex,
        toIndex: nextIndex,
        questionId: questions[nextIndex].id,
      });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      set({ currentQuestionIndex: prevIndex });
      eventService.emit('QUESTION_CHANGED', {
        fromIndex: currentQuestionIndex,
        toIndex: prevIndex,
        questionId: questions[prevIndex].id,
      });
    }
  },

  setQuestions: (questions) => set({ questions, currentQuestionIndex: 0 }),

  resetQuestions: () => set({ currentQuestionIndex: 0 }),

  getCurrentQuestion: () => {
    const { questions, currentQuestionIndex } = get();
    if (questions.length === 0) return null;
    return questions[currentQuestionIndex];
  },
}));

export default useQuestionStore;
