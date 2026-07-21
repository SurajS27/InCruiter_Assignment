import { useVisionStore } from '../../../store/useVisionStore';
import { eventBus } from '../../../events/eventBus';

// Intercept WebAssembly / TensorFlow logging that prints to console.error, redirecting to console.info
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = function (...args: any[]) {
    const msg = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
    if (msg.includes('XNNPACK') || msg.includes('TensorFlow') || msg.includes('INFO:') || msg.includes('delegate') || msg.includes('created')) {
      originalWarn.apply(console, args);
      return;
    }
    originalError.apply(console, args);
  };
}

export class MediaPipeService {
  private landmarker: any = null;
  private initializing = false;

  async initialize(): Promise<any> {
    if (this.landmarker) return this.landmarker;
    if (this.initializing) return null;

    this.initializing = true;
    useVisionStore.getState().setInitError(null);

    try {
      // Dynamically load MediaPipe tasks-vision modules to prevent server-side render issues
      const { FilesetResolver, FaceLandmarker } = await import('@mediapipe/tasks-vision');
      
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const landmarkerInstance = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 2,
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
      });

      this.landmarker = landmarkerInstance;
      this.initializing = false;
      return this.landmarker;
    } catch (err: any) {
      console.error('Failed to initialize MediaPipe Face Landmarker:', err);
      this.initializing = false;
      
      // Update store error
      useVisionStore.getState().setInitError(err.message || 'MediaPipe initialization failed.');

      // Dispatch failure event
      eventBus.emit({
        type: 'VISION_INITIALIZATION_FAILED',
        payload: { error: err.message || 'MediaPipe initialization failed' },
      });
      
      throw err;
    }
  }

  getLandmarker() {
    return this.landmarker;
  }

  dispose(): void {
    if (this.landmarker) {
      try {
        this.landmarker.close();
      } catch (e) {
        console.warn('Error closing MediaPipe Landmarker:', e);
      }
      this.landmarker = null;
    }
  }
}

export const mediaPipeService = new MediaPipeService();
export default mediaPipeService;
