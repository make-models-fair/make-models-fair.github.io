# Website for tobefair.org

This repository houses the code for the Making Models FAIR initiative [website](https://tobefair.org). 

## About

This GitHub Pages site is generated with [Hugo](https://gohugo.io) using the [Docsy](https://www.docsy.dev) theme.

### Setup

Install Docker with the Compose plugin. The Make targets run Hugo, Go module, npm, and bibliography tooling in the pinned container environment used by CI.

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

The shared production entrypoint is `.github/scripts/build-site.sh`. The dormant
BibTeX scaffold converts `assets/bibliographies/publications.bib` to the generated
`data/publications.json` when that source file exists. Run it independently with
`make publications-json`.

Use `make shell` for an interactive shell in the build container. Hugo module and
npm dependency maintenance must be performed there so local and CI environments
remain consistent.

### Deployment

GitHub Pages must be configured with **GitHub Actions** as its build and deployment
source. Pushes to `main` then build and deploy through
`.github/workflows/gh-pages.yml`.
Pull requests run the same production render without deploying.
