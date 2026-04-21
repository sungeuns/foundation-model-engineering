#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

tar -czf "$(date +%Y%m%d_%H%M%S)_src.tar.gz" src
