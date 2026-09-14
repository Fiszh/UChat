#!/bin/bash
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$REPO_DIR/app"

cd "$REPO_DIR"

echo "Deploying latest code..."

git fetch --all
git reset --hard origin/main

cd "$APP_DIR"

bun install

set -a
source .env
set +a

bun run build:prod
find build -name "*.map" -delete

systemctl reload nginx

echo "Deployment finished."