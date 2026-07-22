import { RiskRule, RiskContext } from './RiskRule';
import { RiskFactor } from '../types/risk';
import { RiskWeights } from '../config/RiskWeights';

export class FocusRiskRule implements RiskRule {
  name = 'FocusRiskRule';
  version = 1;

  initialize(): void {}
  reset(): void {}
  dispose(): void {}

  evaluate(context: RiskContext): RiskFactor | null {
    const list = context.focusEvidence;
    if (list.length === 0) return null;

    const configWeight = RiskWeights.BROWSER_FOCUS_LOST;
    const avgConfidence = list.reduce((sum, e) => sum + e.confidence, 0) / list.length;
    const contribution = configWeight * avgConfidence;
    const supporting = list.map((e) => e.id);

    return {
      id: `rf_foc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category: 'Browser Focus',
      title: 'Browser Focus Loss',
      description: `Browser tab or window focus lost ${list.length} times during active interview.`,
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

export const focusRiskRule = new FocusRiskRule();
export default focusRiskRule;
