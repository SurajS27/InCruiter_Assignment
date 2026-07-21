import { headPoseExtractor } from '../extractors/HeadPoseExtractor';
import { eyeGazeExtractor } from '../extractors/EyeGazeExtractor';
import { blinkExtractor } from '../extractors/BlinkExtractor';
import { normalizeHeadPose, normalizeEyeGaze, normalizeBlink } from '../normalizers/VisionNormalizer';
import { eventBus } from '../../../events/eventBus';
import { useVisionStore } from '../../../store/useVisionStore';

export class LandmarkService {
  processLandmarks(faceLandmarks: any[]): void {
    if (!faceLandmarks || faceLandmarks.length === 0) return;

    // We only extract features for the primary detected face
    const primaryFace = faceLandmarks[0];

    // 1. Extract Head Pose
    const poseMeasurement = headPoseExtractor.extract(primaryFace);
    useVisionStore.getState().updateHeadPose(poseMeasurement);
    eventBus.emit(normalizeHeadPose(poseMeasurement));

    // 2. Extract Eye Gaze
    const gazeMeasurement = eyeGazeExtractor.extract(primaryFace);
    useVisionStore.getState().updateGazeDirection(gazeMeasurement);
    eventBus.emit(normalizeEyeGaze(gazeMeasurement));

    // 3. Extract Blink Status
    const blinkMeasurement = blinkExtractor.extract(primaryFace);
    useVisionStore.getState().updateBlinkRate(blinkMeasurement);
    if (blinkMeasurement.isBlinking) {
      eventBus.emit(normalizeBlink(blinkMeasurement));
    }
  }
}

export const landmarkService = new LandmarkService();
export default landmarkService;
