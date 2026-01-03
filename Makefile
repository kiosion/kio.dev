.PHONY: install, install-web, install-sanity, sanity-dev, sanity-prod, web, prod, sanity-deploy, netlify-deploy, test-web, vitest, lint, cleanup

install: SHELL:=/bin/bash
install:
	@echo "Installing monorepo deps..."
	@pnpm install --frozen-lockfile

install-web: SHELL:=/bin/bash
install-web: install
install-web:
	@echo "Installing sveltekit deps..."
	@cd ./svelte-app && pnpm install --frozen-lockfile

install-sanity: SHELL:=/bin/bash
install-sanity: install
install-sanity:
	@echo "Installing sanity deps..."
	@cd ./sanity-cms && pnpm install --frozen-lockfile

sanity-%: SHELL:=/bin/bash
sanity-%:
	@make install-sanity
	@cd ./sanity-cms && SANITY_STUDIO_DATASET=$(if $(findstring dev,$@),dev,production) pnpm dev

typegen: SHELL:=/bin/bash
typegen: install-web install-sanity
	@cd ./sanity-cms && pnpm sanity schema extract --enforce-required-fields
	@cd ./sanity-cms && pnpm sanity typegen generate

web: SHELL:=/bin/bash
web: install-web
web:
	@cd ./svelte-app && pnpm dev

prod: SHELL:=/bin/bash
prod:
	@cd ./svelte-app && SVELTE_ADAPTER_ENV=netlify pnpm build

lint: SHELL:=/bin/bash
lint: install-web install-sanity
	@cd ./svelte-app && pnpm lint
	@cd ./sanity-cms && pnpm lint && pnpm validate

format: SHELL:=/bin/bash
format: install-web install-sanity install-api lint
	@cd ./svelte-app && pnpm format:json

cleanup: SHELL:=/bin/bash
cleanup:
	@rm -rf ./sanity-cms/dist ./svelte-app/.netlify ./svelte-app/.svelte-kit ./svelte-app/build ./svelte-app/dist
