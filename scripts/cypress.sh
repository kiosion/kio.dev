#!/bin/bash

(cd ./svelte-app; exec yarn serve) & (cd ./svelte-app; exec yarn test:cypress)
