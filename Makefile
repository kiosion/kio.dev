.PHONY: install, run-dev, run-backed, build-test, build-prod, cypress, vitest, sanity-deploy

VITE_PORT=5173
EXPRESS_PORT=4000

install: SHELL:=/bin/bash
install:
	yarn install 2> >(grep -v warning 1>&2)
	npx husky-init && yarn prepare
	./scripts/install.sh

# run dev servers
run-dev: SHELL:=/bin/bash
run-dev: install
	export VITE_ENV=cypress
	./scripts/run-dev.sh

# run dev frontend
run-backed: SHELL:=/bin/bash
run-backed: install
	export VITE_ENV=development
	VITE_API_URL=https://api.kio.dev
	./scripts/run-backed.sh

# build for prod
build-prod: SHELL:=/bin/bash
build-prod: install
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
build-test: SHELL:=/bin/bash
build-test:
	./scripts/build-test.sh

# vitest
vitest: SHELL:=/bin/bash
vitest:
	./scripts/vitest.sh

# cypress tests
cypress: SHELL:=/bin/bash
cypress:
	./scripts/cypress.sh
