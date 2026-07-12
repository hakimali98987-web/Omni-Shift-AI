#!/bin/bash
set -e

echo "🔄 Running database schema push..."
cd /app/lib/db
pnpm run push

echo "🚀 Starting API server..."
cd /app/artifacts/api-server
node --enable-source-maps ./dist/index.mjs
