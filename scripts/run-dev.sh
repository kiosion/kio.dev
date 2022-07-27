#!/bin/bash

echo "-> Starting express + vite..."

(cd ./express-api; exec yarn dev &> /dev/null) &\ 
(cd ./svelte-app; exec yarn dev) && fg
