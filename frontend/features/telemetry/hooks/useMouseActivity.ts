import { useTelemetryStore } from '../../../store/useTelemetryStore';

export function useMouseActivity() {
  return useTelemetryStore((state) => state.mouseActivity);
}

export default useMouseActivity;
