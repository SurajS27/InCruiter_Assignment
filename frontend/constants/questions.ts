import { Question } from '../types/question';

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: 'Explain the difference between REST and GraphQL',
    description: 'Discuss data fetching efficiency, network overhead, type safety, and real-time support in both architectures.',
    category: 'System Design / Web API',
    difficulty: 'Medium',
  },
  {
    id: 'q2',
    title: 'What are SQL Joins and explain their types?',
    description: 'Explain INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, and CROSS JOIN with real-world scenarios or Venn diagrams concepts.',
    category: 'Database Management',
    difficulty: 'Easy',
  },
  {
    id: 'q3',
    title: 'How does React render UI and what triggers re-renders?',
    description: 'Describe the reconciliation process, Virtual DOM, Fiber architecture, state updates, prop updates, and context changes.',
    category: 'Frontend Engineering',
    difficulty: 'Medium',
  },
  {
    id: 'q4',
    title: 'Explain concurrency vs parallelism in programming',
    description: 'Contrast how single-core systems simulate multitasking vs how multi-core systems execute multiple tasks simultaneously.',
    category: 'Computer Science Fundamentals',
    difficulty: 'Medium',
  },
  {
    id: 'q5',
    title: 'What is the Event Loop in JavaScript?',
    description: 'Detail the Call Stack, Web APIs, Callback Queue, Microtask Queue (Promises), and how they interact to achieve asynchronous behavior.',
    category: 'JavaScript / Node.js',
    difficulty: 'Hard',
  },
  {
    id: 'q6',
    title: 'Explain SOLID design principles',
    description: 'Walk through Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion with examples.',
    category: 'Software Design Patterns',
    difficulty: 'Hard',
  },
  {
    id: 'q7',
    title: 'Describe the process of optimizing web performance',
    description: 'Cover metrics like LCP, FID, CLS, and strategies such as lazy loading, bundle splitting, CDN hosting, image compression, and caching.',
    category: 'Web Performance',
    difficulty: 'Medium',
  },
  {
    id: 'q8',
    title: 'How do index databases speed up queries?',
    description: 'Explain B-Trees, B+ Trees, and Hash indexes. Mention the trade-offs on write (INSERT/UPDATE) performance.',
    category: 'Database Management',
    difficulty: 'Hard',
  },
  {
    id: 'q9',
    title: 'Explain CORS (Cross-Origin Resource Sharing)',
    description: 'Why do browsers enforce it? How do preflight (OPTIONS) requests work, and what headers must a server return to allow access?',
    category: 'Web Security',
    difficulty: 'Easy',
  },
  {
    id: 'q10',
    title: 'What are WebSockets and when should you use them?',
    description: 'Detail the handshake process, full-duplex communication, and compare WebSockets with HTTP Long Polling and Server-Sent Events (SSE).',
    category: 'System Design / Web Protocols',
    difficulty: 'Medium',
  },
];
