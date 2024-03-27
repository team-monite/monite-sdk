#!/usr/bin/env sh

set -o errexit

BASE_DIR=$(dirname "$(readlink -f "$0")")

# Include shared functions
. "$BASE_DIR/lib/private-registry-functions.sh"

# Publish packages to Verdaccio
publish_to_registry() {
  echo 'Publishing packages to private registry...'
  (cd "$(monorepo_root)" && CI=1 NPM_PUBLISH_REGISTRY="${NPM_PUBLISH_REGISTRY:-http://localhost:4873/}" . ".changeset/publish.sh") \
   | grep -E "Package archive published|Registry already knows about version" \
    || echo 'Error: Failed to publish packages to private registry.'
}

# Cleanup on exit or interrupt
trap 'use_default_registry; stop_private_registry' INT EXIT

start_private_registry
use_private_registry
publish_to_registry
