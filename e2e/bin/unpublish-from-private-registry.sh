#!/usr/bin/env sh

set -o errexit

BASE_DIR=$(dirname "$(readlink -f "$0")")

# Include shared functions
. "$BASE_DIR/lib/private-registry-functions.sh"

# Publish packages to Verdaccio
unpublish_from_registry() {
  echo "Unpublishing packages from private registry..."
  (cd "$(monorepo_root)" && yarn workspaces foreach --recursive -t --no-private \
   --from '@team-monite/*' --from '@monite/*' \
   exec npm unpublish --force --registry "${NPM_PUBLISH_REGISTRY:-http://localhost:4873/}")
}

# Cleanup on exit or interrupt
trap 'stop_private_registry' INT EXIT

start_private_registry
unpublish_from_registry
stop_private_registry
