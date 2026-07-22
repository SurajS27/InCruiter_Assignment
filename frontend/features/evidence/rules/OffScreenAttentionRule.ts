import { EvidenceRule, EvidenceContext } from './EvidenceRule';

export class OffScreenAttentionRule implements EvidenceRule {
  name = 'OffScreenAttentionRule';
  version = 1;

  initialize(): void {}
  reset(): void {}
  dispose(): void {}

  evaluate(context: EvidenceContext) {
    const pose = context.currentHeadPose;
    const gaze = context.currentGaze;

    if (!pose || !gaze) return null;

    // Check if head turn angle exceeds thresholds (Yaw > 15 or Pitch > 12)
    const headTurned = Math.abs(pose.yaw) > 15 || Math.abs(pose.pitch) > 12;
    const gazeShifted = gaze.direction !== 'Center';

    if (headTurned && gazeShifted) {
      // Find the supporting event IDs in recent history
      const poseEvt = context.recentEvents.find((e) => e.type === 'HEAD_POSE_UPDATED');
      const gazeEvt = context.recentEvents.find((e) => e.type === 'GAZE_DIRECTION_UPDATED');
      const support = [poseEvt?.id, gazeEvt?.id].filter(Boolean) as string[];

      return {
        type: 'OFF_SCREEN_ATTENTION',
        title: 'Attention moved away',
        description: `Candidate gaze and head pose shifted away (Yaw: ${pose.yaw}°, Gaze: ${gaze.direction}).`,
        confidence: Math.round(((pose.confidence + gaze.confidence) / 2) * 100) / 100,
        severity: 'medium' as const,
        supportingEvents: support,
      };
    }

    return null;
  }
}

export const offScreenAttentionRule = new OffScreenAttentionRule();
export default offScreenAttentionRule;
