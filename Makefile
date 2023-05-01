.PHONY: install, dev, test, cypress, cleanup

install: SHELL:=/bin/bash
install:
	@echo "Installing dependencies..."
	@pnpm install

install-web: SHELL:=/bin/bash
install-web: install
install-web:
	@echo "Installing svelte dependencies..."
	@cd ./svelte-app && pnpm install

# install sanity deps
install-sanity: SHELL:=/bin/bash
install-sanity: install
install-sanity:
	@echo "Installing sanity dependencies..."
	@cd ./sanity-cms && pnpm install

api: SHELL:=/bin/bash
api:
	@cd ./elixir-api && make dev

sanity-%: SHELL:=/bin/bash
sanity-%:
	@make install-sanity
	@cd ./sanity-cms &&\
	SANITY_STUDIO_DATASET=$(if $(findstring dev,$@),dev,prod) pnpm dev

web: SHELL:=/bin/bash
web: install-web
web:
	@cd ./svelte-app && pnpm dev

server: SHELL:=/bin/bash
server: install-web
server:
	@echo "Starting dev servers..."
	@./scripts/server.sh

# run dev backed
backed: SHELL:=/bin/bash
backed: install-web
backed:
	@cd ./svelte-app && pnpm dev:backed

# Build svelte app for prod
prod: SHELL:=/bin/bash
prod:
	@cd ./svelte-app &&\
	SVELTE_ADAPTER_ENV=netlify pnpm build

sanity-upgrade: SHELL:=/bin/bash
sanity-upgrade: install-sanity
sanity-upgrade:
	@cd ./sanity-cms && pnpm sanity upgrade

# Deploy sanity
sanity-deploy: sanity-upgrade
sanity-deploy:
	@cd ./sanity-cms && pnpm netlify deploy --dir=./dist --prod

# Push to netlify
netlify-deploy: SHELL:=/bin/bash
netlify-deploy:
	@cd ./svelte-app && pnpm netlify deploy --dir=./build --prod

# Build svelte app for testing
test: SHELL:=/bin/bash
test:
	@cd ./svelte-app &&\
	SVELTE_ADAPTER_ENV=node pnpm build:test

# vitest
vitest: SHELL:=/bin/bash
vitest:
	@cd ./svelte-app &&\
	pnpm test:vitest


# cypress tests
cypress: SHELL:=/bin/bash
cypress:
	@cd ./svelte-app &&\
	pnpm cypress install
	@./scripts/cypress.sh

lint: SHELL:=/bin/bash
lint:
	@cd ./svelte-app && pnpm lint

# Cleanup temp files / dirs
cleanup: SHELL:=/bin/bash
cleanup:
	@echo "Cleaning up elixir-api..."
	@rm -rf ./elixir-api/_build ./elixir-api/deps
	@echo "Cleaning up sanity-cms..."
	@rm -rf ./sanity-cms/dist
	@echo "Cleaning up svelte-app..."
	@rm -rf ./svelte-app/.netlify ./svelte-app/.svelte-kit ./svelte-app/build ./svelte-app/dist
