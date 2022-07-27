.PHONY: install, dev, dev-backed, prod, sanity-deploy, prepare

VITE_PORT=5173
EXPRESS_PORT=4000

install: SHELL:=/bin/bash
install:
	yarn install 2> >(grep -v warning 1>&2)
	npx husky-init && yarn prepare
	./scripts/install.sh

# run dev servers
dev: SHELL:=/bin/bash
dev: install
	./scripts/run-dev.sh

# run dev frontend
dev-backed: SHELL:=/bin/bash
dev-backed: install
	VITE_API_URL=https://api.kio.dev
	./scripts/run-backed.sh

# build for prod
prod: SHELL:=/bin/bash
prod: install
	./scripts/build-prod.sh

sanity-upgrade: SHELL:=/bin/bash
sanity-upgrade: install
	cd ./sanity-cms && yarn sanity upgrade

# push sanity cms
sanity-deploy: sanity-upgrade
	yarn sanity deploy

# check
check: SHELL:=/bin/bash
check:
	./scripts/check.sh

# test
test: SHELL:=/bin/bash
test:
	yarn test:svelte
	yarn test:api
