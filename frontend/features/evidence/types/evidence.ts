import { InterviewEvent } from '../../../types/event';

export type EvidenceType =
  | 'OFF_SCREEN_ATTENTION'
  | 'BROWSER_FOCUS_LOST'
  | 'DELAYED_RESPONSE'
  | 'MULTIPLE_FACES_PRESENT'
  | 'EXTENDED_SILENCE'
  | 'MICROPHONE_INTERRUPTION'
  | 'LOW_AUDIO_LEVEL';

export type EvidenceSeverity = 'info' | 'low' | 'medium' | 'high';

export type EvidenceStatus = 'ACTIVE' | 'EXPIRED' | 'RESOLVED';

export interface Evidence {
  id: string; // sequential e.g. ev_001
  version: number;
  timestamp: string;
  type: EvidenceType;
  title: string;
  description: string;
  generatedBy: string; // Name of the rule
  ruleVersion: number;
  confidence: number; // 0.0 to 1.0
  severity: EvidenceSeverity;
  status: EvidenceStatus;
  duration: number; // in seconds
  supportingEvents: string[]; // List of InterviewEvent IDs
}

export interface EvidenceStatistics {
  evidenceCount: number;
  activeCount: number;
  expiredCount: number;
  resolvedCount: number;
  averageConfidence: number;
  rulesEvaluatedCount: number;
  processingTimeMs: number;
}
