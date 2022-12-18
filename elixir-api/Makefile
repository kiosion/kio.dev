.PHONY: dev, prod, prod-dev, run-prod, run-prod-dev, test, cleanup

dev: SHELL:=/bin/bash
dev:
	@echo "target: Development"
	@mix local.hex --if-missing --force > /dev/null
	@mix local.rebar --force > /dev/null
	@mix deps.get > /dev/null
	@source .env && MIX_ENV=dev mix run --no-halt

prod: SHELL:=/bin/bash
prod: # Run docker build for 'production' dataset
	@echo "target: Production"
	@docker build --build-arg SANITY_TOKEN=$(SANITY_TOKEN) --build-arg SANITY_PROJECT_ID=$(SANITY_PROJECT_ID) --build-arg SANITY_DATASET=production --build-arg PORT=4000 --build-arg API_TOKEN=$(API_TOKEN) -t hexerei:prod .

prod-dev: SHELL:=/bin/bash
prod-dev: # Run docker build for 'dev' dataset
	@echo "target: Production (dev)"
	@docker build --build-arg SANITY_TOKEN=$(SANITY_TOKEN) --build-arg SANITY_PROJECT_ID=$(SANITY_PROJECT_ID) --build-arg SANITY_DATASET=dev --build-arg PORT=4444 --build-arg API_TOKEN=$(API_TOKEN) -t hexerei:dev .

run-prod: SHELL:=/bin/bash
run-prod: # Run docker container for 'production' dataset build
	@echo "running container: hexerei:prod"
	@docker stop hexerei-prod > /dev/null || true && docker rm hexerei-prod > /dev/null || true
	@docker run -p 4000:4000 -it -d --name hexerei-prod hexerei:prod

run-prod-dev: SHELL:=/bin/bash
run-prod-dev: # Run docker container for 'dev' dataset build
	@echo "running container: hexerei:dev"
	@docker stop hexerei-dev > /dev/null || true && docker rm hexerei-dev > /dev/null || true
	@docker run -p 4444:4444 -it -d --name hexerei-dev hexerei:dev

test: SHELL:=/bin/bash
test:
	@echo "target: Testing"
	@mix test ./test/hexerei_test.exs

cleanup: SHELL:=/bin/bash
cleanup:
	@echo "Cleaning up..."
	rm -rf ./_build
	rm -rf ./deps
