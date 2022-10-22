.PHONY: dev, prod, test, cleanup

dev: SHELL:=/bin/sh
dev:
	@echo "target: Development"
	@./scripts/start.sh -m dev

prod: SHELL:=/bin/sh
prod:
	@echo "target: Production"
	@./scripts/start.sh -m prod

test: SHELL:=/bin/sh
test:
	@echo "target: Testing"
	@mix test ./test/hexerei_test.exs

cleanup: SHELL:=/bin/sh
cleanup:
	@echo "Cleaning up..."
	rm -rf ./_build
	rm -rf ./deps
