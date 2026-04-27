---
name: Setup Review Request
about: Request interest in a paid exposure, reverse proxy, or access setup review
title: "Setup review request: "
labels: question
assignees: ""
---

Do not paste secrets, credentials, private compose files, or sensitive infrastructure details.

## What kind of exposure setup do you want reviewed?

Briefly describe the setup and what you want checked.

## Main concern

- [ ] Public ports
- [ ] Reverse proxy
- [ ] Tailscale
- [ ] Cloudflare Tunnel
- [ ] Admin panels
- [ ] Database exposure
- [ ] Other:

## Approximate number of services

Example: 1-5, 6-20, 20+

## Reverse proxy or VPN tools used

Example: Traefik, Caddy, Nginx Proxy Manager, SWAG, Tailscale, WireGuard, Cloudflare Tunnel.

## Docker Compose snippet, without secrets, optional

```yaml
services:
  app:
    image: example/app
```

## Preferred contact method, optional

GitHub is fine. Add another contact method only if you are comfortable sharing it.

## Urgency, optional

Example: no rush, this week, before launch, active incident.
