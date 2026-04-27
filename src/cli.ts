#!/usr/bin/env node
import { Command } from "commander";
import { scanComposeFileToMarkdown } from "./index.js";

const program = new Command();

program
  .name("exposemap")
  .description("Open-source exposure mapper for self-hosted Docker Compose services")
  .version("0.1.0");

program
  .command("scan")
  .argument("<compose-file>", "Path to docker-compose.yml")
  .option("--format <format>", "Report format: markdown", "markdown")
  .description("Scan a Docker Compose file and print an exposure report")
  .action(async (composeFile: string, options: { format: string }) => {
    if (options.format !== "markdown") {
      console.error(`Unsupported format: ${options.format}. The MVP currently supports markdown only.`);
      process.exitCode = 1;
      return;
    }

    try {
      const report = await scanComposeFileToMarkdown(composeFile);
      process.stdout.write(report);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`ExposeMap failed: ${message}`);
      process.exitCode = 1;
    }
  });

program.parseAsync();
