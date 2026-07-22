import { RiskAssessment } from '../../risk/types/risk';
import { Evidence } from '../../evidence/types/evidence';

export interface Question {
  id: string;
  category: 'Frontend' | 'Backend' | 'System Design' | 'Behavioral';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  description: string;
  points: number;
}

export interface Scorecard {
  technicalKnowledge: number; // 1 to 10
  problemSolving: number;
  communication: number;
  systemDesign: number;
  cultureFit: number;
  comments: string;
}

export interface InterviewerNote {
  id: string;
  timestamp: string; // MM:SS relative time or absolute
  questionId: string | null;
  content: string;
}

export interface SessionTimelineEvent {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  description: string;
}

export type SessionRole = 'candidate' | 'interviewer';

export type RecommendationType = 'Strong Hire' | 'Hire' | 'Needs Another Interview' | 'No Hire';
