#!/bin/bash

echo "-> Starting express + vite..."

(exec ./scripts/server.sh) & (cd ./svelte-app; exec yarn dev)
