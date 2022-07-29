#!/bin/bash

echo "-> Running cypress..."

(cd ./svelte-app; exec yarn serve &> /dev/null) & (cd ./svelte-app; exec yarn test:cypress) && fg
