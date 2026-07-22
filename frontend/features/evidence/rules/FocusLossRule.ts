import { EvidenceRule, EvidenceContext } from './EvidenceRule';

export class FocusLossRule implements EvidenceRule {
  name = 'FocusLossRule';
  version = 1;

  initialize(): void {}
  reset(): void {}
  dispose(): void {}

  evaluate(context: EvidenceContext) {
    if (!context.browserFocused) {
      // Find the supporting window focus/blur or tab visible/hidden events in recent events
      const blurEvt = context.recentEvents.find((e) => e.type === 'WINDOW_BLUR' || e.type === 'WINDOW_BLURRED');
      const hiddenEvt = context.recentEvents.find((e) => e.type === 'TAB_HIDDEN');
      
      const support = [blurEvt?.id, hiddenEvt?.id].filter(Boolean) as string[];

      return {
        type: 'BROWSER_FOCUS_LOST',
        title: 'Browser Focus Lost',
        description: 'Interview session temporarily lost browser tab or window focus.',
        confidence: 1.0,
        severity: 'high' as const,
        supportingEvents: support,
      };
    }

    return null;
  }
}

export const focusLossRule = new FocusLossRule();
export default focusLossRule;
