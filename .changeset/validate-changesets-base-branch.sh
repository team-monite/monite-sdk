#!/usr/bin/env sh
set -o errexit

BRANCH="$1"
CONFIG_DIR="$(dirname "$(realpath "$0")")"

CHANGESET_BASE_BRANCH="$(node -p "require('${CONFIG_DIR}/config.json').baseBranch")"

if [ "origin/$BRANCH" = "$CHANGESET_BASE_BRANCH" ]; then
    echo "✅ Changeset "baseBranch" is '$CHANGESET_BASE_BRANCH'"
else
    echo "❌ Changeset "baseBranch" is '$CHANGESET_BASE_BRANCH' but configured branch is 'origin/$BRANCH'" >&2
    echo "✍️ Update '.changeset/config.json' to set 'baseBranch' to 'origin/$BRANCH'"
    exit 1
fi
