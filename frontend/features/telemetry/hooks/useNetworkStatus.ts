import { useTelemetryStore } from '../../../store/useTelemetryStore';

export function useNetworkStatus() {
  return useTelemetryStore((state) => state.networkState);
}

export default useNetworkStatus;
