import { RiskFactor, RiskLevel } from '../types/risk';
import { getRiskLevelFromScore } from '../config/RiskThresholds';

export interface AggregationResult {
  overallRisk: RiskLevel;
  totalContribution: number;
  averageConfidence: number;
  supportingEvidenceCount: number;
  primaryReasons: string[];
}

export class RiskAggregator {
  aggregate(factors: RiskFactor[]): AggregationResult {
    if (factors.length === 0) {
      return {
        overallRisk: 'LOW',
        totalContribution: 0.0,
        averageConfidence: 1.0,
        supportingEvidenceCount: 0,
        primaryReasons: ['No active evidence observations logged.'],
      };
    }

    let totalContribution = 0;
    let confidenceSum = 0;
    const supportingEvidenceSet = new Set<string>();
    const reasons: string[] = [];

    factors.forEach((f) => {
      totalContribution += f.contribution;
      confidenceSum += f.confidence;
      f.supportingEvidence.forEach((id) => supportingEvidenceSet.add(id));
      reasons.push(f.title);
    });

    const averageConfidence = confidenceSum / factors.length;
    const overallRisk = getRiskLevelFromScore(totalContribution);

    return {
      overallRisk,
      totalContribution: Math.round(totalContribution * 10) / 10,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      supportingEvidenceCount: supportingEvidenceSet.size,
      primaryReasons: reasons,
    };
  }
}

export const riskAggregator = new RiskAggregator();
export default riskAggregator;
