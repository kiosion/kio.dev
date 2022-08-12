.PHONY: install, dev, build-test, prod, cypress, vitest, netlify-deploy, sanity-deploy

install: SHELL:=/bin/bash
install:
	yarn install 2> >(grep -v warning 1>&2)
	yarn prepare
	./scripts/install.sh

# run dev servers
dev: SHELL:=/bin/bash
dev: install
	./scripts/run-dev.sh

# build for prod
prod: SHELL:=/bin/bash
prod: install
	cd ./svelte-app;\
	SVELTE_ADAPTER_ENV=netlify \
	yarn build

sanity-upgrade: SHELL:=/bin/bash
sanity-upgrade: install
	cd ./sanity-cms && yarn sanity upgrade

# push sanity cms
sanity-deploy: sanity-upgrade
sanity-deploy:
	yarn sanity deploy

# push to netlify
netlify-deploy: SHELL:=/bin/bash
netlify-deploy:
	cd ./svelte-app && yarn netlify deploy --dir=./build --prod

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
