# Min version is 1.14-alpine
FROM elixir:1.14

# Build for prod unless overridden
ARG ENV=prod

ENV MIX_ENV=$ENV

WORKDIR /opt/Build

# Add needed scripts / env
ADD ./bin/release ./bin/release

ADD ./.env ./.env

# Entry point
CMD ["./bin/release", $ENV]
