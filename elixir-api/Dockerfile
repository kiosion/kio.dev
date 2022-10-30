FROM elixir:1.14-alpine AS build

RUN apk upgrade --no-cache && \
    apk add --update bash openssl libgcc libstdc++ ncurses-libs

ARG ENV=prod

ARG SANITY_TOKEN
ARG SANITY_PROJECT_ID
ARG SANITY_DATASET="production"
ARG API_KEY

RUN mkdir /app
WORKDIR /app

# Add scripts
ADD ./bin/release .
ADD ./bin/start .

# Add source
COPY mix.exs mix.lock ./
COPY config config
COPY lib lib

# Run build script, passing in 'sanity_token' and other args
RUN ./release -p $SANITY_PROJECT_ID -d $SANITY_DATASET -t $SANITY_TOKEN -a $API_KEY

# Prepare release image
FROM alpine:3.16.2 AS app

RUN apk upgrade --no-cache && \
    apk add --update bash openssl libgcc libstdc++ ncurses-libs

EXPOSE 4000
ENV MIX_ENV=$ENV

# Prepare app dir
RUN mkdir /app
WORKDIR /app

# Copy release from build stage
COPY --from=build /app/_build ./hexerei
COPY --from=build /app/start .
RUN chown -R nobody: /app
USER nobody

# Run the app
ENV PORT=4000
ENV HOME=/app
ENV MIX_ENV=$ENV
ENTRYPOINT ["./start"]
