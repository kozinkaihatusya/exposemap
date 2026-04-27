import { describe, expect, it } from "vitest";
import { parseComposeContent } from "../src/parser.js";
import { analyzeProject } from "../src/rules/serviceClassifier.js";

describe("Mermaid diagram generation", () => {
  it("renders internet, reverse proxy, routed service, and dependencies", () => {
    const project = parseComposeContent(`
services:
  traefik:
    image: traefik:v3
    ports:
      - "80:80"
  web:
    image: web
    labels:
      traefik.enable: "true"
      traefik.http.routers.web.rule: Host(\`web.example.test\`)
    depends_on:
      - db
  db:
    image: postgres
`);

    const report = analyzeProject(project);

    expect(report.mermaid).toContain("graph TD");
    expect(report.mermaid).toContain("Internet --> svc_traefik");
    expect(report.mermaid).toContain("svc_traefik --> svc_web");
    expect(report.mermaid).toContain("svc_web --> svc_db");
  });
});
