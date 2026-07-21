import { useTelemetryStore } from '../../../store/useTelemetryStore';

export function useClipboardActivity() {
  return useTelemetryStore((state) => state.clipboardState);
}

export default useClipboardActivity;
