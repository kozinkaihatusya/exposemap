import type { ServiceAnalysis } from "../types.js";

export function renderMermaidDiagram(services: ServiceAnalysis[]): string {
  const lines = ["graph TD"];
  const reverseProxies = services.filter((service) => service.isReverseProxy);
  const routedServices = services.filter((service) => service.hasReverseProxyRouting && !service.isReverseProxy);
  const directlyExposed = services.filter(
    (service) => service.classification === "directly exposed" && !service.isReverseProxy
  );
  const internal = services.filter((service) => service.classification === "internal");
  const localhostOnly = services.filter((service) => service.classification === "localhost-only");
  const unknown = services.filter((service) => service.classification === "unknown");

  lines.push("  Internet[Internet]");
  lines.push("  Localhost[Localhost]");
  lines.push("  InternalNetwork[Internal network]");

  if (reverseProxies.length > 0) {
    for (const proxy of reverseProxies) {
      lines.push(`  Internet --> ${nodeId(proxy.service.name)}[${escapeLabel(proxy.service.name)}]`);
    }

    for (const proxy of reverseProxies) {
      for (const service of routedServices) {
        lines.push(`  ${nodeId(proxy.service.name)} --> ${nodeId(service.service.name)}[${escapeLabel(service.service.name)}]`);
      }
    }
  }

  for (const service of directlyExposed) {
    lines.push(`  Internet --> ${nodeId(service.service.name)}[${escapeLabel(service.service.name)}]`);
  }

  for (const service of localhostOnly) {
    lines.push(`  Localhost --> ${nodeId(service.service.name)}[${escapeLabel(service.service.name)}]`);
  }

  for (const service of internal) {
    lines.push(`  InternalNetwork --> ${nodeId(service.service.name)}[${escapeLabel(service.service.name)}]`);
  }

  for (const service of unknown) {
    lines.push(`  Unknown[Unknown exposure] -.-> ${nodeId(service.service.name)}[${escapeLabel(service.service.name)}]`);
  }

  addDependencyEdges(lines, services);

  return Array.from(new Set(lines)).join("\n");
}

function addDependencyEdges(lines: string[], services: ServiceAnalysis[]): void {
  const knownServices = new Set(services.map((service) => service.service.name));

  for (const service of services) {
    for (const dependency of service.service.dependsOn) {
      if (knownServices.has(dependency)) {
        lines.push(`  ${nodeId(service.service.name)} --> ${nodeId(dependency)}[${escapeLabel(dependency)}]`);
      }
    }
  }
}

function nodeId(name: string): string {
  return `svc_${name.replace(/[^a-zA-Z0-9_]/g, "_")}`;
}

function escapeLabel(label: string): string {
  return label.replace(/"/g, "'");
}
