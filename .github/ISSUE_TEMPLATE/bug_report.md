---
name: Bug report
about: Report incorrect behavior or an unexpected error
title: ""
labels: bug
assignees: ""
---

## Environment

- OS:
- Node.js version:
- ExposeMap version or commit:
- Docker version, if relevant:

## Command Run

```bash
exposemap scan ./docker-compose.yml --format markdown
```

## Expected Behavior

What did you expect ExposeMap to report?

## Actual Behavior

What happened instead?

## Compose Snippet Without Secrets

Please include the smallest sanitized Compose snippet that reproduces the issue.

```yaml
services:
  app:
    image: example/app
```

## Logs

```text
Paste relevant logs here.
```
