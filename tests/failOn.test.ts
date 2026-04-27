import { describe, expect, it } from "vitest";
import { getExitCodeForReport, parseFailOnThreshold, violatesFailOnThreshold } from "../src/failOn.js";
import type { ExposureReport, Finding } from "../src/types.js";

describe("fail-on threshold handling", () => {
  it("parses supported thresholds", () => {
    expect(parseFailOnThreshold("none")).toBe("none");
    expect(parseFailOnThreshold("low")).toBe("low");
    expect(parseFailOnThreshold("medium")).toBe("medium");
    expect(parseFailOnThreshold("high")).toBe("high");
    expect(parseFailOnThreshold("critical")).toBeNull();
  });

  it("does not fail when threshold is none", () => {
    expect(violatesFailOnThreshold(reportWithFindings(["high"]), "none")).toBe(false);
    expect(getExitCodeForReport(reportWithFindings(["high"]), "none")).toBe(0);
  });

  it("fails on high only for high threshold", () => {
    expect(violatesFailOnThreshold(reportWithFindings(["medium"]), "high")).toBe(false);
    expect(getExitCodeForReport(reportWithFindings(["high"]), "high")).toBe(1);
  });

  it("fails on medium and high for medium threshold", () => {
    expect(getExitCodeForReport(reportWithFindings(["low"]), "medium")).toBe(0);
    expect(getExitCodeForReport(reportWithFindings(["medium"]), "medium")).toBe(1);
    expect(getExitCodeForReport(reportWithFindings(["high"]), "medium")).toBe(1);
  });

  it("fails on any finding for low threshold", () => {
    expect(getExitCodeForReport(reportWithFindings([]), "low")).toBe(0);
    expect(getExitCodeForReport(reportWithFindings(["low"]), "low")).toBe(1);
    expect(getExitCodeForReport(reportWithFindings(["medium"]), "low")).toBe(1);
    expect(getExitCodeForReport(reportWithFindings(["high"]), "low")).toBe(1);
  });
});

function reportWithFindings(severities: Finding["severity"][]): ExposureReport {
  return {
    filePath: "compose.yml",
    services: [],
    findings: severities.map((severity) => ({
      ruleId: `${severity}-rule`,
      severity,
      service: "app",
      title: `${severity} finding`,
      description: "Test finding",
      evidence: "test",
      recommendation: "Review the service."
    })),
    generatedAt: "2026-04-28T00:00:00.000Z",
    mermaid: "graph TD"
  };
}
