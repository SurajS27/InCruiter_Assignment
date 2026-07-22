import { offScreenAttentionRule } from '../rules/OffScreenAttentionRule';
import { focusLossRule } from '../rules/FocusLossRule';
import { delayedResponseRule } from '../rules/DelayedResponseRule';
import { multipleFaceRule } from '../rules/MultipleFaceRule';
import { extendedSilenceRule } from '../rules/ExtendedSilenceRule';
import { evidenceContextBuilder } from './EvidenceContextBuilder';
import { evidenceDeduplicator } from './EvidenceDeduplicator';
import { useEvidenceStore } from '../store/useEvidenceStore';

export class EvidenceCorrelator {
  private eventsBuffer: any[] = [];
  private timeWindowMs = 30000; // 30-second window
  private maxBufferCount = 1000;
  
  private rules = [
    offScreenAttentionRule,
    focusLossRule,
    delayedResponseRule,
    multipleFaceRule,
    extendedSilenceRule,
  ];

  correlate(newEvent: any): void {
    const startProc = performance.now();

    // 1. Add to buffer
    this.eventsBuffer.push(newEvent);

    // 2. Prune old events (older than 30s) and enforce maximum limit
    const now = Date.now();
    const originalLength = this.eventsBuffer.length;
    
    this.eventsBuffer = this.eventsBuffer.filter(
      (evt) => now - new Date(evt.timestamp).getTime() < this.timeWindowMs
    );

    if (this.eventsBuffer.length > this.maxBufferCount) {
      this.eventsBuffer = this.eventsBuffer.slice(-this.maxBufferCount);
    }

    const expiredCount = originalLength - this.eventsBuffer.length;

    // 3. Build context for the rules engine
    const context = evidenceContextBuilder.buildContext(this.eventsBuffer);

    // 4. Run rules
    const outputs: any[] = [];
    this.rules.forEach((rule) => {
      try {
        const result = rule.evaluate(context);
        if (result) {
          outputs.push({
            ...result,
            generatedBy: rule.name,
            version: rule.version,
          });
        }
      } catch (err) {
        console.error(`Rule ${rule.name} failed evaluation:`, err);
      }
    });

    // 5. Deduplicate and merge events
    evidenceDeduplicator.deduplicateAndStore(outputs);

    // 6. Update processing statistics
    const latency = performance.now() - startProc;
    useEvidenceStore.getState().updateStatistics((prev) => ({
      rulesEvaluatedCount: prev.rulesEvaluatedCount + this.rules.length,
      processingTimeMs: Math.round(latency * 10) / 10,
      expiredCount: prev.expiredCount + expiredCount,
    }));
  }

  getEventsBuffer() {
    return this.eventsBuffer;
  }

  clear(): void {
    this.eventsBuffer = [];
    this.rules.forEach((r) => r.reset());
  }
}

export const evidenceCorrelator = new EvidenceCorrelator();
export default evidenceCorrelator;
