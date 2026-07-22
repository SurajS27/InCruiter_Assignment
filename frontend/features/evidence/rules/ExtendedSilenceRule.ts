import { EvidenceRule, EvidenceContext } from './EvidenceRule';

export class ExtendedSilenceRule implements EvidenceRule {
  name = 'ExtendedSilenceRule';
  version = 1;

  initialize(): void {}
  reset(): void {}
  dispose(): void {}

  evaluate(context: EvidenceContext) {
    // If silence duration exceeds 5 seconds (5000ms), report extended silence
    if (context.currentSilence > 5000) {
      const silenceEvt = context.recentEvents.find((e) => e.type === 'LONG_SILENCE');
      const support = [silenceEvt?.id].filter(Boolean) as string[];

      return {
        type: 'EXTENDED_SILENCE',
        title: 'Extended silence',
        description: `Extended silence observed for ${Math.round(context.currentSilence / 100) / 10} seconds.`,
        confidence: 0.95,
        severity: 'medium' as const,
        supportingEvents: support,
      };
    }

    return null;
  }
}

export const extendedSilenceRule = new ExtendedSilenceRule();
export default extendedSilenceRule;
