#!/bin/bash

echo "-> Installing dependancies..."

(cd ./express-api; CYPRESS_INSTALL_BINARY=0 exec yarn install 2> >(grep -v warning 1>&2))
(cd ./svelte-app; CYPRESS_INSTALL_BINARY=0 exec yarn install 2> >(grep -v warning 1>&2))
