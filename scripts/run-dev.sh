#!/bin/bash

echo "-> Running servers in dev modes..."

cd ../express-api && exec yarn dev & cd ../svelte-app && exec yarn dev && fg
