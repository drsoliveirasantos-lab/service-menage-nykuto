# Source of truth — Service Ménage Nykuto

This file defines what future contributors and AI assistants should treat as authoritative.

## Branches

- `main` is production.
- Use a short working branch for each change.
- Use `preview` only if the repository maintains a preview branch.

## Editable sources

The editable source files are the project files used to build or serve the site: HTML, CSS, JavaScript, assets, and any source folders declared in this repository.

When a generated or bundled file exists, do not treat it as the primary editing surface until its source path is identified.

## Documentation

- `AGENTS.md` = operating rules for AI agents.
- `.github/copilot-instructions.md` = repository-level AI instructions.
- `docs/site-architecture.md` = repository organization and workflow.

## Validation

The hygiene script is:

```bash
node scripts/validate-repository-hygiene.js
```

The GitHub workflow is:

```txt
.github/workflows/repository-hygiene.yml
```

## Forbidden stale material

Do not keep temporary archives, backup copies, debug workflows, or old generated dumps in the repository unless explicitly documented and validated.
