import type { ExposureReport, Severity } from "./types.js";

export type FailOnThreshold = Severity | "none";

const SEVERITY_RANK: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3
};

export function parseFailOnThreshold(value: string): FailOnThreshold | null {
  if (value === "none" || value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return null;
}

export function violatesFailOnThreshold(report: ExposureReport, threshold: FailOnThreshold): boolean {
  if (threshold === "none") {
    return false;
  }

  const minimumRank = SEVERITY_RANK[threshold];
  return report.findings.some((finding) => SEVERITY_RANK[finding.severity] >= minimumRank);
}

export function getExitCodeForReport(report: ExposureReport, threshold: FailOnThreshold): 0 | 1 {
  return violatesFailOnThreshold(report, threshold) ? 1 : 0;
}
