#!/usr/bin/env sh

# Validate '.yarnrc.yml' for private registry configuration
# In case of private registry configuration, the script will exit with an error.
# It's needed to avoid accidental commits of '.yarnrc.yml' with private registry configuration
# which could happen when running 'yarn monorepo:use-private-registry' in monorepo root.

set -o errexit

for parameter in "npmScopes['team-monite']" "npmScopes['monite']" "unsafeHttpWhitelist[0]"; do
  RESULT=$(yarn config get "$parameter" || true)

  if [ "$RESULT" = "undefined" ]; then
    echo "✔︎ '.yarnrc.yml' does not contain '$parameter'" >&2
  elif [ -n "$RESULT" ]; then
    echo "✖︎ '.yarnrc.yml' contains '$parameter'" >&2
    echo "   Run 'yarn monorepo:use-default-registry' in monorepo root to revert '.yarnrc.yml' changes." >&2
    exit 1
  fi
done

echo "✔︎ Your '.yarnrc.yml' looks good ✨ - no private registry configuration found."
