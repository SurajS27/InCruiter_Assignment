import { RiskRule, RiskContext } from './RiskRule';
import { RiskFactor } from '../types/risk';
import { RiskWeights } from '../config/RiskWeights';

export class AudioRiskRule implements RiskRule {
  name = 'AudioRiskRule';
  version = 1;

  initialize(): void {}
  reset(): void {}
  dispose(): void {}

  evaluate(context: RiskContext): RiskFactor | null {
    const list = context.audioEvidence;
    if (list.length === 0) return null;

    let totalWeight = 0;
    let totalConfidence = 0;
    const supporting: string[] = [];

    list.forEach((e) => {
      let w = 0;
      if (e.type === 'LOW_AUDIO_LEVEL') {
        w = RiskWeights.LOW_AUDIO_LEVEL;
      } else if (e.type === 'MICROPHONE_INTERRUPTION') {
        w = RiskWeights.MICROPHONE_INTERRUPTION;
      }

      totalWeight += w;
      totalConfidence += e.confidence * w;
      supporting.push(e.id);
    });

    const avgConfidence = list.reduce((sum, e) => sum + e.confidence, 0) / list.length;
    const contribution = totalConfidence / list.length;

    return {
      id: `rf_aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category: 'Audio Reliability',
      title: 'Microphone Mutes & Low Audio Levels',
      description: `Detected low voice volumes or device switch interruptions (Count: ${list.length}).`,
      generatedBy: this.name,
      ruleVersion: this.version,
      configuredWeight: totalWeight,
      confidence: Math.round(avgConfidence * 100) / 100,
      contribution: Math.round(contribution * 10) / 10,
      severity: 'low',
      supportingEvidence: supporting,
    };
  }
}

export const audioRiskRule = new AudioRiskRule();
export default audioRiskRule;
