export class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  saveTheme(theme: 'light' | 'dark'): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('interview_theme', theme);
  }

  loadTheme(): 'light' | 'dark' {
    if (!this.isBrowser()) return 'dark';
    return (localStorage.getItem('interview_theme') as 'light' | 'dark') || 'dark';
  }

  saveCandidate(name: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('interview_candidate_name', name);
  }

  loadCandidate(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem('interview_candidate_name') || '';
  }

  savePreferences(prefs: { cameraEnabled: boolean; microphoneEnabled: boolean; animationsEnabled: boolean }): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('interview_preferences', JSON.stringify(prefs));
  }

  loadPreferences(): { cameraEnabled: boolean; microphoneEnabled: boolean; animationsEnabled: boolean } | null {
    if (!this.isBrowser()) return null;
    const item = localStorage.getItem('interview_preferences');
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  }

  clear(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('interview_candidate_name');
    localStorage.removeItem('interview_preferences');
  }
}

export const storageService = new StorageService();
export default storageService;
