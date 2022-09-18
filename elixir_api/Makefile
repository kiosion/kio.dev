.PHONY: dev, prod, test, cleanup

dev: SHELL:=/bin/sh
dev:
	@echo "MAKE: Dev"
	./scripts/start.sh -m dev

prod: SHELL:=/bin/sh
prod:
	@echo "MAKE: Production"
	./scripts/start.sh -m prod

test: SHELL:=/bin/sh
test:
	@echo "Running unit tests..."
	mix test ./test/hexerei_test.exs

cleanup: SHELL:=/bin/sh
cleanup:
	@echo "Cleaning up..."
	rm -rf ./_build
	rm -rf ./deps
