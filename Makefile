.PHONY: dev, backed, test, prod, cypress, vitest, netlify-deploy, sanity-deploy

# install svelte deps
install-web: SHELL:=/bin/bash
install-web:
	@cd ./svelte-app &&\
	yarn install

# install sanity deps
install-sanity: SHELL:=/bin/bash
install-sanity:
	@cd ./sanity-cms &&\
	yarn install

# Install api deps
install-api: SHELL:=/bin/bash
install-api:
	@cd ./elixir-api &&\
	mix deps.get &&\
	mix local.hex --if-missing --force &&\
	mix local.rebar --if-missing --force

# Build & run api
api: SHELL:=/bin/bash
api: install-api
api:
	@cd ./elixir-api &&\
	make dev

# Build & run sanity studio
sanity: SHELL:=/bin/bash
sanity: install-sanity
sanity:
	@cd ./sanity-cms &&\
	SANITY_STUDIO_API_DATASET="dev" yarn sanity start

# Build & run backends
server: SHELL:=/bin/bash
server:
	make -j 2 api sanity

# Build & run svelte app
web: SHELL:=/bin/bash
web: install-web
web:
	@cd ./svelte-app &&\
	yarn dev

# Run api + web in dev
dev: SHELL:=/bin/bash
dev:
	make -j 2 api web

# Run full dev stack
dev-full: SHELL:=/bin/bash
dev-full:
	make -j 2 server web

# run dev backed
backed: SHELL:=/bin/bash
backed: install-web
backed:
	@cd ./svelte-app &&\
	yarn dev:backed

# Build svelte app for prod
prod: SHELL:=/bin/bash
prod: install-web
prod:
	@cd ./svelte-app &&\
	SVELTE_ADAPTER_ENV=netlify yarn build

sanity-upgrade: SHELL:=/bin/bash
sanity-upgrade: install-sanity
sanity-upgrade:
	@cd ./sanity-cms &&\
	yarn sanity upgrade

# Deploy sanity
sanity-deploy: sanity-upgrade
sanity-deploy:
	@cd ./sanity-cms &&\
	yarn netlify deploy --dir=./dist --prod

# Push to netlify
netlify-deploy: SHELL:=/bin/bash
netlify-deploy:
	@cd ./svelte-app &&\
	yarn netlify deploy --dir=./build --prod

# Build svelte app for testing
test: SHELL:=/bin/bash
test: install-web
test:
	@cd ./svelte-app &&\
	SVELTE_ADAPTER_ENV=node \
	yarn build:test

# vitest
vitest: SHELL:=/bin/bash
vitest:
	./scripts/vitest.sh

# cypress tests
cypress: SHELL:=/bin/bash
cypress:
	@cd ./svelte-app &&\
	yarn cypress install
	./scripts/cypress.sh
