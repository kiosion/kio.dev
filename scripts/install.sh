#!/bin/bash

echo "-> Installing dependancies..."

(cd ./express-api; exec yarn install 2> >(grep -v warning 1>&2))
(cd ./svelte-app; exec yarn install 2> >(grep -v warning 1>&2))
