import { EvidenceContext } from '../rules/EvidenceRule';

export class EvidenceContextBuilder {
  buildContext(recentEvents: any[]): EvidenceContext {
    let currentHeadPose = null;
    let currentGaze = null;
    let browserFocused = true;
    let currentSpeechState = false;
    let currentSilence = 0;
    let responseLatency = 0;
    let activeFaces = 1;

    // Evaluate events in reverse chronological order to fetch latest state
    for (let i = recentEvents.length - 1; i >= 0; i--) {
      const event = recentEvents[i];

      if (event.type === 'HEAD_POSE_UPDATED') {
        if (!currentHeadPose) {
          currentHeadPose = {
            yaw: event.payload.yaw || 0,
            pitch: event.payload.pitch || 0,
            roll: event.payload.roll || 0,
            confidence: event.confidence || 1.0,
          };
        }
      } else if (event.type === 'GAZE_DIRECTION_UPDATED') {
        if (!currentGaze) {
          currentGaze = {
            direction: event.payload.direction || 'Center',
            confidence: event.confidence || 1.0,
          };
        }
      } else if (event.type === 'WINDOW_BLUR' || event.type === 'WINDOW_BLURRED' || event.type === 'TAB_HIDDEN') {
        browserFocused = false;
      } else if (event.type === 'WINDOW_FOCUS' || event.type === 'WINDOW_FOCUSED' || event.type === 'TAB_VISIBLE') {
        browserFocused = true;
      } else if (event.type === 'SPEECH_STARTED') {
        currentSpeechState = true;
      } else if (event.type === 'SPEECH_ENDED') {
        currentSpeechState = false;
      } else if (event.type === 'LONG_SILENCE') {
        currentSilence = Math.max(currentSilence, event.payload.durationMs || 0);
      } else if (event.type === 'RESPONSE_DELAY_UPDATED') {
        responseLatency = Math.max(responseLatency, event.payload.delayMs || 0);
      } else if (event.type === 'MULTIPLE_FACES') {
        activeFaces = Math.max(activeFaces, event.payload.faceCount || 2);
      } else if (event.type === 'FACE_LOST') {
        activeFaces = 0;
      } else if (event.type === 'FACE_DETECTED') {
        activeFaces = 1;
      }
    }

    return {
      currentHeadPose,
      currentGaze,
      browserFocused,
      currentSpeechState,
      currentSilence,
      responseLatency,
      activeFaces,
      recentEvents,
    };
  }
}

export const evidenceContextBuilder = new EvidenceContextBuilder();
export default evidenceContextBuilder;
