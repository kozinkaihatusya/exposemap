I built ExposeMap, an open-source CLI for reviewing exposure in self-hosted Docker Compose stacks.

It scans a `docker-compose.yml` file and classifies services as internal, localhost-only, directly exposed, reverse-proxy exposed, or unknown. The report includes a summary table, high-risk findings, service details, and a Mermaid diagram.

The goal is intentionally modest: make Compose exposure easier to reason about before doing a deeper firewall, reverse proxy, VPN, or external exposure review.

ExposeMap runs locally, does not connect to containers, does not modify Compose files, does not send reports anywhere, and does not perform real network scans.

GitHub: https://github.com/kozinkaihatusya/exposemap

Feedback and sanitized edge cases are welcome.
