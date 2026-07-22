import { EvidenceRule, EvidenceContext } from './EvidenceRule';

export class DelayedResponseRule implements EvidenceRule {
  name = 'DelayedResponseRule';
  version = 1;

  initialize(): void {}
  reset(): void {}
  dispose(): void {}

  evaluate(context: EvidenceContext) {
    // If delay exceeds 5 seconds (5000ms), log as delayed response observation
    if (context.responseLatency > 5000) {
      const delayEvt = context.recentEvents.find((e) => e.type === 'RESPONSE_DELAY_UPDATED');
      const questionEvt = context.recentEvents.find((e) => e.type === 'QUESTION_CHANGED');
      const support = [delayEvt?.id, questionEvt?.id].filter(Boolean) as string[];

      return {
        type: 'DELAYED_RESPONSE',
        title: 'Delayed response',
        description: `Candidate took ${Math.round(context.responseLatency / 100) / 10} seconds to respond after the question shifted.`,
        confidence: 0.95,
        severity: 'low' as const,
        supportingEvents: support,
      };
    }

    return null;
  }
}

export const delayedResponseRule = new DelayedResponseRule();
export default delayedResponseRule;
