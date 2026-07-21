import { FacePresenceMeasurement } from '../types/vision';

export class FacePresenceExtractor {
  extract(landmarksList: any[][]): FacePresenceMeasurement {
    const faceCount = landmarksList ? landmarksList.length : 0;
    
    let confidence = 1.0;
    if (faceCount === 0) {
      confidence = 0.0;
    } else if (faceCount > 1) {
      confidence = 0.8; // Lower confidence of individual tracking if multiple
    }

    return {
      faceCount,
      confidence,
    };
  }
}

export const facePresenceExtractor = new FacePresenceExtractor();
export default facePresenceExtractor;
