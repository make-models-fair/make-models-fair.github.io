# Settings
export HUGO_VERSION := $(shell cat HUGO_VERSION)
export SITE_GIT_COMMON_DIR := $(shell git rev-parse --path-format=absolute --git-common-dir)
export DOCSY_VERSION
MAKEFILE_COMMANDS=Makefile $(wildcard *.mk)
UID=$(shell id -u)
GID=$(shell id -g)
DOCKER_COMPOSE=docker compose
HUGO_SERVICE=hugo
HUGO_RUN_SH=$(DOCKER_COMPOSE) run --rm --no-deps --entrypoint sh
HUGO_CACHE_CONTAINER_DIR ?= /src/.hugo_cache
RENDER_OUTPUT_DIR ?= /src/public
RENDER_BASE_URL ?=
HUGO_USER_ENV=--user "$(UID):$(GID)" -e HOME=/tmp -e npm_config_cache=/tmp/.npm

# Controls
.PHONY : all commands bibliography-check build clean stop serve render shell deps-docsy deps-pack deps-lock deps-test toolchain-status
.NOTPARALLEL:
all : commands

## commands         : show all commands.
commands :
	@grep -h -E '^##' ${MAKEFILE_COMMANDS} | sed -e 's/## //g'

## bibliography-check: verify publications.bib matches the coordination model list.
bibliography-check : build
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) $(HUGO_SERVICE) -c 'npm run models:fetch && npm run bibliography:check'

## build            : build the pinned site toolchain image.
build : 
	$(DOCKER_COMPOSE) build --pull $(HUGO_SERVICE)

## serve            : start and run a local server.
serve : build
	@LOCAL_UID=$(UID) LOCAL_GID=$(GID) $(DOCKER_COMPOSE) up -d --renew-anon-volumes $(HUGO_SERVICE)
	@echo "\nhot-reloading site up at http://localhost:1313, \"make stop\" to stop the server.\n"

## render           : run the production-style site render locally.
render : build
	@running=$$($(DOCKER_COMPOSE) ps --status running -q $(HUGO_SERVICE)) || exit $$?; \
		test -z "$$running" || { echo 'Stop the preview or render in a separate checkout; shared build output is in use.' >&2; exit 1; }
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) \
		-e HUGO_CACHEDIR="$(HUGO_CACHE_CONTAINER_DIR)" \
		-e OUTPUT_DIR="$(RENDER_OUTPUT_DIR)" \
		-e BASE_URL="$(RENDER_BASE_URL)" \
		$(HUGO_SERVICE) -c 'rm -f /src/.hugo_build.lock && rm -rf /src/public /src/resources/_gen && sh .github/scripts/build-site.sh'

## shell            : open a hugo shell
shell : build
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) -e HUGO_CACHEDIR="$(HUGO_CACHE_CONTAINER_DIR)" $(HUGO_SERVICE)

# Dependency maintenance uses the existing image while manifests and locks change.
## deps-docsy       : update the theme module; set DOCSY_VERSION=vX.Y.Z.
deps-docsy :
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) -e HUGO_CACHEDIR="$(HUGO_CACHE_CONTAINER_DIR)" -e DOCSY_VERSION $(HUGO_SERVICE) -c 'sh .github/scripts/update-docsy.sh'

## deps-pack        : regenerate the Hugo module npm workspace.
deps-pack :
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) -e HUGO_CACHEDIR="$(HUGO_CACHE_CONTAINER_DIR)" $(HUGO_SERVICE) -c 'git config --global --add safe.directory /src && hugo mod npm pack'

## deps-lock        : resolve npm locks without modifying installed dependencies.
deps-lock :
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) $(HUGO_SERVICE) -c 'sh .github/scripts/update-npm-lock.sh'

## deps-test        : check exact theme pins and isolated npm lockfile maintenance.
deps-test :
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) $(HUGO_SERVICE) -c 'node --test .github/scripts/test-dependency-tools.mjs'

## toolchain-status : inspect the installed tools and theme module in the existing image.
toolchain-status :
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) -e HUGO_CACHEDIR="$(HUGO_CACHE_CONTAINER_DIR)" $(HUGO_SERVICE) -c 'hugo version && sass --version && go version && node --version && npm --version && git config --global --add safe.directory /src && hugo mod graph && npm ls --depth=0'

## stop             : stop Compose services and remove their volumes.
stop :
	$(DOCKER_COMPOSE) down -v

## clean            : remove generated output, caches, and backup files.
clean :
	@rm -rf ./public ./resources/_gen ./.hugo_cache ./.hugo_build.lock
	@find . -name .DS_Store -print -exec rm {} \;
	@find . -name '*~' -print -exec rm {} \;
