import { RiskRule, RiskContext } from './RiskRule';
import { RiskFactor } from '../types/risk';
import { RiskWeights } from '../config/RiskWeights';

export class AttentionRiskRule implements RiskRule {
  name = 'AttentionRiskRule';
  version = 1;

  initialize(): void {}
  reset(): void {}
  dispose(): void {}

  evaluate(context: RiskContext): RiskFactor | null {
    const list = context.attentionEvidence;
    if (list.length === 0) return null;

    const configWeight = RiskWeights.OFF_SCREEN_ATTENTION;
    const avgConfidence = list.reduce((sum, e) => sum + e.confidence, 0) / list.length;
    const contribution = configWeight * avgConfidence;
    const supporting = list.map((e) => e.id);

    return {
      id: `rf_att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category: 'Attention',
      title: 'Attention Gaze Deviation',
      description: `Detected ${list.length} instances of gaze or head pose shifts away from the screen.`,
      generatedBy: this.name,
      ruleVersion: this.version,
      configuredWeight: configWeight,
      confidence: Math.round(avgConfidence * 100) / 100,
      contribution: Math.round(contribution * 10) / 10,
      severity: 'medium',
      supportingEvidence: supporting,
    };
  }
}

export const attentionRiskRule = new AttentionRiskRule();
export default attentionRiskRule;
