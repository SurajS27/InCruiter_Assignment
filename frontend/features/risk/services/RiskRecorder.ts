import { RiskAssessment } from '../types/risk';

export class RiskRecorder {
  exportToJSON(timeline: RiskAssessment[]): void {
    if (typeof window === 'undefined') return;

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(timeline, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `risk_assessment_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  exportToCSV(timeline: RiskAssessment[]): void {
    if (typeof window === 'undefined') return;

    const headers = ['ID', 'Timestamp', 'Overall Risk', 'Total Contribution', 'Average Confidence', 'Primary Reasons', 'Summary', 'Risk Factors Count', 'Supporting Evidence Count'];
    const rows = timeline.map((e) => [
      e.id,
      e.timestamp,
      e.overallRisk,
      e.totalContribution,
      e.averageConfidence,
      `"${e.primaryReasons.join(',')}"`,
      `"${e.summary.replace(/"/g, '""')}"`,
      e.riskFactors.length,
      e.supportingEvidence.length,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `risk_assessment_log_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}

export const riskRecorder = new RiskRecorder();
export default riskRecorder;
