.PHONY: install, dev, backed, test, prod, cypress, vitest, netlify-deploy, sanity-deploy

install: SHELL:=/bin/bash
install:
	yarn install 2> >(grep -v warning 1>&2)
	yarn prepare
	./scripts/install.sh

# only install svelte deps
install-web: SHELL:=/bin/bash
install-web:
	cd ./svelte-app;\
	yarn install 2> >(grep -v warning 1>&2)

# build & run backends
server: SHELL:=/bin/bash
server: install
server:
	./scripts/server.sh

# build & run web ui
web: SHELL:=/bin/bash
web: install-web
web:
	cd ./svelte-app;\
	yarn dev

# run full dev stack
dev: SHELL:=/bin/bash
dev: install
dev:
	./scripts/dev.sh

# run dev backed
backed: SHELL:=/bin/bash
backed: install-web
backed:
	cd ./svelte-app;\
	yarn dev:backed

# build for prod
prod: SHELL:=/bin/bash
prod: install-web
prod:
	cd ./svelte-app;\
	SVELTE_ADAPTER_ENV=netlify \
	yarn build

sanity-upgrade: SHELL:=/bin/bash
sanity-upgrade: install
sanity-upgrade:
	cd ./sanity-cms && yarn sanity upgrade

# deploy sanity
sanity-deploy: sanity-upgrade
sanity-deploy:
	yarn sanity deploy

# push to netlify
netlify-deploy: SHELL:=/bin/bash
netlify-deploy:
	cd ./svelte-app && yarn netlify deploy --dir=./build --prod

# test
test: SHELL:=/bin/bash
test:
	cd ./svelte-app;\
	SVELTE_ADAPTER_ENV=node \
	yarn build:test

# vitest
vitest: SHELL:=/bin/bash
vitest:
	./scripts/vitest.sh

# cypress tests
cypress: SHELL:=/bin/bash
cypress:
	cd ./svelte-app/;\
	yarn cypress install
	./scripts/cypress.sh
