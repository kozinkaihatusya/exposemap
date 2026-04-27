import type { PortMapping } from "../types.js";

export function getLocalhostBindings(ports: PortMapping[]): PortMapping[] {
  return ports.filter((port) => port.isLocalhostBound);
}

export function hasOnlyLocalhostBindings(ports: PortMapping[]): boolean {
  return ports.length > 0 && ports.every((port) => port.isLocalhostBound);
}
