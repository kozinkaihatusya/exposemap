# Contributing to ExposeMap

Thanks for considering a contribution. ExposeMap is intentionally small: a local TypeScript CLI that reviews Docker Compose configuration and prints exposure reports.

## Install

```bash
npm install
```

## Run Tests

```bash
npm test
```

## Build

```bash
npm run build
```

## Run the CLI Locally

```bash
npm run build
node dist/cli.js scan examples/risky-compose.yml --format markdown
```

## Add a New Rule

1. Add the rule implementation under `src/rules/`.
2. Keep the rule read-only and based on Compose configuration.
3. Add shared types to `src/types.ts` if needed.
4. Wire the rule into `src/rules/serviceClassifier.ts`.
5. Add focused Vitest coverage under `tests/`.
6. Update `README.md` if the user-visible behavior changes.

## Open an Issue or PR

- Use a concise title.
- Include the command you ran and the output you expected.
- Include sanitized Compose snippets only.
- Do not include secrets, tokens, private domains, credentials, private IP details, or sensitive infrastructure information.

## Coding Style

- Keep code readable and modular.
- Prefer explicit rule names and clear evidence strings.
- Avoid broad refactors in small PRs.
- Do not add network scanning, hosted dashboards, authentication, or container connections unless the issue explicitly calls for it.
- Run `npm test` and `npm run build` before opening a PR.
