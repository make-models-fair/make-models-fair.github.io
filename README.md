# Website for tobefair.org

This repository houses the code for the Making Models FAIR initiative [website](https://tobefair.org). 

## About

This GitHub pages site is generated with [hugo](https://gohugo.io) using the [docsy](https://www.docsy.dev) theme and can be built locally by following these instructions:

### Setup

To create a local setup of this site you can install `Docker` and `docker-compose` or `hugo` and `yarn` on your local operating system.

Clone this repository via `git clone https://github.com/make-models-fair/make-models-fair.github.io.git`

#### Docker and docker-compose installed

If you have Docker and docker-compose installed, you can use the Makefile in the repository to automatically serve a local copy of the site to test out any changes:

Build and start a docker container with a hot-reloading `hugo server` that you can visit in your browser at `http://localhost:1313` via

```bash
% make serve
```

#### Install hugo and yarn locally
If you don't have docker installed and don't mind installing things in your operating system, you can do the following:

- Install the extended version of hugo from the [releases page](https://github.com/gohugoio/hugo/releases).
- Install yarn via your operating system's package manager or from the [yarn site](https://yarnpkg.com/getting-started/install).
- Run `yarn install` in the base directory
- Use hugo commands to render the site.

```bash
% hugo mod init github.com/make-models-fair/make-models-fair.github.io
% hugo mod get github.com/google/docsy/@v0.6.0
% hugo serve     # dev server without drafts
# OR
% hugo serve -D  # dev server with drafts
```
