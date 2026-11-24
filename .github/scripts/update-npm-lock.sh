#!/bin/sh
set -eu

# Resolve manifests without touching the image-owned node_modules volume.
project_dir=$PWD
workspace=$(mktemp -d)
trap 'rm -rf "$workspace"' EXIT
cp package.json package-lock.json "$workspace/"
cp -R packages "$workspace/packages"
cd "$workspace"
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
# Preserve the project lockfile if dependency resolution fails.
cp package-lock.json "$project_dir/package-lock.json"
