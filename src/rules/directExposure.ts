import type { PortMapping } from "../types.js";

export function getBroadlyBoundPorts(ports: PortMapping[]): PortMapping[] {
  return ports.filter((port) => port.isBroadlyBound);
}

export function hasDirectExposure(ports: PortMapping[]): boolean {
  return getBroadlyBoundPorts(ports).length > 0;
}
