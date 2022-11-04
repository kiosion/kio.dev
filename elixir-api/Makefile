.PHONY: dev, prod, prod-dev, run-prod, run-prod-dev, test, cleanup

dev: SHELL:=/bin/sh
dev:
	@echo "target: Development"
	@./bin/start -m dev

prod: SHELL:=/bin/sh
prod: # Run docker build for 'production' dataset
	@echo "target: Production"
	@docker build --build-arg SANITY_TOKEN=$(SANITY_TOKEN) --build-arg SANITY_PROJECT_ID=$(SANITY_PROJECT_ID) --build-arg SANITY_DATASET=production --build-arg PORT=4000 --build-arg API_KEY=$(API_KEY) -t hexerei:prod .

prod-dev: SHELL:=/bin/sh
prod-dev: # Run docker build for 'dev' dataset
	@echo "target: Production (dev)"
	@docker build --build-arg SANITY_TOKEN=$(SANITY_TOKEN) --build-arg SANITY_PROJECT_ID=$(SANITY_PROJECT_ID) --build-arg SANITY_DATASET=dev --build-arg PORT=4444 --build-arg API_KEY=$(API_KEY) -t hexerei:dev .

run-prod: SHELL:=/bin/sh
run-prod: # Run docker container for 'production' dataset build
	@echo "running container: hexerei:prod"
	@docker stop hexerei-prod > /dev/null || true && docker rm hexerei-prod > /dev/null || true
	@docker run -p 4000:4000 -it -d --name hexerei-prod hexerei:prod

run-prod-dev: SHELL:=/bin/sh
run-prod-dev: # Run docker container for 'dev' dataset build
	@echo "running container: hexerei:dev"
	@docker stop hexerei-dev > /dev/null || true && docker rm hexerei-dev > /dev/null || true
	@docker run -p 4444:4444 -it -d --name hexerei-dev hexerei:dev

test: SHELL:=/bin/sh
test:
	@echo "target: Testing"
	@mix test ./test/hexerei_test.exs

cleanup: SHELL:=/bin/sh
cleanup:
	@echo "Cleaning up..."
	rm -rf ./_build
	rm -rf ./deps
