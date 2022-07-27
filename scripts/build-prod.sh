#!/bin/bash

echo "-> Running server in prod mode..."

(cd ./svelte-app; exec yarn build)
