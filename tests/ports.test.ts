import { describe, expect, it } from "vitest";
import { parsePortMapping } from "../src/rules/ports.js";

describe("parsePortMapping", () => {
  it("parses broad short syntax", () => {
    const port = parsePortMapping("80:80");

    expect(port).toMatchObject({
      published: "80",
      target: "80",
      isLocalhostBound: false,
      isBroadlyBound: true
    });
  });

  it("parses localhost short syntax", () => {
    const port = parsePortMapping("127.0.0.1:8080:8080");

    expect(port).toMatchObject({
      hostIp: "127.0.0.1",
      published: "8080",
      target: "8080",
      isLocalhostBound: true,
      isBroadlyBound: false
    });
  });

  it("parses localhost host name short syntax", () => {
    const port = parsePortMapping("localhost:3000:3000");

    expect(port).toMatchObject({
      hostIp: "localhost",
      isLocalhostBound: true,
      isBroadlyBound: false
    });
  });

  it("parses long syntax with host_ip", () => {
    const port = parsePortMapping({
      target: 5432,
      published: 5432,
      host_ip: "127.0.0.1",
      protocol: "tcp"
    });

    expect(port).toMatchObject({
      syntax: "long",
      target: "5432",
      published: "5432",
      hostIp: "127.0.0.1",
      protocol: "tcp",
      isLocalhostBound: true
    });
  });
});
