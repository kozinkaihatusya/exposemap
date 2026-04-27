import { describe, expect, it } from "vitest";
import { findRiskyDirectExposure } from "../src/rules/riskyServices.js";
import { parsePortMappings } from "../src/rules/ports.js";
import { getBroadlyBoundPorts } from "../src/rules/directExposure.js";

describe("risky direct exposure detection", () => {
  it("flags directly exposed PostgreSQL", () => {
    const ports = getBroadlyBoundPorts(parsePortMappings(["5432:5432"]));
    const findings = findRiskyDirectExposure("db", ports);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      severity: "high",
      title: "PostgreSQL appears directly exposed"
    });
  });

  it("flags directly exposed admin ports", () => {
    const ports = getBroadlyBoundPorts(parsePortMappings(["8080:8080"]));
    const findings = findRiskyDirectExposure("admin", ports);

    expect(findings[0]?.title).toContain("Admin");
  });

  it("does not flag localhost-only Redis", () => {
    const ports = getBroadlyBoundPorts(parsePortMappings(["127.0.0.1:6379:6379"]));
    const findings = findRiskyDirectExposure("redis", ports);

    expect(findings).toHaveLength(0);
  });
});
