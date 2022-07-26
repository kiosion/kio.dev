.PHONY: dev, staging, prod, sanity-deploy

# install deps
install:
	cd ./scripts && bash ./install.sh

# run dev servers
dev: install
	cd ./scripts && bash ./run-dev.sh

# run dev frontend
staging: install
	cd ./scripts && bash ./run-staging.sh

# run prod servers
prod: install
	cd ./scripts && bash ./run-prod.sh

sanity-upgrade: install
	cd ./sanity-cms && yarn sanity upgrade

# push sanity cms
deploy_sanity: install sanity-upgrade
	cd ./sanity-cms && yarn sanity deploy
