import { HeadPoseMeasurement } from '../types/vision';

export class HeadPoseExtractor {
  // Receives a normalized landmark array (each landmark is {x, y, z})
  extract(landmarks: any[]): HeadPoseMeasurement {
    if (!landmarks || landmarks.length < 160) {
      return { yaw: 0, pitch: 0, roll: 0, confidence: 0 };
    }

    // Keypoints mapping
    const nose = landmarks[4];
    const chin = landmarks[152];
    const leftEye = landmarks[263];
    const rightEye = landmarks[33];
    const forehead = landmarks[10];

    // 1. Yaw (Left-Right rotation): Compare nose relative to eye width
    const leftEyeToNoseX = leftEye.x - nose.x;
    const noseToRightEyeX = nose.x - rightEye.x;
    const eyeWidth = leftEye.x - rightEye.x;
    
    // Normalized ratio difference
    const yawRatio = (leftEyeToNoseX - noseToRightEyeX) / (eyeWidth || 1);
    const yaw = yawRatio * 75; // Map ratio to degrees (~ -45 to 45)

    // 2. Pitch (Up-Down rotation): Compare nose-forehead vs nose-chin vertical distance
    const noseToForeheadY = nose.y - forehead.y;
    const chinToNoseY = chin.y - nose.y;
    const faceHeight = chin.y - forehead.y;
    
    const pitchRatio = (noseToForeheadY - chinToNoseY) / (faceHeight || 1);
    const pitch = pitchRatio * 60; // Map ratio to degrees

    // 3. Roll (Tilt rotation): Angle of the eye line relative to horizontal axis
    const eyeDy = leftEye.y - rightEye.y;
    const eyeDx = leftEye.x - rightEye.x;
    const roll = Math.atan2(eyeDy, eyeDx || 1) * (180 / Math.PI);

    return {
      yaw: Math.round(yaw * 10) / 10,
      pitch: Math.round(pitch * 10) / 10,
      roll: Math.round(roll * 10) / 10,
      confidence: 0.95,
    };
  }
}

export const headPoseExtractor = new HeadPoseExtractor();
export default headPoseExtractor;
