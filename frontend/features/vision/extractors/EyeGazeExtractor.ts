import { EyeGazeMeasurement } from '../types/vision';

export class EyeGazeExtractor {
  extract(landmarks: any[]): EyeGazeMeasurement {
    if (!landmarks || landmarks.length < 474) {
      return { direction: 'Center', confidence: 0 };
    }

    // Right Eye outer 33, inner 133, Iris center 468
    const rightOuter = landmarks[33];
    const rightInner = landmarks[133];
    const rightIris = landmarks[468];

    const eyeWidth = Math.abs(rightInner.x - rightOuter.x);
    if (eyeWidth === 0) return { direction: 'Center', confidence: 0.5 };

    // Ratio of pupil position within horizontal eye boundary
    // 0 = outer corner (Right side of face), 1 = inner corner (Center of face)
    const ratio = (rightIris.x - rightOuter.x) / eyeWidth;

    let direction: 'Left' | 'Right' | 'Up' | 'Down' | 'Center' = 'Center';
    let confidence = 0.9;

    // Check horizontal gaze direction
    if (ratio < 0.42) {
      direction = 'Right'; // Looking towards right of candidate (our left)
    } else if (ratio > 0.58) {
      direction = 'Left';  // Looking towards left of candidate (our right)
    }

    // Verify vertical offset (iris center relative to eye top/bottom average)
    // Top 159, Bottom 145
    const eyeHeight = Math.abs(landmarks[145].y - landmarks[159].y);
    if (eyeHeight > 0) {
      const verticalRatio = (rightIris.y - landmarks[159].y) / eyeHeight;
      if (verticalRatio < 0.35) {
        direction = 'Up';
      } else if (verticalRatio > 0.65) {
        direction = 'Down';
      }
    }

    return {
      direction,
      confidence,
    };
  }
}

export const eyeGazeExtractor = new EyeGazeExtractor();
export default eyeGazeExtractor;
