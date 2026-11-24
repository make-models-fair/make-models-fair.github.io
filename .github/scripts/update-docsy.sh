#!/bin/sh
set -eu

version=${DOCSY_VERSION:-}
if ! printf '%s\n' "$version" | LC_ALL=C grep -Eq '^v[0-9]+\.[0-9]+\.[0-9]+$'; then
    echo 'Set DOCSY_VERSION to an exact stable release such as v0.18.1.' >&2
    exit 2
fi

git config --global --add safe.directory /src
hugo mod get "github.com/docsy/docsy/theme@$version"
hugo mod tidy
