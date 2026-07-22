import { Evidence } from '../../evidence/types/evidence';
import { RiskFactor } from '../types/risk';

export interface RiskContext {
  attentionEvidence: Evidence[];
  focusEvidence: Evidence[];
  presenceEvidence: Evidence[];
  responseEvidence: Evidence[];
  audioEvidence: Evidence[];
  historicalEvidence: Evidence[];
  assessmentHistory: any[];
}

export interface RiskRule {
  name: string;
  version: number;
  initialize(): void;
  evaluate(context: RiskContext): RiskFactor | null;
  reset(): void;
  dispose(): void;
}
