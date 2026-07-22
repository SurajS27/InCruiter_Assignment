import { RiskLevel } from '../types/risk';

export const RiskThresholds = [
  { min: 0, max: 24, level: 'LOW' as RiskLevel },
  { min: 25, max: 49, level: 'MODERATE' as RiskLevel },
  { min: 50, max: 74, level: 'HIGH' as RiskLevel },
  { min: 75, max: Infinity, level: 'CRITICAL' as RiskLevel },
];

export function getRiskLevelFromScore(score: number): RiskLevel {
  const rounded = Math.round(score);
  const match = RiskThresholds.find((t) => rounded >= t.min && rounded <= t.max);
  return match ? match.level : 'LOW';
}

export default RiskThresholds;
