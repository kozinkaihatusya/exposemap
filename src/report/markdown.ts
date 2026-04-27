import type { ExposureReport, Finding, ServiceAnalysis } from "../types.js";

export function renderMarkdownReport(report: ExposureReport): string {
  const highRiskFindings = report.findings.filter((finding) => finding.severity === "high");

  return [
    "# ExposeMap Report",
    "",
    `Scanned file: \`${report.filePath}\``,
    "",
    `Total services: ${report.services.length}`,
    "",
    "## Exposure Summary",
    "",
    renderSummaryTable(report.services),
    "",
    "## High-risk Findings",
    "",
    renderFindings(highRiskFindings, "No high-risk findings detected from Compose configuration."),
    "",
    "## Service Details",
    "",
    report.services.map(renderServiceDetails).join("\n\n"),
    "",
    "## Mermaid Diagram",
    "",
    "```mermaid",
    report.mermaid,
    "```",
    "",
    "## Limitations",
    "",
    "- ExposeMap is a lightweight, read-only configuration review tool.",
    "- Results are heuristic checks based on Docker Compose configuration.",
    "- ExposeMap does not prove real internet exposure.",
    "- ExposeMap does not perform real network scans.",
    "- ExposeMap does not connect to containers or modify Compose files.",
    "- Reverse proxy, firewall, VPN, DNS, cloud security group, and host-level rules can change real exposure.",
    ""
  ].join("\n");
}

function renderSummaryTable(services: ServiceAnalysis[]): string {
  return [
    "| Service | Classification | Ports | Reverse proxy hints |",
    "| --- | --- | --- | --- |",
    ...services.map((service) => {
      const ports = service.ports.map((port) => `\`${port.evidence}\``).join("<br>") || "-";
      const reverseProxyHints = [
        service.isReverseProxy ? "proxy service" : "",
        service.hasReverseProxyRouting ? "routing labels/env" : ""
      ]
        .filter(Boolean)
        .join(", ");

      return `| ${service.service.name} | ${service.classification} | ${ports} | ${reverseProxyHints || "-"} |`;
    })
  ].join("\n");
}

function renderFindings(findings: Finding[], emptyMessage: string): string {
  if (findings.length === 0) {
    return emptyMessage;
  }

  return findings
    .map(
      (finding) => [
        `### ${finding.title}`,
        "",
        `- Severity: ${finding.severity}`,
        `- Service: \`${finding.service}\``,
        `- Rule: \`${finding.ruleId}\``,
        `- Evidence: \`${finding.evidence}\``,
        `- Recommendation: ${finding.recommendation}`,
        "",
        finding.description
      ].join("\n")
    )
    .join("\n\n");
}

function renderServiceDetails(service: ServiceAnalysis): string {
  const findings = service.findings.length
    ? renderFindings(service.findings, "")
    : "No service-specific findings.";
  const ports = service.ports.length
    ? service.ports
        .map((port) => {
          const binding = port.isLocalhostBound ? "localhost-only" : "broad/public";
          return `- \`${port.evidence}\` (${binding})`;
        })
        .join("\n")
    : "- No Compose `ports` entries detected.";

  return [
    `### ${service.service.name}`,
    "",
    `Classification: **${service.classification}**`,
    "",
    "Ports:",
    "",
    ports,
    "",
    "Findings:",
    "",
    findings
  ].join("\n");
}
