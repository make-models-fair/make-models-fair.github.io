# Website for tobefair.org

This repository houses the code for the Making Models FAIR initiative [website](https://tobefair.org). 

## About

This GitHub Pages site is generated with [Hugo](https://gohugo.io) using the [Docsy](https://www.docsy.dev) theme.

### Setup

Install Docker with the Compose plugin. The Make targets run Hugo and npm in the pinned container environment used by CI.

Clone this repository via:

```bash
git clone https://github.com/make-models-fair/make-models-fair.github.io.git
```

### Development

Build and start the hot-reloading development server at `http://localhost:1313`:

```bash
make serve
```

Build the production site into `public/` with the same container entrypoint used by CI:

```bash
make render
```

Use `make stop` to stop the server. Run `make commands` to list all supported targets.

The shared production entrypoint is `.github/scripts/build-site.sh`.

#### Bibliography maintenance

The model catalog has two coordinated sources of truth:

- [`coordination/data/models.csv`](https://github.com/make-models-fair/coordination/blob/main/data/models.csv)
  determines which publications appear in the model category tables and owns
  their category, FAIR status, issue link, DOI, and `name_short` identifier.
- `assets/bibliographies/publications.bib` owns the complete citation metadata
  shown on the [model bibliography](https://tobefair.org/docs/models/publications/).

The normalized DOI connects the two records. A publication must occur exactly
once in each source, and its BibTeX citation key must match `name_short`. The
existing `santos-etal-2006` collision is represented by the unique BibTeX key
`santos-rodrigues-pacheco-2006` and documented in the synchronization checker.

To add, remove, or change a model publication:

1. Update `data/models.csv` in the
   [coordination repository](https://github.com/make-models-fair/coordination).
2. Add, remove, or update the corresponding complete record in
   `assets/bibliographies/publications.bib`. Keep the DOI synchronized and use
   `name_short` as the citation key.
3. Run `make bibliography-check` to compare every DOI and citation key against
   the current coordination list.
4. Run `make render` to validate the BibTeX conversion and rendered site.

Every render and development-server start checks synchronization, converts the
BibTeX source to ignored Hugo data, and publishes the source bibliography at
`/bibliographies/publications.bib`. Do not edit `data/publications.json`
directly.

Use `make shell` for an interactive shell in the build container. npm dependency
maintenance must be performed there so local and CI environments remain consistent.

### Deployment

GitHub Pages must be configured with **GitHub Actions** as its build and deployment
source. Pushes to `main` then build and deploy through
`.github/workflows/gh-pages.yml`.
Pull requests run the same production render without deploying.
