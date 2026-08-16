#!/bin/sh

set -eu

HOME="${HOME:-/tmp}"
if [ "$HOME" = "/" ] || [ ! -w "$HOME" ]; then
  HOME=/tmp
fi
export HOME
export npm_config_cache="${npm_config_cache:-/tmp/.npm}"
export HUGO_ENV="${HUGO_ENV:-production}"
export NODE_PATH="${NODE_PATH:-/src/node_modules}"

HUGO_CACHEDIR="${HUGO_CACHEDIR:-/src/.hugo_cache}"
OUTPUT_DIR="${OUTPUT_DIR:-/src/public}"
BASE_URL="${BASE_URL:-}"
PUBLICATIONS_BIB_PATH="${PUBLICATIONS_BIB_PATH:-assets/bibliographies/publications.bib}"
PUBLICATIONS_JSON_PATH="${PUBLICATIONS_JSON_PATH:-data/publications.json}"

require_absolute_path() {
  value="$1"
  name="$2"
  case "$value" in
    /*) ;;
    *)
      echo "ERROR: ${name} must be an absolute path, got: ${value}" >&2
      exit 1
      ;;
  esac
}

require_absolute_path "$HUGO_CACHEDIR" HUGO_CACHEDIR
require_absolute_path "$OUTPUT_DIR" OUTPUT_DIR

mkdir -p "$HUGO_CACHEDIR" "$OUTPUT_DIR" "$npm_config_cache"

git config --global --add safe.directory /src
git config --global core.quotepath false

if [ -f "$PUBLICATIONS_BIB_PATH" ]; then
  uv run .github/scripts/bibtex_to_json.py \
    --input "$PUBLICATIONS_BIB_PATH" \
    --output "$PUBLICATIONS_JSON_PATH"
else
  echo "BibTeX source not found; skipping: $PUBLICATIONS_BIB_PATH" >&2
fi

set -- build \
  --gc \
  --minify \
  --cacheDir "$HUGO_CACHEDIR" \
  -d "$OUTPUT_DIR"

if [ -n "$BASE_URL" ]; then
  trimmed_base_url=${BASE_URL%/}
  set -- "$@" --baseURL "${trimmed_base_url}/"
fi

echo "Running: hugo $*" >&2
exec hugo "$@"
