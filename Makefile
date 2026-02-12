SHELL := /bin/bash

.DEFAULT_GOAL := help

# --- Development ---

.PHONY: dev dev-sanity dev-sanity-prod

dev: ## Start SvelteKit dev server
	@pnpm --filter svelte-app dev

dev-sanity: ## Start Sanity Studio (dev dataset)
	@SANITY_STUDIO_DATASET=dev pnpm --filter sanity-cms dev

dev-sanity-prod: ## Start Sanity Studio (production dataset)
	@SANITY_STUDIO_DATASET=production pnpm --filter sanity-cms dev

# --- Building ---

.PHONY: build build-sanity

build: ## Production build (SvelteKit + Netlify adapter)
	@SVELTE_ADAPTER_ENV=netlify pnpm --filter svelte-app build

build-sanity: ## Build Sanity Studio
	@pnpm --filter sanity-cms build

# --- Quality ---

.PHONY: lint lint-check format check validate

lint: ## Auto-fix lint issues (both packages)
	@pnpm --filter svelte-app lint
	@pnpm --filter sanity-cms lint

lint-check: ## Check lint without fixing (CI mode)
	@pnpm --filter svelte-app lint:check
	@pnpm --filter sanity-cms lint:check

format: ## Format code (both packages)
	@pnpm --filter svelte-app format
	@pnpm --filter sanity-cms format
	@pnpm --filter svelte-app format:json

check: ## Svelte type checking
	@pnpm --filter svelte-app check

validate: ## Validate Sanity schema
	@pnpm --filter sanity-cms validate

# --- Testing ---

.PHONY: test test-unit test-e2e

test: ## Run all tests
	@pnpm --filter svelte-app test

test-unit: ## Run Vitest unit tests
	@pnpm --filter svelte-app test:vitest

test-e2e: ## Run Playwright E2E tests
	@pnpm --filter svelte-app test:playwright

# --- Codegen ---

.PHONY: typegen

typegen: ## Extract Sanity schema + generate TypeScript types
	@pnpm --filter sanity-cms exec sanity schema extract --enforce-required-fields
	@pnpm --filter sanity-cms exec sanity typegen generate

# --- Setup ---

.PHONY: install clean

install: ## Install all workspace dependencies
	@pnpm install --frozen-lockfile

clean: ## Remove build artifacts
	@rm -rf svelte-app/.netlify svelte-app/.svelte-kit svelte-app/build svelte-app/dist sanity-cms/dist

# --- Help ---

.PHONY: help

help: ## Show available targets
	@echo "Usage: make <target>"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z0-9_-]+:.*##/ {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
