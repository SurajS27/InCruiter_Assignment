import { TelemetryEvent } from '../types/telemetry';

export class TelemetryExporter {
  exportToJSON(events: TelemetryEvent[]): void {
    if (typeof window === 'undefined') return;

    const dataStr = JSON.stringify(events, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `telemetry_export_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  exportToCSV(events: TelemetryEvent[]): void {
    if (typeof window === 'undefined') return;

    // Build headers
    const headers = ['id', 'timestamp', 'category', 'source', 'type', 'severity', 'payload'];
    const rows = events.map((e) => [
      e.id,
      e.timestamp,
      e.category,
      e.source,
      e.type,
      e.severity,
      JSON.stringify(e.payload).replace(/"/g, '""'), // Escape double quotes for CSV formatting
    ]);

    const csvContent =
      [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `telemetry_export_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const telemetryExporter = new TelemetryExporter();
export default telemetryExporter;
