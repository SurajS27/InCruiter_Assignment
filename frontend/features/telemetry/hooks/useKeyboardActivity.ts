import { useTelemetryStore } from '../../../store/useTelemetryStore';

export function useKeyboardActivity() {
  return useTelemetryStore((state) => state.keyboardActivity);
}

export default useKeyboardActivity;
