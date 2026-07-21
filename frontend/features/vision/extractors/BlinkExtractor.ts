import { BlinkMeasurement } from '../types/vision';

export class BlinkExtractor {
  private currentlyBlinking = false;
  private blinkStartTimestamp: number | null = null;
  private blinkTimestamps: number[] = [];
  private lastBlinkDuration = 0;

  extract(landmarks: any[]): BlinkMeasurement {
    if (!landmarks || landmarks.length < 160) {
      return { isBlinking: false, duration: 0, rate: 0, confidence: 0 };
    }

    // Right eye Vertical: top 159, bottom 145. Horizontal: corners 33, 133
    const rTop = landmarks[159];
    const rBottom = landmarks[145];
    const rOuter = landmarks[33];
    const rInner = landmarks[133];

    // Left eye Vertical: top 386, bottom 374. Horizontal: corners 362, 263
    const lTop = landmarks[386];
    const lBottom = landmarks[374];
    const lOuter = landmarks[263];
    const lInner = landmarks[362];

    const rEar = Math.abs(rTop.y - rBottom.y) / (Math.abs(rOuter.x - rInner.x) || 1);
    const lEar = Math.abs(lTop.y - lBottom.y) / (Math.abs(lOuter.x - lInner.x) || 1);
    const avgEar = (rEar + lEar) / 2;

    const threshold = 0.16; // Eye Aspect Ratio threshold for closed eye
    const now = Date.now();
    let isBlinking = false;

    if (avgEar < threshold) {
      isBlinking = true;
      if (!this.currentlyBlinking) {
        this.currentlyBlinking = true;
        this.blinkStartTimestamp = now;
      }
    } else {
      if (this.currentlyBlinking) {
        this.currentlyBlinking = false;
        if (this.blinkStartTimestamp) {
          const duration = now - this.blinkStartTimestamp;
          this.lastBlinkDuration = duration;
          this.blinkTimestamps.push(now);
        }
        this.blinkStartTimestamp = null;
      }
    }

    // Keep blink timestamps only in the last 60 seconds for rolling frequency rate
    this.blinkTimestamps = this.blinkTimestamps.filter((t) => now - t < 60000);
    const rate = this.blinkTimestamps.length; // Blinks per minute (rolling)

    return {
      isBlinking,
      duration: isBlinking ? (this.blinkStartTimestamp ? now - this.blinkStartTimestamp : 0) : this.lastBlinkDuration,
      rate,
      confidence: 0.95,
    };
  }
}

export const blinkExtractor = new BlinkExtractor();
export default blinkExtractor;
