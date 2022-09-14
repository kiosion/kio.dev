#!/bin/bash

echo "-> Running Sanity + Express API..."

(cd ./sanity-cms; SANITY_STUDIO_API_DATASET="dev" exec yarn sanity start) & (cd ./express-api; SANITY_STUDIO_API_DATASET="dev" exec yarn dev)

