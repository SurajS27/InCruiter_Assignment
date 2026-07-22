import { Evidence } from '../types/evidence';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { evidenceBuilder } from './EvidenceBuilder';

export class EvidenceDeduplicator {
  deduplicateAndStore(
    ruleOutputs: Array<{
      type: string;
      title: string;
      description: string;
      confidence: number;
      severity: 'info' | 'low' | 'medium' | 'high';
      supportingEvents: string[];
      generatedBy: string;
      version: number;
    }>
  ): void {
    const store = useEvidenceStore.getState();
    const activeEvidences = [...store.activeEvidence];

    // Track which types of evidence were generated in this tick
    const generatedTypes = new Set<string>();

    ruleOutputs.forEach((output) => {
      generatedTypes.add(output.type);

      const existing = activeEvidences.find((e) => e.type === output.type);
      if (existing) {
        // 1. Update existing active evidence duration
        const durationSec = (Date.now() - new Date(existing.timestamp).getTime()) / 1000;
        
        // Merge supporting events if there are new ones
        const mergedSupporting = Array.from(new Set([...existing.supportingEvents, ...output.supportingEvents]));

        const updated: Evidence = {
          ...existing,
          duration: Math.round(durationSec * 10) / 10,
          supportingEvents: mergedSupporting,
        };

        store.updateEvidence(updated);
      } else {
        // 2. Build and add new Evidence object
        const newEvidenceId = `ev_${String(store.timeline.length + 1).padStart(3, '0')}`;
        const newEv = evidenceBuilder.build(newEvidenceId, output);
        store.addEvidence(newEv);
      }
    });

    // 3. Deactivate (expire) active evidence types that are no longer reported
    activeEvidences.forEach((active) => {
      if (!generatedTypes.has(active.type)) {
        store.expireEvidence(active.id);
      }
    });
  }
}

export const evidenceDeduplicator = new EvidenceDeduplicator();
export default evidenceDeduplicator;
