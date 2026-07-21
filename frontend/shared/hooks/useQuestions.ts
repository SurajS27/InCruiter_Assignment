import { useQuestionStore } from '../../store/useQuestionStore';

export function useQuestions() {
  const questions = useQuestionStore((state) => state.questions);
  const currentQuestionIndex = useQuestionStore((state) => state.currentQuestionIndex);
  const nextQuestion = useQuestionStore((state) => state.nextQuestion);
  const previousQuestion = useQuestionStore((state) => state.previousQuestion);
  const getCurrentQuestion = useQuestionStore((state) => state.getCurrentQuestion);

  const currentQuestion = getCurrentQuestion();
  const hasNext = currentQuestionIndex < questions.length - 1;
  const hasPrevious = currentQuestionIndex > 0;

  return {
    questions,
    currentQuestionIndex,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    hasNext,
    hasPrevious,
    totalQuestions: questions.length,
  };
}

export default useQuestions;
