#!/bin/sh

set -eu

export HUGO_ENV="${HUGO_ENV:-production}"

HUGO_CACHEDIR="${HUGO_CACHEDIR:-/src/.hugo_cache}"
OUTPUT_DIR="${OUTPUT_DIR:-/src/public}"
BASE_URL="${BASE_URL:-}"

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

mkdir -p "$HUGO_CACHEDIR" "$OUTPUT_DIR"

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
