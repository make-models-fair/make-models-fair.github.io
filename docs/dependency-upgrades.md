# Hugo and Docsy upgrades

Maintain Hugo, Docsy, Dart Sass and the theme's frontend dependencies as a tested
deployment set. Select the latest stable versions that work together, respecting
any explicit version constraint in the maintenance request. Check upstream release
notes and migration guides before choosing exact targets. Record compatibility
blockers when a dependency must remain below its latest stable release.

## Version sources

| Component | Source |
| --- | --- |
| Hugo | `HUGO_VERSION` and the matching official image digest in `Dockerfile` |
| Docsy | `go.mod` / `go.sum`, imported by `hugo.yaml` |
| Theme assets and Sass | Root `package.json` / `package-lock.json` |
| Hugo's npm workspace | Generated `packages/hugoautogen/`; keep its metadata committed |
| Catalog | Independent `model-catalog.lock.json` source revision and checksum |
| CI actions | Commit pins in `.github/workflows/` |

Docsy currently uses `github.com/docsy/docsy/theme`. Bootstrap and Font Awesome
are pinned at the root, as in OMF, so their files are installed where the theme's
mounts expect them. Keep Hugo's generated workspace even when its dependency
objects are empty. `npm ci` installs the reviewed lockfile; never edit generated
workspace metadata or lock entries by hand.

The image provides Go, Node and npm. `sass-embedded` supplies Dart Sass through
the Dockerfile's explicit executable link. Hugo 0.170+ has a unified binary;
the old extended-edition requirement no longer applies.

## Ordered procedure

Run from the website repository root. Project tools run inside the Compose
`hugo` service; host requirements are Git, Make, Docker and Compose. Before each
task, check host patch status, actual tool versions and upstream support status.
Do not infer dependency currency from a successful build.

1. Start from a clean branch, read `AGENTS.md`, and check for a running preview.
   Use a separate checkout for renders because `make render` clears shared output
   and refuses to run while this Compose project's preview is running.
2. Run `make build`, `make toolchain-status`, `make bibliography-check`, then
   `make render` to establish the baseline before editing manifests.
3. Select a compatible stable set. Update `HUGO_VERSION` and the matching official
   image digest together. Run `make build` before npm edits, retaining an image
   that can regenerate dependency files.
4. Set the chosen Docsy version with
   `make deps-docsy DOCSY_VERSION=vX.Y.Z`. Floating selections such as `latest`,
   branches and prereleases are rejected. For future module-path changes, update
   `go.mod`, `hugo.yaml` and the target together using upstream migration guidance.
5. Update direct npm declarations when needed for the chosen theme/Sass release.
   Run `make deps-pack`, then `make deps-lock`, then `make build`. These dependency
   targets reuse the existing image; lock generation uses a temporary workspace
   and preserves the existing lockfile when resolution fails.
6. Run `make deps-test`, `make toolchain-status`, `make bibliography-check` and
   `make render`.
   Resolve build errors and new warnings. Check overridden templates, breadcrumbs,
   Font Awesome icons, Mermaid plugin configuration and the Sass pipeline against
   intervening Docsy release notes.
7. Inspect the home page, model category tables and filters, bibliography,
   navigation, search, process diagram links, fonts and mobile layout. Compare
   rendered page paths with the baseline. Check browser errors and missing assets.
8. Run `make render RENDER_BASE_URL=https://example.org/preview/` and verify pages,
   scripts, images and downloadable bibliography under that prefix. Finish with
   a normal `make render` for root-site output.
9. Review `git diff --check`, manifests, locks and generated workspace metadata.
   Record exact versions and validation in the infrastructure maintenance config,
   identifying unpublished local changes separately from the deployed source.

Use `make serve` for the local preview and `make stop` to stop its Compose project.
Make exposes Git's common directory read-only so linked worktrees can resolve
history for Hugo modules and `enableGitInfo`.

## Publishing and recovery

The Pages workflow renders and runs `make deps-test` before uploading its artifact.
PRs targeting `main` validate without deploying; an approved push to `main`
(including a merged PR) publishes. Manual dispatch on `main` also publishes.
Keep catalog updates separate unless the maintenance change
requires them. Validate a previous source rebuild or retain its successful Pages
artifact before publication, and verify public checks after any approved recovery.
