# Agent Operating Instructions

Repository-specific guidance for editing the Making Models FAIR Hugo/Docsy site.

## Scope

This repository builds the public website for the Making Models FAIR initiative. Changes belong here when they update site content, build tooling, dependencies, or site-specific layouts and assets. If unrelated issues are discovered, mention them but do not address them unless requested.

## Decision Hierarchy

When instructions conflict:

1. Direct user request
2. Existing repository conventions and authoritative project documentation (`README.md`, `hugo.yaml`, repository structure)
3. This `AGENTS.md`
4. General best practices

## Source of Truth

Authoritative:

- `hugo.yaml` — site config, routing, taxonomies, menus, module imports
- `content/en/` — site content
- `go.mod` / `go.sum` — Hugo module dependencies, including Docsy
- `package.json` / `package-lock.json` — npm build dependencies
- `HUGO_VERSION` — pinned Hugo version for Docker builds
- `layouts/`, `static/`, `js/` — overrides and static assets
- `README.md`, `Makefile`, `Dockerfile`, `docker-compose.yml` — build process and container interface

Do not edit derived output directly:

- `resources/_gen/`
- `public/`
- Rendered HTML or copied vendor files

## Invariants

- Preserve scientific intent and existing terminology.
- Make the smallest change that satisfies the request; do not fix unrelated issues unless asked.
- Always modify authoritative source files rather than generated output.
- Match existing formatting, style, and conventions; maintain internal consistency across related documents.
- Run builds and dependency commands inside the container using `make` targets. Prefer `make` over direct `docker compose` or host-local tooling.
- Keep local customizations isolated from Docsy upstream; do not vendor or fork Docsy without clear justification.
- Keep filenames and URLs stable unless required; update links and references when renaming.
- Record the rationale for non-obvious changes in commit messages or handoff notes.
- Avoid broad rewrites, opportunistic refactors, speculative edits, and documentation duplication.

## Dependency Maintenance

Docsy is managed as a Hugo Module. Keep Hugo and Docsy pinned to intentional versions. Any upgrade must verify compatibility with local overrides before completion. All module and npm commands must run inside the container.

1. Inspect: from `make shell`, run `hugo mod graph`
2. Update deliberately: from `make shell`, run `hugo mod get github.com/google/docsy/theme@vX.Y.Z`
3. Run `hugo mod tidy`
4. Run `hugo mod verify`
5. Sync npm dependencies if needed: from `make shell`, run `hugo mod npm pack` and `npm install`
6. Build the image with `make build`, then render the site with `make render`
7. Review overrides, key pages, navigation, search, menus, and shortcodes
8. Document the change and any manual reconciliation

## Layout and Override Discipline

Site-specific overrides belong in `layouts/`. Prefer targeted local overrides over editing the Docsy module cache. Do not copy large theme blocks into the repo. Reconcile overrides after theme updates without rewriting Docsy itself.

## Validation

Validate only what could reasonably be affected by the change. Use `make` targets in preference to direct `docker compose` or host-local tooling:

- Content edits: front matter, relative paths, internal links.
- Layout/shortcode changes: `make render` and verify affected pages.
- Dependency/theme changes: `make render`, inspect the module graph from `make shell`, and review key pages, navigation, search, menus, shortcodes, and generated output.

Use the build process documented in `README.md`.

## When to Ask

- A dependency upgrade crosses a major version boundary or alters site structure, routing, or configuration semantics.
- Local overrides conflict with upstream Docsy changes.
- Instructions conflict with this hierarchy.
- The change affects published URLs, scientific claims, or model descriptions.
- Multiple plausible implementations exist.

## Handoff Notes

If work is incomplete, leave:

- What changed: files, versions, edits
- What was checked: build status, module graph, pages reviewed
- What remains uncertain: open questions or blockers
- Recommended next steps
