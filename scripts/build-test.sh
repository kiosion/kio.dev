#!/bin/bash

echo "-> Running server in testing mode..."

(cd ./svelte-app; exec yarn build:test)
