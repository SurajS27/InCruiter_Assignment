import { focusService } from './FocusService';
import { visibilityService } from './VisibilityService';
import { windowService } from './WindowService';
import { networkService } from './NetworkService';
import { keyboardService } from './KeyboardService';
import { clipboardService } from './ClipboardService';
import { mouseService } from './MouseService';

export class BrowserTelemetryService {
  start(): void {
    focusService.start();
    visibilityService.start();
    windowService.start();
    networkService.start();
    keyboardService.start();
    clipboardService.start();
    mouseService.start();
  }

  stop(): void {
    focusService.stop();
    visibilityService.stop();
    windowService.stop();
    networkService.stop();
    keyboardService.stop();
    clipboardService.stop();
    mouseService.stop();
  }
}

export const browserTelemetryService = new BrowserTelemetryService();
export default browserTelemetryService;
