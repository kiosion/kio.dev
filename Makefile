.PHONY: install, install-web, install-sanity, install-api, api, sanity-dev, sanity-prod, web, backed, prod, sanity-deploy, netlify-deploy, test-web, vitest, cypress, lint, cleanup

install: SHELL:=/bin/bash
install:
	@echo "Installing monorepo deps..."
	@pnpm install

install-web: SHELL:=/bin/bash
install-web: install
install-web:
	@echo "Installing sveltekit deps..."
	@cd ./svelte-app && pnpm install

# install sanity deps
install-sanity: SHELL:=/bin/bash
install-sanity: install
install-sanity:
	@echo "Installing sanity deps..."
	@cd ./sanity-cms && pnpm install

install-api: SHELL:=/bin/bash
install-api: install
install-api:
	@echo "Installing elixir deps..."
	@cd ./elixir-api && make install

api: SHELL:=/bin/bash
api:
	@cd ./elixir-api && make dev

sanity-%: SHELL:=/bin/bash
sanity-%:
	@make install-sanity
	@cd ./sanity-cms && SANITY_STUDIO_DATASET=$(if $(findstring dev,$@),dev,production) pnpm dev

web: SHELL:=/bin/bash
web: install-web
web:
	@cd ./svelte-app && pnpm dev

# run dev backed
backed: SHELL:=/bin/bash
backed: install-web
backed:
	@cd ./svelte-app && pnpm dev:backed

# Build svelte app for prod
prod: SHELL:=/bin/bash
prod:
	@cd ./svelte-app && SVELTE_ADAPTER_ENV=netlify pnpm build

# Deploy sanity
sanity-deploy: SHELL:=/bin/bash
sanity-deploy: sanity-upgrade
sanity-deploy:
	@cd ./sanity-cms && pnpm netlify deploy --dir=./dist --prod

# Push to netlify
netlify-deploy: SHELL:=/bin/bash
netlify-deploy:
	@cd ./svelte-app && pnpm netlify deploy --dir=./build --prod

# Build svelte app for testing
test-web: SHELL:=/bin/bash
test-web:
	@cd ./svelte-app && SVELTE_ADAPTER_ENV=node pnpm build:test

# vitest
vitest: SHELL:=/bin/bash
vitest:
	@cd ./svelte-app && pnpm test:vitest

# cypress tests
cypress: SHELL:=/bin/bash
cypress:
	@cd ./svelte-app && pnpm cypress install
	@(cd ./svelte-app; exec node ./dist) & (cd ./svelte-app; exec pnpm run test:cypress)

lint: SHELL:=/bin/bash
lint: install-web install-sanity
lint:
	@cd ./svelte-app && pnpm lint
	@cd ./sanity-cms && pnpm lint

# Cleanup temp files / dirs
cleanup: SHELL:=/bin/bash
cleanup:
	@rm -rf ./elixir-api/_build ./elixir-api/deps ./sanity-cms/dist ./svelte-app/.netlify ./svelte-app/.svelte-kit ./svelte-app/build ./svelte-app/dist
