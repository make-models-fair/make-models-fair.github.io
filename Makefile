# Settings
export HUGO_VERSION := $(shell cat HUGO_VERSION)
MAKEFILE_COMMANDS=Makefile $(wildcard *.mk)
UID=$(shell id -u)
GID=$(shell id -g)
DOCKER_COMPOSE=docker compose
HUGO_SERVICE=hugo
HUGO_RUN_SH=$(DOCKER_COMPOSE) run --rm --no-deps --entrypoint sh
HUGO_IMAGE=make-models-fair/tobefair:latest
HUGO_CACHE_CONTAINER_DIR ?= /src/.hugo_cache
HUGO_ISOLATED_CACHE_HOST_DIR ?= $(CURDIR)/.hugo_cache
HUGO_ISOLATED_CACHE_CONTAINER_DIR ?= /tmp/.hugo_cache
RENDER_OUTPUT_DIR ?= /src/public
RENDER_BASE_URL ?=
HUGO_USER_ENV=--user "$(UID):$(GID)" -e HOME=/tmp -e npm_config_cache=/tmp/.npm
PUBLICATIONS_BIB_PATH ?= assets/bibliographies/publications.bib
PUBLICATIONS_JSON_PATH ?= data/publications.json

# Controls
.PHONY : all commands build clean stop serve render render-site render-site-run render-site-isolated shell publications-json
.NOTPARALLEL:
all : commands

## commands         : show all commands.
commands :
	@grep -h -E '^##' ${MAKEFILE_COMMANDS} | sed -e 's/## //g'

## build            : build files but do not run a server.
build : 
	$(DOCKER_COMPOSE) build --pull $(HUGO_SERVICE)

## serve            : start and run a local server.
serve : build
	@LOCAL_UID=$(UID) LOCAL_GID=$(GID) $(DOCKER_COMPOSE) up -d $(HUGO_SERVICE)
	@echo "\nhot-reloading site up at http://localhost:1313, \"make stop\" to stop the server.\n"

## render           : run the production-style site render locally.
render : build
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) $(HUGO_SERVICE) -c 'rm -f /src/.hugo_build.lock && rm -rf /src/public /src/resources/_gen'
	$(MAKE) --no-print-directory render-site-run

## render-site      : run the shared production build script in the container.
render-site : build render-site-run

render-site-run :
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) \
		-e HUGO_CACHEDIR="$(HUGO_CACHE_CONTAINER_DIR)" \
		-e OUTPUT_DIR="$(RENDER_OUTPUT_DIR)" \
		-e BASE_URL="$(RENDER_BASE_URL)" \
		$(HUGO_SERVICE) -c 'sh .github/scripts/build-site.sh'

## render-site-isolated : run a production render in an isolated workspace.
render-site-isolated : build
	@mkdir -p "$(HUGO_ISOLATED_CACHE_HOST_DIR)"
	docker run --rm --entrypoint sh \
		--user "$(UID):$(GID)" \
		-e HOME=/tmp \
		-v "$(CURDIR)":/workspace:ro \
		-v "$(HUGO_ISOLATED_CACHE_HOST_DIR)":"$(HUGO_ISOLATED_CACHE_CONTAINER_DIR)":rw \
		-w /tmp \
		$(HUGO_IMAGE) \
		-lc 'cp -R /workspace /tmp/src && rm -rf /tmp/src/node_modules && ln -s /src/node_modules /tmp/src/node_modules && git config --global --add safe.directory /tmp/src && cd /tmp/src && HUGO_CACHEDIR="$(HUGO_ISOLATED_CACHE_CONTAINER_DIR)" OUTPUT_DIR=/tmp/public sh .github/scripts/build-site.sh'

## publications-json: generate Hugo data from BibTeX when a source file exists.
publications-json : build
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) $(HUGO_SERVICE) -c 'if [ -f "$(PUBLICATIONS_BIB_PATH)" ]; then uv run .github/scripts/bibtex_to_json.py --input "$(PUBLICATIONS_BIB_PATH)" --output "$(PUBLICATIONS_JSON_PATH)"; else echo "BibTeX source not found; skipping: $(PUBLICATIONS_BIB_PATH)" >&2; fi'

## shell            : open a hugo shell
shell : build
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) -e HUGO_CACHEDIR="$(HUGO_CACHE_CONTAINER_DIR)" $(HUGO_SERVICE)

## stop             : stop the docker server and clean up
stop :
	$(DOCKER_COMPOSE) down -v

## clean            : clean up junk files.
clean :
	@rm -rf ./public ./resources/_gen ./.hugo_cache ./.hugo_build.lock
	@find . -name .DS_Store -print -exec rm {} \;
	@find . -name '*~' -print -exec rm {} \;
