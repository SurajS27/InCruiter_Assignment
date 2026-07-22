export interface EvidenceContext {
  currentHeadPose: { yaw: number; pitch: number; roll: number; confidence: number } | null;
  currentGaze: { direction: string; confidence: number } | null;
  browserFocused: boolean;
  currentSpeechState: boolean;
  currentSilence: number;
  responseLatency: number;
  activeFaces: number;
  recentEvents: any[];
}

export interface EvidenceRule {
  name: string;
  version: number;
  initialize(): void;
  evaluate(context: EvidenceContext): {
    type: string;
    title: string;
    description: string;
    confidence: number;
    severity: 'info' | 'low' | 'medium' | 'high';
    supportingEvents: string[];
  } | null;
  reset(): void;
  dispose(): void;
}
