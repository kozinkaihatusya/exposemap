import { describe, expect, it } from "vitest";
import { parseComposeContent } from "../src/parser.js";
import { analyzeProject } from "../src/rules/serviceClassifier.js";

describe("service classification", () => {
  it("classifies internal, localhost-only, directly exposed, and reverse-proxy exposed services", () => {
    const project = parseComposeContent(`
services:
  web:
    image: nginx
    ports:
      - "80:80"
  admin:
    image: adminer
    ports:
      - "127.0.0.1:8080:8080"
  app:
    image: app
    labels:
      traefik.enable: "true"
      traefik.http.routers.app.rule: Host(\`app.example.test\`)
  worker:
    image: worker
`);

    const report = analyzeProject(project);
    const classifications = Object.fromEntries(
      report.services.map((service) => [service.service.name, service.classification])
    );

    expect(classifications).toEqual({
      web: "directly exposed",
      admin: "localhost-only",
      app: "reverse-proxy exposed",
      worker: "internal"
    });
  });
});
