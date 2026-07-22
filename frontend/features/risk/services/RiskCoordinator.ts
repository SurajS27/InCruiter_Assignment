import { useEvidenceStore } from '../../evidence/store/useEvidenceStore';
import { useRiskStore } from '../store/useRiskStore';
import { riskContextBuilder } from './RiskContextBuilder';
import { riskEvaluator } from './RiskEvaluator';
import { riskAggregator } from './RiskAggregator';
import { riskAssessmentBuilder } from './RiskAssessmentBuilder';

export class RiskCoordinator {
  private unsubscribe: (() => void) | null = null;
  private running = false;

  start(): void {
    if (this.running) return;
    this.running = true;

    // Reactively subscribe to Evidence store timeline changes
    this.unsubscribe = useEvidenceStore.subscribe((evidenceState) => {
      if (!this.running) return;
      this.evaluateRisk(evidenceState.timeline);
    });

    // Initial evaluation
    this.evaluateRisk(useEvidenceStore.getState().timeline);
  }

  private evaluateRisk(timeline: any[]): void {
    const start = performance.now();

    // 1. Build Risk Context
    const context = riskContextBuilder.buildContext(timeline);

    // 2. Evaluate rules to generate factors
    const factors = riskEvaluator.evaluate(context);

    // 3. Aggregate contributions
    const aggResult = riskAggregator.aggregate(factors);

    // 4. Compile Assessment
    const assessment = riskAssessmentBuilder.build(factors, aggResult, timeline.length);

    // 5. Update Risk store
    useRiskStore.getState().setAssessment(assessment);

    // 6. Log latency stats
    const latency = performance.now() - start;
    useRiskStore.getState().updateStatistics((prev) => ({
      processingTimeMs: Math.round(latency * 10) / 10,
    }));
  }

  stop(): void {
    this.running = false;
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    riskEvaluator.clear();
  }

  isRunning(): boolean {
    return this.running;
  }
}

export const riskCoordinator = new RiskCoordinator();
export default riskCoordinator;
