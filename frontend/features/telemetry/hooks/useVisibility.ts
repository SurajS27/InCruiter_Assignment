import { useTelemetryStore } from '../../../store/useTelemetryStore';

export function useVisibility() {
  return useTelemetryStore((state) => state.visibilityState);
}

export default useVisibility;
