import { RiskRule, RiskContext } from './RiskRule';
import { RiskFactor } from '../types/risk';
import { RiskWeights } from '../config/RiskWeights';

export class PresenceRiskRule implements RiskRule {
  name = 'PresenceRiskRule';
  version = 1;

  initialize(): void {}
  reset(): void {}
  dispose(): void {}

  evaluate(context: RiskContext): RiskFactor | null {
    const list = context.presenceEvidence;
    if (list.length === 0) return null;

    const configWeight = RiskWeights.MULTIPLE_FACES_PRESENT;
    const avgConfidence = list.reduce((sum, e) => sum + e.confidence, 0) / list.length;
    const contribution = configWeight * avgConfidence;
    const supporting = list.map((e) => e.id);

    return {
      id: `rf_pre_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category: 'Presence',
      title: 'Multiple Face Presence',
      description: 'Multiple concurrent faces detected in camera visual feed.',
      generatedBy: this.name,
      ruleVersion: this.version,
      configuredWeight: configWeight,
      confidence: Math.round(avgConfidence * 100) / 100,
      contribution: Math.round(contribution * 10) / 10,
      severity: 'high',
      supportingEvidence: supporting,
    };
  }
}

export const presenceRiskRule = new PresenceRiskRule();
export default presenceRiskRule;
