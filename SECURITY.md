# Security Policy

ExposeMap is a local, read-only Docker Compose configuration review tool. It does not perform real network scans, connect to containers, modify Compose files, or send reports anywhere.

ExposeMap is not a full security audit. Its findings are heuristics based on Compose configuration and should be reviewed alongside firewall rules, reverse proxy configuration, VPN setup, DNS, cloud security groups, and host-level settings.

## Reporting Security Concerns

Please report security concerns by contacting the maintainer through the GitHub profile. Do not post secrets, credentials, private compose files, or sensitive infrastructure details in public issues.

## Handling Sensitive Data

- Do not paste private Compose files into public issues.
- Do not paste `.env` files, credentials, API keys, tokens, private domains, or internal hostnames.
- If a Compose snippet is needed, reduce it to the smallest sanitized example that reproduces the issue.

## Scope

Security reports about ExposeMap itself are welcome, especially issues involving unsafe file handling, accidental data disclosure, dependency risks, or misleading output that could cause unsafe conclusions.
