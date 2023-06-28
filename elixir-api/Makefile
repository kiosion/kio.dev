.PHONY: dev prod run test cleanup install

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
	@docker build --build-arg SANITY_TOKEN=$(SANITY_TOKEN) --build-arg SANITY_PROJECT_ID=$(SANITY_PROJECT_ID) --build-arg API_TOKEN=$(API_TOKEN) --build-arg ENV=prod --build-arg GCLOUD_KEY=$(GCLOUD_KEY) -t hexerei:prod .

run: SHELL:=/bin/bash
run: # Run docker container for 'production' dataset build
	@docker stop hexerei-prod > /dev/null || true && docker rm -f hexerei-prod > /dev/null || true
	@docker run --dns 8.8.8.8 --dns 8.8.4.4 -p 8080:8080 -it -d --name hexerei-prod --restart=always hexerei:prod

test: SHELL:=/bin/bash
test: install
test:
	@. .env && MIX_ENV=test mix test

cleanup: SHELL:=/bin/bash
cleanup:
	rm -rf ./_build
	rm -rf ./deps
