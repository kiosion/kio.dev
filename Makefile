.PHONY: install, dev, prod, netlify-deploy, lint, clean

install: SHELL:=/bin/bash
install:
	@cd ./svelte-app && pnpm install --frozen-lockfile

dev: SHELL:=/bin/bash
dev: install
dev:
	@cd ./svelte-app && pnpm dev

prod: SHELL:=/bin/bash
prod: install
prod:
	@cd ./svelte-app && SVELTE_ADAPTER_ENV=netlify pnpm build

lint: SHELL:=/bin/bash
lint: install
	@cd ./svelte-app && pnpm lint

format: SHELL:=/bin/bash
format: install lint
	@cd ./svelte-app && pnpm format:json

clean: SHELL:=/bin/bash
clean:
	@rm -rf ./svelte-app/.netlify ./svelte-app/.svelte-kit ./svelte-app/build ./svelte-app/dist
