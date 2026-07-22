import { RiskRule, RiskContext } from './RiskRule';
import { RiskFactor } from '../types/risk';
import { RiskWeights } from '../config/RiskWeights';

export class ResponseRiskRule implements RiskRule {
  name = 'ResponseRiskRule';
  version = 1;

  initialize(): void {}
  reset(): void {}
  dispose(): void {}

  evaluate(context: RiskContext): RiskFactor | null {
    const list = context.responseEvidence;
    if (list.length === 0) return null;

    // Separate by type to find respective weight configurations
    let totalWeight = 0;
    let totalConfidence = 0;
    const supporting: string[] = [];

    list.forEach((e) => {
      let w = 0;
      if (e.type === 'DELAYED_RESPONSE') {
        w = RiskWeights.DELAYED_RESPONSE;
      } else if (e.type === 'EXTENDED_SILENCE') {
        w = RiskWeights.EXTENDED_SILENCE;
      }

      totalWeight += w;
      totalConfidence += e.confidence * w;
      supporting.push(e.id);
    });

    const avgConfidence = list.reduce((sum, e) => sum + e.confidence, 0) / list.length;
    const contribution = totalConfidence / list.length;

    return {
      id: `rf_res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category: 'Response Timing',
      title: 'Delayed Response & Silence Intervals',
      description: `Observed prolonged response latency or silence (Count: ${list.length}).`,
      generatedBy: this.name,
      ruleVersion: this.version,
      configuredWeight: totalWeight,
      confidence: Math.round(avgConfidence * 100) / 100,
      contribution: Math.round(contribution * 10) / 10,
      severity: 'low',
      supportingEvidence: supporting,
    };
  }
}

export const responseRiskRule = new ResponseRiskRule();
export default responseRiskRule;
