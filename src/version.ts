import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

interface PackageJson {
  version?: string;
}

export const TOOL_NAME = "ExposeMap";

export function getToolVersion(): string {
  try {
    const packageJson = require("../package.json") as PackageJson;
    return packageJson.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}
