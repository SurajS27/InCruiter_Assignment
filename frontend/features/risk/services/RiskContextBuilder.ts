import { Evidence } from '../../evidence/types/evidence';
import { RiskContext } from '../rules/RiskRule';
import { useRiskStore } from '../store/useRiskStore';

export class RiskContextBuilder {
  buildContext(evidenceTimeline: Evidence[]): RiskContext {
    const attentionEvidence: Evidence[] = [];
    const focusEvidence: Evidence[] = [];
    const presenceEvidence: Evidence[] = [];
    const responseEvidence: Evidence[] = [];
    const audioEvidence: Evidence[] = [];
    const historicalEvidence: Evidence[] = [];

    // Filter evidence by category matching
    evidenceTimeline.forEach((e) => {
      if (e.status !== 'ACTIVE') {
        historicalEvidence.push(e);
      }

      if (e.type === 'OFF_SCREEN_ATTENTION') {
        attentionEvidence.push(e);
      } else if (e.type === 'BROWSER_FOCUS_LOST') {
        focusEvidence.push(e);
      } else if (e.type === 'MULTIPLE_FACES_PRESENT') {
        presenceEvidence.push(e);
      } else if (e.type === 'DELAYED_RESPONSE' || e.type === 'EXTENDED_SILENCE') {
        responseEvidence.push(e);
      } else if (e.type === 'LOW_AUDIO_LEVEL' || e.type === 'MICROPHONE_INTERRUPTION') {
        audioEvidence.push(e);
      }
    });

    const store = useRiskStore.getState();

    return {
      attentionEvidence,
      focusEvidence,
      presenceEvidence,
      responseEvidence,
      audioEvidence,
      historicalEvidence,
      assessmentHistory: store.assessmentHistory,
    };
  }
}

export const riskContextBuilder = new RiskContextBuilder();
export default riskContextBuilder;
