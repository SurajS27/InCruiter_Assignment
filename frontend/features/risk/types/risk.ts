import { Evidence } from '../../evidence/types/evidence';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskFactor {
  id: string;
  category: string;
  title: string;
  description: string;
  generatedBy: string;
  ruleVersion: number;
  configuredWeight: number;
  confidence: number;
  contribution: number; // weight * confidence
  severity: 'info' | 'low' | 'medium' | 'high';
  supportingEvidence: string[]; // list of Evidence IDs
}

export interface RiskAssessment {
  id: string;
  timestamp: string;
  overallRisk: RiskLevel;
  totalContribution: number;
  averageConfidence: number;
  riskFactors: RiskFactor[];
  supportingEvidence: string[]; // consolidated Evidence IDs
  primaryReasons: string[];
  summary: string;
}

export interface RiskStatistics {
  assessmentsEvaluatedCount: number;
  rulesEvaluatedCount: number;
  averageConfidence: number;
  processingTimeMs: number;
}
