# Settings
export HUGO_VERSION := $(shell cat HUGO_VERSION)
MAKEFILE_COMMANDS=Makefile $(wildcard *.mk)
UID=$(shell id -u)
GID=$(shell id -g)
DOCKER_COMPOSE=docker compose
HUGO_SERVICE=hugo
HUGO_RUN_SH=$(DOCKER_COMPOSE) run --rm --no-deps --entrypoint sh
HUGO_CACHE_CONTAINER_DIR ?= /src/.hugo_cache
RENDER_OUTPUT_DIR ?= /src/public
RENDER_BASE_URL ?=
HUGO_USER_ENV=--user "$(UID):$(GID)" -e HOME=/tmp

# Controls
.PHONY : all commands build clean stop serve render shell
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
	@LOCAL_UID=$(UID) LOCAL_GID=$(GID) $(DOCKER_COMPOSE) up -d --renew-anon-volumes $(HUGO_SERVICE)
	@echo "\nhot-reloading site up at http://localhost:1313, \"make stop\" to stop the server.\n"

## render           : run the production-style site render locally.
render : build
	$(HUGO_RUN_SH) $(HUGO_USER_ENV) \
		-e HUGO_CACHEDIR="$(HUGO_CACHE_CONTAINER_DIR)" \
		-e OUTPUT_DIR="$(RENDER_OUTPUT_DIR)" \
		-e BASE_URL="$(RENDER_BASE_URL)" \
		$(HUGO_SERVICE) -c 'rm -f /src/.hugo_build.lock && rm -rf /src/public /src/resources/_gen && sh .github/scripts/build-site.sh'

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
