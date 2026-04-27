import { parseComposeFile } from "./parser.js";
import { analyzeProject } from "./rules/serviceClassifier.js";
import { renderMarkdownReport } from "./report/markdown.js";
import type { ExposureReport } from "./types.js";

export async function scanComposeFile(filePath: string): Promise<ExposureReport> {
  const project = await parseComposeFile(filePath);
  return analyzeProject(project);
}

export async function scanComposeFileToMarkdown(filePath: string): Promise<string> {
  const report = await scanComposeFile(filePath);
  return renderMarkdownReport(report);
}

export * from "./types.js";
export { parseComposeContent, parseComposeFile } from "./parser.js";
export { analyzeProject, analyzeService } from "./rules/serviceClassifier.js";
export { renderMarkdownReport } from "./report/markdown.js";
export { renderMermaidDiagram } from "./report/mermaid.js";
