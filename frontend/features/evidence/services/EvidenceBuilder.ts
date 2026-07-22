import { Evidence } from '../types/evidence';

export class EvidenceBuilder {
  build(
    id: string,
    output: {
      type: string;
      title: string;
      description: string;
      confidence: number;
      severity: 'info' | 'low' | 'medium' | 'high';
      supportingEvents: string[];
      generatedBy: string;
      version: number;
    }
  ): Evidence {
    return {
      id,
      version: 1,
      timestamp: new Date().toISOString(),
      type: output.type as any,
      title: output.title,
      description: output.description,
      generatedBy: output.generatedBy,
      ruleVersion: output.version,
      confidence: output.confidence,
      severity: output.severity,
      status: 'ACTIVE',
      duration: 0.1,
      supportingEvents: output.supportingEvents,
    };
  }
}

export const evidenceBuilder = new EvidenceBuilder();
export default evidenceBuilder;
