import { describe, expect, it } from "vitest";
import { hasReverseProxyRoutingHint, isLikelyReverseProxyService } from "../src/rules/reverseProxy.js";
import type { ComposeService } from "../src/types.js";

describe("reverse proxy detection", () => {
  it("detects likely reverse proxy services by image", () => {
    expect(isLikelyReverseProxyService(service({ name: "proxy", image: "traefik:v3" }))).toBe(true);
    expect(isLikelyReverseProxyService(service({ name: "caddy", image: "caddy:2" }))).toBe(true);
  });

  it("detects Traefik routing labels", () => {
    expect(
      hasReverseProxyRoutingHint(
        service({
          labels: {
            "traefik.enable": "true",
            "traefik.http.routers.app.rule": "Host(`app.example.test`)"
          }
        })
      )
    ).toBe(true);
  });

  it("detects environment routing hints", () => {
    expect(
      hasReverseProxyRoutingHint(
        service({
          environment: {
            VIRTUAL_HOST: "app.example.test"
          }
        })
      )
    ).toBe(true);
  });
});

function service(input: Partial<ComposeService>): ComposeService {
  return {
    name: "app",
    ports: [],
    labels: {},
    environment: {},
    dependsOn: [],
    raw: {},
    ...input
  };
}
