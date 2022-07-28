#!/bin/bash

echo "-> Running svelte-check..."

(cd ./svelte-app; exec yarn check)
