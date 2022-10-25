.PHONY: dev, prod, test, cleanup

dev: SHELL:=/bin/sh
dev:
	@echo "target: Development"
	@./bin/start -m dev

prod: SHELL:=/bin/sh
prod:
	@echo "target: Production"
	@mix docker.build prod

test: SHELL:=/bin/sh
test:
	@echo "target: Testing"
	@mix test ./test/hexerei_test.exs

cleanup: SHELL:=/bin/sh
cleanup:
	@echo "Cleaning up..."
	rm -rf ./_build
	rm -rf ./deps
