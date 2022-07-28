#!/bin/bash

echo "-> Running vitest..."

(cd ./svelte-app; exec yarn test:vitest)
