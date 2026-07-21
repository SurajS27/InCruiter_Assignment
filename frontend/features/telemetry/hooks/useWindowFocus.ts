import { useTelemetryStore } from '../../../store/useTelemetryStore';

export function useWindowFocus() {
  return useTelemetryStore((state) => state.focusState);
}

export default useWindowFocus;
