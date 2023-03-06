.PHONY: dev prod prod-dev run-prod run-prod-dev test cleanup install

install: SHELL:=/bin/bash
install:
	@mix local.hex --if-missing --force > /dev/null
	@mix local.rebar --force > /dev/null
	@mix deps.get > /dev/null

dev: SHELL:=/bin/bash
dev: install
dev:
	@. .env && MIX_ENV=dev mix run --no-halt

prod: SHELL:=/bin/bash
prod: # Run docker build for 'production' dataset
	@docker build --build-arg SANITY_TOKEN=$(SANITY_TOKEN) --build-arg SANITY_PROJECT_ID=$(SANITY_PROJECT_ID) --build-arg API_TOKEN=$(API_TOKEN) --build-arg ENV=prod -t hexerei:prod .

prod-dev: SHELL:=/bin/bash
prod-dev: # Run docker build for 'dev' dataset
	@docker build --build-arg SANITY_TOKEN=$(SANITY_TOKEN) --build-arg SANITY_PROJECT_ID=$(SANITY_PROJECT_ID) --build-arg API_TOKEN=$(API_TOKEN) --build-arg ENV=dev -t hexerei:dev .

run-prod: SHELL:=/bin/bash
run-prod: # Run docker container for 'production' dataset build
	@docker stop hexerei-prod > /dev/null || true && docker rm -f hexerei-prod > /dev/null || true
	@docker run -p 4000:4000 -it -d --name hexerei-prod --restart=always hexerei:prod

run-prod-dev: SHELL:=/bin/bash
run-prod-dev: # Run docker container for 'dev' dataset build
	@docker stop hexerei-dev > /dev/null || true && docker rm -f hexerei-dev > /dev/null || true
	@docker run -p 4444:4444 -it -d --name hexerei-dev --restart=always hexerei:dev

test: SHELL:=/bin/bash
test: install
test:
	@. .env && MIX_ENV=test mix test ./test/hexerei_test.exs ./test/api_test.exs ./test/query_test.exs

cleanup: SHELL:=/bin/bash
cleanup:
	rm -rf ./_build
	rm -rf ./deps
