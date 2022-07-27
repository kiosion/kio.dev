#!/bin/bash

echo "-> Installing dependancies..."

(cd ./express-api; exec yarn install) &&\ 
(cd ./sanity-cms; exec yarn install) &&\ 
(cd ./svelte-app; exec yarn install)
