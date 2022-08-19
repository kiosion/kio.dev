#!/bin/bash

echo "-> Starting vite..."

(cd ./svelte-app; exec yarn build:backed)
