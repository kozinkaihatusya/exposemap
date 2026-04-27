import type { ComposeService } from "../types.js";

const REVERSE_PROXY_KEYWORDS = [
  "traefik",
  "caddy",
  "nginx",
  "nginx-proxy-manager",
  "haproxy",
  "swag",
  "letsencrypt"
];

const ROUTING_ENV_HINTS = ["VIRTUAL_HOST", "LETSENCRYPT_HOST", "CADDY_HOST"];

export function isLikelyReverseProxyService(service: ComposeService): boolean {
  const haystack = `${service.name} ${service.image ?? ""}`.toLowerCase();

  if (REVERSE_PROXY_KEYWORDS.some((keyword) => haystack.includes(keyword))) {
    return true;
  }

  return tokenize(haystack).includes("npm");
}

export function hasReverseProxyRoutingHint(service: ComposeService): boolean {
  return hasTraefikRoutingHint(service.labels) || hasCaddyLikeHint(service.labels) || hasEnvironmentRoutingHint(service.environment);
}

export function hasTraefikRoutingHint(labels: Record<string, string>): boolean {
  return Object.entries(labels).some(([key, value]) => {
    const normalizedKey = key.toLowerCase();
    const normalizedValue = value.toLowerCase();

    if (normalizedKey === "traefik.enable") {
      return normalizedValue === "true";
    }

    return (
      normalizedKey.startsWith("traefik.http.routers.") ||
      normalizedKey.startsWith("traefik.http.services.") ||
      normalizedKey.startsWith("traefik.http.middlewares.")
    );
  });
}

function hasCaddyLikeHint(labels: Record<string, string>): boolean {
  return Object.entries(labels).some(([key, value]) => {
    const entry = `${key}=${value}`.toLowerCase();
    return entry.includes("caddy") && (entry.includes("host") || entry.includes("reverse_proxy"));
  });
}

function hasEnvironmentRoutingHint(environment: Record<string, string>): boolean {
  return ROUTING_ENV_HINTS.some((key) => {
    const value = environment[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

function tokenize(value: string): string[] {
  return value.split(/[^a-z0-9]+/).filter(Boolean);
}
