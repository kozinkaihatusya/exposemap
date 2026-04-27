# I built ExposeMap, an open-source exposure mapper for Docker Compose services

GitHub: https://github.com/kozinkaihatusya/exposemap

ExposeMap is a small local CLI for self-hosted Docker Compose stacks. It scans `docker-compose.yml` and classifies services as internal, localhost-only, directly exposed, reverse-proxy exposed, or unknown.

It generates a Markdown report and Mermaid diagram, and currently checks common port mappings, localhost bindings, Traefik-style labels, likely reverse proxy services, and risky directly exposed database/admin ports.

It does not perform real network scans, connect to containers, modify Compose files, or send anything anywhere. It is a read-only configuration review tool based on Compose heuristics.

Feedback and sanitized edge cases are welcome.
