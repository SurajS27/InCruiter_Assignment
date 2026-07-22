import { RiskAssessment, RiskFactor } from '../types/risk';
import { AggregationResult } from './RiskAggregator';

let assessmentCounter = 0;

export class RiskAssessmentBuilder {
  build(
    factors: RiskFactor[],
    aggResult: AggregationResult,
    evidenceCount: number
  ): RiskAssessment {
    const timestamp = new Date().toISOString();
    assessmentCounter++;
    const id = `as_${Date.now()}_${assessmentCounter}`;

    // Generate deterministic summary matching specification examples
    let summary = 'The assessment is based on the current interview telemetry signals. ';
    
    if (aggResult.primaryReasons.length > 0) {
      const reasonsList = aggResult.primaryReasons.map((r) => r.toLowerCase()).join(' and ');
      summary = `The assessment is based on observations of ${reasonsList}. The result is derived from ${evidenceCount} evidence observations.`;
    } else {
      summary = 'The assessment indicates standard candidate session activities with no telemetry flags.';
    }

    // Consolidate supporting evidence IDs
    const supportSet = new Set<string>();
    factors.forEach((f) => {
      f.supportingEvidence.forEach((id) => supportSet.add(id));
    });

    return {
      id,
      timestamp,
      overallRisk: aggResult.overallRisk,
      totalContribution: aggResult.totalContribution,
      averageConfidence: aggResult.averageConfidence,
      riskFactors: factors,
      supportingEvidence: Array.from(supportSet),
      primaryReasons: aggResult.primaryReasons,
      summary,
    };
  }
}

export const riskAssessmentBuilder = new RiskAssessmentBuilder();
export default riskAssessmentBuilder;
