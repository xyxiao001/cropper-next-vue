#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PUBLISH_REGISTRY="$(node -p "require('./package.json').publishConfig?.registry || 'https://registry.npmjs.org/'")"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/release-npm.sh patch
  ./scripts/release-npm.sh minor
  ./scripts/release-npm.sh major
  ./scripts/release-npm.sh 0.2.0
  ./scripts/release-npm.sh patch --tag next

Options:
  --tag <dist-tag>   Publish with a specific npm dist-tag.
  --dry-run          Run checks, build, and npm publish --dry-run.
  --skip-git-check   Allow running with a dirty git working tree.
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

VERSION_INPUT=""
NPM_TAG=""
DRY_RUN=0
SKIP_GIT_CHECK=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --)
      shift
      ;;
    patch|minor|major|prepatch|preminor|premajor|prerelease)
      if [[ -n "$VERSION_INPUT" ]]; then
        echo "Only one version argument is allowed." >&2
        exit 1
      fi
      VERSION_INPUT="$1"
      shift
      ;;
    --tag)
      if [[ $# -lt 2 ]]; then
        echo "--tag requires a value." >&2
        exit 1
      fi
      NPM_TAG="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --skip-git-check)
      SKIP_GIT_CHECK=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      if [[ -n "$VERSION_INPUT" ]]; then
        echo "Unexpected argument: $1" >&2
        usage
        exit 1
      fi
      VERSION_INPUT="$1"
      shift
      ;;
  esac
done

if [[ -z "$VERSION_INPUT" ]]; then
  echo "A version bump or explicit version is required." >&2
  usage
  exit 1
fi

if [[ $SKIP_GIT_CHECK -ne 1 ]] && [[ -n "$(git status --porcelain)" ]]; then
  echo "Git working tree is not clean. Commit or stash changes first, or use --skip-git-check." >&2
  exit 1
fi

echo "Checking npm authentication..."
npm whoami --registry "$PUBLISH_REGISTRY" >/dev/null

CURRENT_VERSION="$(node -p "require('./package.json').version")"
echo "Current version: $CURRENT_VERSION"
echo "Updating version with: $VERSION_INPUT"

pnpm version "$VERSION_INPUT" --no-git-tag-version

NEW_VERSION="$(node -p "require('./package.json').version")"
echo "New version: $NEW_VERSION"

cleanup_on_error() {
  echo "Release failed. package.json remains at version $NEW_VERSION." >&2
}
trap cleanup_on_error ERR

echo "Running quality checks..."
pnpm run check

echo "Building library package..."
pnpm run build:lib

PUBLISH_ARGS=(publish --access public)

if [[ -n "$NPM_TAG" ]]; then
  PUBLISH_ARGS+=(--tag "$NPM_TAG")
fi

if [[ $DRY_RUN -eq 1 ]]; then
  PUBLISH_ARGS+=(--dry-run)
fi

echo "Publishing cropper-next-vue@$NEW_VERSION to npm..."
npm "${PUBLISH_ARGS[@]}" --registry "$PUBLISH_REGISTRY"

trap - ERR
echo "Release complete: cropper-next-vue@$NEW_VERSION"
