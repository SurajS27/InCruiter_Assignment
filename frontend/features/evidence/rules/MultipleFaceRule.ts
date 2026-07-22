import { EvidenceRule, EvidenceContext } from './EvidenceRule';

export class MultipleFaceRule implements EvidenceRule {
  name = 'MultipleFaceRule';
  version = 1;

  initialize(): void {}
  reset(): void {}
  dispose(): void {}

  evaluate(context: EvidenceContext) {
    if (context.activeFaces > 1) {
      const faceEvt = context.recentEvents.find((e) => e.type === 'MULTIPLE_FACES');
      const support = [faceEvt?.id].filter(Boolean) as string[];

      return {
        type: 'MULTIPLE_FACES_PRESENT',
        title: 'Multiple faces detected',
        description: `Visual feed indicates ${context.activeFaces} faces present.`,
        confidence: 0.9,
        severity: 'high' as const,
        supportingEvents: support,
      };
    }

    return null;
  }
}

export const multipleFaceRule = new MultipleFaceRule();
export default multipleFaceRule;
