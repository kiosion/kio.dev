.PHONY: install, dev, backed, test, prod, cypress, vitest, netlify-deploy, sanity-deploy

# install svelte deps
install-web: SHELL:=/bin/bash
install-web:
	cd ./svelte-app;\
	yarn install 2> >(grep -v warning 1>&2)

# install sanity deps
install-sanity: SHELL:=/bin/bash
install-sanity:
	cd ./sanity-cms;\
	yarn install 2> >(grep -v warning 1>&2)

# install express deps
install-api: SHELL:=/bin/bash
install-api:
	cd ./express-api;\
	yarn install 2> >(grep -v warning 1>&2)

# install all deps
install: SHELL:=/bin/bash
install:
	make -j 3 install-web install-sanity install-api
	yarn install 2> >(grep -v warning 1>&2)
	yarn prepare
	clear

# build & run api
api: SHELL:=/bin/bash
api: install-api
api:
	cd ./express-api &&\
	MODE=dev yarn dev

# build & run sanity studio
sanity: SHELL:=/bin/bash
sanity: install-sanity
sanity:
	cd ./sanity-cms &&\
	SANITY_STUDIO_API_DATASET="dev" yarn sanity start

# build & run backends
server: SHELL:=/bin/bash
server:
	make -j 2 api sanity

# build & run web ui
web: SHELL:=/bin/bash
web: install-web
web:
	cd ./svelte-app;\
	yarn dev

# run full dev stack
dev: SHELL:=/bin/bash
dev:
	make -j 2 server web

# run dev backed
backed: SHELL:=/bin/bash
backed: install-web
backed:
	cd ./svelte-app;\
	yarn dev:backed

# build for prod
prod: SHELL:=/bin/bash
prod: install-web
prod:
	cd ./svelte-app;\
	SVELTE_ADAPTER_ENV=netlify \
	yarn build

sanity-upgrade: SHELL:=/bin/bash
sanity-upgrade: install-sanity
sanity-upgrade:
	cd ./sanity-cms &&\
	yarn sanity upgrade

# deploy sanity
sanity-deploy: sanity-upgrade
sanity-deploy:
	cd ./sanity-cms &&\
	yarn netlify deploy --dir=./dist --prod

# push to netlify
netlify-deploy: SHELL:=/bin/bash
netlify-deploy:
	cd ./svelte-app &&\
	yarn netlify deploy --dir=./build --prod

# test
test: SHELL:=/bin/bash
test: install-web
test:
	cd ./svelte-app;\
	SVELTE_ADAPTER_ENV=node \
	yarn build:test

# vitest
vitest: SHELL:=/bin/bash
vitest:
	./scripts/vitest.sh

# cypress tests
cypress: SHELL:=/bin/bash
cypress:
	cd ./svelte-app/;\
	yarn cypress install
	./scripts/cypress.sh
