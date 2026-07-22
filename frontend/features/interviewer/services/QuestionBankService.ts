import { Question } from '../types/interviewer';

export const mockQuestionsBank: Question[] = [
  {
    id: 'q_001',
    category: 'Frontend',
    difficulty: 'Medium',
    title: 'Explain Event Loop and Microtasks in JavaScript',
    description: 'Describe the execution model of JavaScript, how call stacks behave with callback queues, and compare Promise resolution vs setTimeout callbacks.',
    points: 10,
  },
  {
    id: 'q_002',
    category: 'Backend',
    difficulty: 'Hard',
    title: 'Explain ACID Properties and Isolation Levels',
    description: 'Detail the Atomicity, Consistency, Isolation, and Durability guarantees of transactions, and explain Read Uncommitted, Read Committed, Repeatable Read, and Serializable levels.',
    points: 15,
  },
  {
    id: 'q_003',
    category: 'System Design',
    difficulty: 'Hard',
    title: 'Design a Distributed Rate Limiter',
    description: 'Explain token bucket or sliding window log algorithms, storage selection (e.g. Redis), handling multi-region requests, and fail-safe strategy configurations.',
    points: 20,
  },
  {
    id: 'q_004',
    category: 'Behavioral',
    difficulty: 'Easy',
    title: 'Describe a Conflict You Resolved in a Team',
    description: 'Talk about a situation where you had technical disagreements with colleagues or product owners, the steps you took to resolve it, and what outcomes were achieved.',
    points: 5,
  },
  {
    id: 'q_005',
    category: 'Backend',
    difficulty: 'Medium',
    title: 'Design JWT Stateless Session Management Authentication',
    description: 'Contrast JWT stateless authentication with stateful Redis session stores, detail token signing, expiration strategies, and secure storage (HTTPOnly cookies vs LocalStorage).',
    points: 10,
  },
];

export class QuestionBankService {
  getQuestions(): Question[] {
    return [...mockQuestionsBank];
  }
}

export const questionBankService = new QuestionBankService();
export default questionBankService;
