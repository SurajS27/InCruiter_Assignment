import { RiskContext, RiskRule } from '../rules/RiskRule';
import { RiskFactor } from '../types/risk';
import { attentionRiskRule } from '../rules/AttentionRiskRule';
import { focusRiskRule } from '../rules/FocusRiskRule';
import { responseRiskRule } from '../rules/ResponseRiskRule';
import { presenceRiskRule } from '../rules/PresenceRiskRule';
import { audioRiskRule } from '../rules/AudioRiskRule';
import { useRiskStore } from '../store/useRiskStore';

export class RiskEvaluator {
  private rules: RiskRule[] = [
    attentionRiskRule,
    focusRiskRule,
    responseRiskRule,
    presenceRiskRule,
    audioRiskRule,
  ];

  evaluate(context: RiskContext): RiskFactor[] {
    const factors: RiskFactor[] = [];
    const store = useRiskStore.getState();

    this.rules.forEach((rule) => {
      try {
        const factor = rule.evaluate(context);
        if (factor) {
          factors.push(factor);
        }
      } catch (err) {
        console.error(`Risk rule ${rule.name} failed evaluation:`, err);
      }
    });

    store.updateRiskFactors(factors);

    // Update rules count statistics
    store.updateStatistics((prev) => ({
      rulesEvaluatedCount: prev.rulesEvaluatedCount + this.rules.length,
    }));

    return factors;
  }

  clear(): void {
    this.rules.forEach((r) => r.reset());
  }
}

export const riskEvaluator = new RiskEvaluator();
export default riskEvaluator;
