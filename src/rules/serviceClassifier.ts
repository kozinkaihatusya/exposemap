import type {
  ComposeProject,
  ComposeService,
  ExposureClassification,
  ExposureReport,
  Finding,
  ServiceAnalysis
} from "../types.js";
import { getBroadlyBoundPorts } from "./directExposure.js";
import { getLocalhostBindings } from "./localhostBindings.js";
import { parsePortMappings } from "./ports.js";
import { hasReverseProxyRoutingHint, isLikelyReverseProxyService } from "./reverseProxy.js";
import { findRiskyDirectExposure } from "./riskyServices.js";
import { renderMermaidDiagram } from "../report/mermaid.js";

export function analyzeProject(project: ComposeProject): ExposureReport {
  const analyses = project.services.map(analyzeService);
  const findings = analyses.flatMap((service) => service.findings);

  addReverseProxyClarityFindings(analyses, findings);

  return {
    filePath: project.filePath,
    services: analyses,
    findings,
    generatedAt: new Date().toISOString(),
    mermaid: renderMermaidDiagram(analyses)
  };
}

export function analyzeService(service: ComposeService): ServiceAnalysis {
  const ports = parsePortMappings(service.ports);
  const broadPorts = getBroadlyBoundPorts(ports);
  const localhostPorts = getLocalhostBindings(ports);
  const isReverseProxy = isLikelyReverseProxyService(service);
  const hasReverseProxyRouting = hasReverseProxyRoutingHint(service);
  const notes: string[] = [];
  const classification = classifyService({
    ports,
    broadPorts,
    localhostPorts,
    hasReverseProxyRouting,
    service
  });

  const findings: Finding[] = [
    ...findRiskyDirectExposure(service.name, broadPorts),
    ...buildInformationalFindings(service.name, classification, localhostPorts)
  ];

  if (ports.length !== service.ports.length) {
    findings.push({
      ruleId: "unknown-port-syntax",
      severity: "medium",
      service: service.name,
      title: "Service exposure is unknown",
      description: "At least one port entry could not be parsed by ExposeMap.",
      evidence: JSON.stringify(service.ports),
      recommendation: "Review this service manually and consider opening an issue with a sanitized Compose snippet."
    });
    notes.push("One or more port mappings could not be parsed.");
  }

  return {
    service,
    classification,
    ports,
    broadPorts,
    localhostPorts,
    isReverseProxy,
    hasReverseProxyRouting,
    findings,
    notes
  };
}

function classifyService(input: {
  ports: ReturnType<typeof parsePortMappings>;
  broadPorts: ReturnType<typeof getBroadlyBoundPorts>;
  localhostPorts: ReturnType<typeof getLocalhostBindings>;
  hasReverseProxyRouting: boolean;
  service: ComposeService;
}): ExposureClassification {
  if (input.service.ports.length > 0 && input.ports.length !== input.service.ports.length) {
    return "unknown";
  }

  if (input.broadPorts.length > 0) {
    return "directly exposed";
  }

  if (input.ports.length > 0 && input.localhostPorts.length === input.ports.length) {
    return "localhost-only";
  }

  if (input.hasReverseProxyRouting) {
    return "reverse-proxy exposed";
  }

  if (input.ports.length === 0 && !input.hasReverseProxyRouting) {
    return "internal";
  }

  return "unknown";
}

function buildInformationalFindings(
  serviceName: string,
  classification: ExposureClassification,
  localhostPorts: ReturnType<typeof getLocalhostBindings>
): Finding[] {
  if (classification === "unknown") {
    return [
      {
        ruleId: "unknown-exposure",
        severity: "medium",
        service: serviceName,
        title: "Service exposure is unknown",
        description: "ExposeMap could not confidently classify this service from Compose configuration alone.",
        evidence: serviceName,
        recommendation: "Review this service manually, including reverse proxy, VPN, firewall, and host-level configuration."
      }
    ];
  }

  if (classification === "localhost-only") {
    return [
      {
        ruleId: "localhost-only",
        severity: "low",
        service: serviceName,
        title: "Service is localhost-only",
        description: "All parsed port mappings are bound to localhost.",
        evidence: localhostPorts.map((port) => port.evidence).join(", "),
        recommendation: "Keep this pattern for admin tools and databases unless broader access is intentional."
      }
    ];
  }

  if (classification === "internal") {
    return [
      {
        ruleId: "internal-service",
        severity: "low",
        service: serviceName,
        title: "Service appears internal",
        description: "No Compose port mappings or reverse proxy routing labels were detected.",
        evidence: serviceName,
        recommendation: "Confirm this matches the intended access path and document any VPN or proxy assumptions."
      }
    ];
  }

  return [];
}

function addReverseProxyClarityFindings(analyses: ServiceAnalysis[], findings: Finding[]): void {
  const reverseProxies = analyses.filter((service) => service.isReverseProxy);
  const routedServices = analyses.filter((service) => service.hasReverseProxyRouting);

  if (reverseProxies.length > 0 && routedServices.length === 0) {
    for (const reverseProxy of reverseProxies) {
      findings.push({
        ruleId: "reverse-proxy-routes-unclear",
        severity: "medium",
        service: reverseProxy.service.name,
        title: "Reverse proxy service detected but routed services are unclear",
        description:
          "A likely reverse proxy service exists, but ExposeMap did not find obvious routing labels on application services.",
        evidence: reverseProxy.service.image ?? reverseProxy.service.name,
        recommendation:
          "Review reverse proxy configuration outside Compose, such as mounted Caddyfiles, Nginx Proxy Manager state, Traefik dynamic config, or host files."
      });
    }
  }
}
