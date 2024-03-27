#!/usr/bin/env sh

set -o errexit

BASE_DIR=$(dirname "$(readlink -f "$0")")

# Include shared functions
. "$BASE_DIR/lib/private-registry-functions.sh"

if [ -z "$1" ]; then
  echo "Missing argument: 'use-private-registry' or 'use-default-registry'" >&2
  exit 1
fi

if [ "$1" = "use-private-registry" ]; then
  use_private_registry
  exit 0
fi

if [ "$1" = "use-default-registry" ]; then
  use_default_registry
  exit 0
fi

echo "Invalid argument: $1, allowed values are 'use-private-registry' or 'use-default-registry'" >&2
exit 1
